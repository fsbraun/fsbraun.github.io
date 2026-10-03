---
layout: post
title: Receiving and Parsing XRechnung Invoices in Django
description: "What building the inbound side of django-xrechnung taught me about treating invoices as untrusted input, as evidence, and as data — and why \"valid\" is the least interesting thing an e-invoice can be."
reading_time: 14
category: software-reuse
related_reads:
  - stop-rebuilding-apps
  - the-cms-is-not-the-application
---
Since January 2025, every business in Germany must be able to receive electronic invoices. Not PDFs attached to an email, but structured invoices following the European standard EN 16931: XRechnung in its UBL or CII syntax, or a hybrid format such as ZUGFeRD/Factur-X, where the XML travels inside a PDF. The obligation to *send* them phases in during 2027 and 2028. The obligation to *accept* them is already here.

Most of the discussion so far has been about sending. That makes sense: issuing an invoice is something you control. You choose the format, you generate the XML, you run the validator, and if it fails you fix your own data.

Receiving is a different problem. You get whatever your suppliers' software produces. Some of it is excellent. Some of it is a PDF with an XML attached that disagrees with the PDF. Some of it isn't an invoice at all.

I have been building [django-xrechnung](https://codeberg.org/fsbraun/django-xrechnung), a reusable Django application for issuing and receiving XRechnung documents. The outgoing side took most of the code. The incoming side took most of the thinking. This article is about that thinking — for Django developers who will build something similar, and for the people who will have to decide what their business does with the invoices that arrive.

**An incoming e-invoice is three things at once: untrusted input, legal evidence, and business data. Most implementations only treat it as the third.**

## A received invoice is a file someone else wrote

The naive implementation of "receive an XRechnung" looks something like this:

```python
def upload_invoice(request):
    tree = etree.parse(request.FILES["invoice"])
    Invoice.objects.create(
        number=tree.findtext(".//cbc:ID", namespaces=NS),
        total=Decimal(tree.findtext(".//cbc:PayableAmount", namespaces=NS)),
        ...
    )
```

Every line of it is a problem.

It parses arbitrary XML inside your web process, with whatever entity and DTD handling your parser defaults to. It trusts a file upload's size. It throws away the original. It picks the first `cbc:ID` it finds, which may not be the invoice number. It turns the document into a model, so the moment someone edits that model, your database no longer says what your supplier sent you. And if anything after `etree.parse` fails, nothing is stored at all: the supplier believes they delivered an invoice, and you have no trace of it.

django-xrechnung's inbound side is, to a large extent, the systematic removal of those assumptions. It is organized around a small number of rules.

## Rule 1: Commit the receipt before you look at it

The first thing the app does with incoming bytes is store them. Not parse, not validate — store.

```python
checksum = hashlib.sha256(original).hexdigest()
# A committed row exists before any untrusted parsing or validator execution.
with transaction.atomic(using=using, durable=True):
    document, created = ReceivedDocument.objects.get_or_create(
        inbox=inbox,
        sha256=checksum,
        defaults={"original": ContentFile(original, name="receipt.bin"), ...},
    )
if created:
    _attempt(document.pk, using, settings, limits)
```

Everything that can go wrong afterwards — malformed XML, a validator that is down, a PDF that explodes when decompressed, a bug in my own code — happens *after* a durable record exists that this document arrived, when, and in which inbox.

That has a consequence that is easy to trip over: ingestion refuses to run inside an enclosing transaction. If your project sets `ATOMIC_REQUESTS = True`, the upload view must be non-atomic. Otherwise an exception during validation would roll back the receipt along with everything else, and you would be back to "the supplier sent it and we have no record". The `durable=True` flag turns that from a convention into an error.

For developers, the general lesson is: **separate admission from processing.** Admission must be cheap, bounded, and nearly impossible to fail once the bytes are in hand. Processing can fail as often as it likes, as long as it can be retried.

## Rule 2: Treat invoices as hostile input

An invoice arrives from outside your organization, often by email, in a format designed for machines. That is a description of an attack surface.

XML brings its classic problems: entity expansion, external entities, absurd nesting. PDFs bring their own: compression bombs, cyclic object trees, attachments inside attachments. And the official validator from KoSIT, the coordination office that publishes the XRechnung rules, is a Java program you have to start with the untrusted file as input.

So all inspection in django-xrechnung runs in a separate, resource-limited worker process:

- The XML parser is a pull parser with entity resolution, DTD loading and network access disabled. Depth, total bytes and the number of embedded attachments are counted while streaming, so a limit triggers before the whole tree exists in memory.
- PDF extraction caps every decompression filter's output and rejects compression filters it doesn't expect.
- The worker sets `RLIMIT_AS`, `RLIMIT_CPU` and `RLIMIT_FSIZE` on itself — in a fresh process, never via `preexec_fn` inside a threaded Django server.
- The parent drains stdout and stderr into bounded buffers and enforces a wall-clock deadline shared across all steps.

The least glamorous part was killing processes correctly. The worker runs in its own session so that the whole process group can be terminated, including any children that kept the pipes open. But if you reap the child first, its pid can be recycled, and your `killpg` can hit an unrelated process. The fix is to check for exit with `waitid(..., WNOWAIT)`, which reports that the child exited without reaping it. It is a few lines of code, and exactly the kind of detail nobody gets right on the first attempt.

None of this is specific to invoices. But invoices make it non-optional, because accepting them is now a legal obligation. You cannot simply refuse documents from senders you don't trust.

**For business readers:** this is also why django-xrechnung validates locally. Online validators are convenient, but every invoice you upload there discloses your supplier relationships, prices and bank details to a third party. Running the validator on your own infrastructure costs a Java installation. Not running it locally costs you control over who sees your purchasing data.

## Rule 3: The original is the record

German tax law requires invoices to be kept in the form in which they were received, for the statutory retention period, currently eight years. For an e-invoice, that form is the XML file — or the hybrid PDF with its embedded XML. A table of extracted fields is not the invoice. Neither is a nicely rendered HTML view of it.

So received documents are immutable in django-xrechnung, and Django makes that easier to enforce than you might expect:

```python
class EvidenceQuerySet(models.QuerySet):
    def update(self, **kwargs):
        raise ValidationError("Receipt evidence cannot be updated.")

    def delete(self):
        raise ValidationError("Receipt evidence cannot be deleted through the app.")


class ImmutableEvidence(models.Model):
    objects = EvidenceQuerySet.as_manager()

    def save(self, *args, **kwargs):
        if not self._state.adding:
            raise ValidationError("Receipt evidence is immutable; append a new attempt.")
        kwargs["force_insert"] = True
        return super().save(*args, **kwargs)
```

`bulk_create` and `bulk_update` are blocked as well, foreign keys use `PROTECT`, and the admin offers no edit or delete actions. The original bytes live in Django storage, so they can be backed up, replicated or moved to cold storage like any other file, and their SHA-256 stays in the database.

It is important to be honest about what this does and doesn't achieve. It prevents the *application* from rewriting evidence by accident, which is where almost all real-world damage comes from. It doesn't stop a database administrator, and the hashes are integrity metadata, not signatures. Documentation that claims more than the code delivers is its own compliance risk.

The same principle extends to processing. A validation run is a `ValidationAttempt`, and attempts are immutable too. If the validator was misconfigured and you fix it, you retry, and the retry *appends* a new attempt. The history of what you checked, when, with which validator and rule versions, is preserved.

## Rule 4: Decide what "the same invoice" means

Suppliers resend invoices. Mail servers deliver twice. Someone uploads the same file again because they weren't sure the first upload worked.

django-xrechnung deduplicates by content: an inbox can contain a given sequence of bytes only once, enforced by a unique constraint on `(inbox, sha256)`. Re-ingesting identical bytes returns the existing receipt with `created=False`, doesn't reprocess it, and — just as important — doesn't fire the `document_received` signal again. To a host application listening for new invoices, a resubmission must not look like a second arrival.

But byte identity is a deliberately narrow definition. A supplier who regenerates an invoice produces different bytes for what is, commercially, the same invoice: a new timestamp in the XML is enough. Recognizing *that* as a duplicate requires business rules — same supplier, same invoice number, perhaps same amount — and those differ between organizations.

**For business readers:** byte-level deduplication protects you from technical duplicates. It does not protect you from paying the same invoice twice. That check belongs in your accounts-payable process, and it needs an owner.

## Rule 5: Four outcomes, not one

The most important design decision on the inbound side was to stop asking "is this invoice OK?"

Each processing attempt records four independent states:

- **Processing:** did the pipeline run to completion, or did a timeout, a missing validator or a resource limit stop it?
- **Validation:** do the official schema and business rules (KoSIT's Schematron for XRechnung, or the Factur-X rules for that profile) accept the XML?
- **Parsing:** could the values be extracted unambiguously?
- **Reconciliation:** do the amounts add up?

Each of them can also be `unsupported`, `unavailable` or `not_run`, and those are deliberately different from `rejected`. A validator that isn't installed doesn't make an invoice invalid. A profile the app doesn't know yet isn't a failed check. Collapsing all of that into one boolean is how systems end up rejecting good invoices whenever Java is missing — or, worse, accepting bad ones because a check silently didn't happen.

> **"Valid" means the format is right. It doesn't mean the invoice is correct, and it certainly doesn't mean you should pay it.**

The KoSIT validator checks a great deal, including many arithmetic rules. But it can't know whether you ordered these goods, whether the price matches your contract, or whether the bank account is the one your supplier has always used. That is not a failure of the validator. It is the boundary between format and business, and it is worth making visible in the software rather than letting "green checkmark" stand in for "approved".

## Rule 6: Parse into snapshots, not models

Once a document is validated, it is tempting to load it into your own invoice model. django-xrechnung deliberately doesn't. Parsed values are stored as a versioned JSON snapshot on the attempt, and received documents can never be turned into outgoing invoices or edited.

Three details matter more than they look.

**Values stay as they were written.** Amounts, quantities and dates are kept as the exact strings in the XML. Converting `"19.00"` to a `Decimal` or a CII date like `20261003` to a `date` is something a consumer can do when it needs to. A snapshot that has already normalized values can no longer show what the supplier asserted.

**Nothing is silently dropped.** EN 16931 is large, XRechnung adds to it, and real suppliers add more. The parser reads the fields it knows, and every leaf element and attribute it did *not* consume is listed in `unmodeled` together with its XPath. A tolerant parser that ignores what it doesn't understand looks robust, but it hides information that could matter, such as a document-level discount you didn't model. Listing what you didn't read is cheap and makes the gap explicit.

**Ambiguity is an error.** If a field that should occur once occurs twice, parsing is `rejected` rather than taking the first value. `findtext()` happily returns the first match. In an invoice, "the first match" can be the wrong number.

For CII, I used the maintained [drafthorse](https://pypi.org/project/drafthorse/) reader to check the document, but take values from the original tree. Libraries that bind XML to objects tend to normalize on the way in, and you never want to serialize a received invoice back from a binding. The original XML stays authoritative; everything else is a view on it.

## Rule 7: Reconcile what you can, and say what you can't

Reconciliation recalculates what can be recalculated: line net amounts from quantity and price, tax bases per VAT category, VAT per group, and document totals. It uses `Decimal` with cent rounding and `ROUND_HALF_UP`, and records each comparison with the asserted and the expected value, so that a mismatch can be shown to a person rather than reported as "invalid".

Just as important is what it refuses to do. Document-level allowances, prepayments, rounding amounts, foreign currencies and VAT rates other than Germany's 7% and 19% currently make reconciliation `unsupported`, with a reason. Factur-X MINIMUM and BASIC WL invoices don't carry line details at all, so there is nothing to reconcile them against.

A partial check never reports success. If I can check the lines but not the document-level discount, the honest answer is not "the lines matched". It is "I couldn't verify this invoice; here is why."

**For business readers:** plan for an exception queue from day one. Some fraction of incoming invoices will be unsupported by any given tool — an unusual profile, a PDF without embedded XML, two XML attachments where there should be one. A system that tells you *which* invoices need a human, and why, is far more valuable than one that claims to handle everything.

## The PDF is a picture of the invoice

Hybrid invoices deserve their own section, because they cause the most confusion.

A ZUGFeRD or Factur-X invoice is a PDF that humans can read, with an XML file attached that machines can read. For tax purposes in Germany, the structured part is authoritative. The PDF is a rendering of it — ideally a faithful one.

django-xrechnung extracts the embedded XML in the isolated worker, looking both in the PDF's embedded-files tree and its associated files (`/AF`), counting a file that appears in both only once. It requires exactly one XML candidate. If there are two, it doesn't pick one by filename; it marks the document `unsupported` and asks for review. Encrypted PDFs and PDFs without XML are retained, but not processed. There is no OCR.

And — this is the part I most want business readers to take away — the app does not check that the PDF *says the same thing* as the XML. That is a hard problem, and a validated XML says nothing about it. If your team approves invoices by looking at the PDF while your accounting system books the XML, you have two versions of the truth and no one comparing them.

## Pinning the rules you checked against

The XRechnung rules change. KoSIT publishes new validator configurations, Factur-X publishes new Schematron, and a document that passes today might not have passed a year ago, or vice versa.

So django-xrechnung pins both. The KoSIT installation is verified against a manifest of file hashes; the Factur-X rules are pinned to a specific version of the `factur-x` package and checked against bundled hashes before use. Every attempt records the validator version, the rule version and the hash of the scenario configuration it used.

Running KoSIT turned out to be its own small project. It compiles every scenario's Schematron at startup, which dominates the runtime of a single validation. Building the smallest configuration that serves each route — UBL Invoice, UBL CreditNote and CII for XRechnung, a single scenario per Factur-X profile — made a noticeable difference. For higher volumes, the app can talk to a long-running KoSIT daemon instead, which pays the startup cost once. The evidence then records that a daemon was used, because the application can't inspect the configuration the operator started it with, and pretending otherwise would be a false claim.

**For business readers:** "we validated it" is only meaningful together with "against which rules, on which date". If an auditor asks in five years why you accepted an invoice, the report and the rule version you checked it against are your answer.

## What I would tell a Django team starting this

If you are about to build e-invoice receiving into a Django project, or deciding whether to adopt something like django-xrechnung, these are the points I would put on the whiteboard:

1. **Store first, process second.** The receipt must commit before any untrusted parsing begins. Watch out for `ATOMIC_REQUESTS`.
2. **Isolate parsing and validation.** Separate process, resource limits, no entity resolution, bounded output. Accepting invoices is mandatory; trusting them isn't.
3. **Make evidence immutable in the ORM.** Override `save`, `delete` and the queryset's bulk operations, use `PROTECT`, and append rather than update.
4. **Keep outcomes separate.** Processing, validation, parsing and reconciliation answer different questions. `unsupported` and `unavailable` are not `rejected`.
5. **Snapshot, don't import.** Keep asserted values as strings, list what you didn't read, and reject ambiguity instead of guessing.
6. **Use `Decimal` and say what you didn't check.** A partial reconciliation must never look like a pass.
7. **Pin and record your rules.** The validator version is part of the evidence.

And for the business side:

1. **Receiving is already mandatory.** If your process still assumes invoices arrive as PDFs to be typed in, it is behind the law, not ahead of it.
2. **The XML is the invoice.** Approve what you book, and be aware of when people look at the PDF instead.
3. **Valid isn't payable.** Format validation removes one class of error. Contract, delivery and bank-detail checks are still yours.
4. **Expect exceptions, and staff them.** The right tool tells you which invoices need a person and why.
5. **Keep the original and the evidence.** Eight years is a long time to explain a decision without records.
6. **Know where your invoices go.** Validating locally keeps purchasing data inside your organization.

## Why this belongs in a reusable application

None of the rules above is exotic. But each of them takes time to discover, usually after something has gone wrong: the receipt that disappeared in a rolled-back transaction, the duplicate that was paid twice, the validator outage that marked a week's worth of invoices as invalid.

Every German business running on Django will need to solve this problem, and most of them will be solving it for the first time. That is exactly the situation I described in [Stop Rebuilding the Same Django App for Every Client](/writing/stop-rebuilding-apps/): recurring knowledge that should accumulate in software instead of being rediscovered project by project.

django-xrechnung is open source under the BSD license, currently in beta, and its [documentation](https://django-xrechnung.readthedocs.io/en/stable/how-to/receive-documents.html) covers the receiving workflow in detail. Its scope is still limited — German parties, EUR, and a defined set of profiles — and it says so in its [supported-invoice reference](https://django-xrechnung.readthedocs.io/en/stable/reference/supported-invoices.html) rather than pretending otherwise.

If you are receiving e-invoices in Django, I would like to hear what arrives in your inbox. Especially the invoices that don't fit.
