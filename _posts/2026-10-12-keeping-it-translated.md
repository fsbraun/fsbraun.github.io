---
layout: post
title: "Translating a page is solved. Keeping it translated isn't."
description: "Machine translation made the first translation cheap. The hard part is every day after it: knowing what is stale, what is inconsistent, and what nobody approved."
reading_time: 8
category: content-systems
related_reads:
  - plugin-architecture-is-editor-experience
  - the-cms-is-not-the-application
---
In 2026, translating a page costs one click and a few cents.

Almost every CMS has a DeepL integration or an AI plugin by now, and every LLM will translate
whatever you paste into it, in any tone you ask for. If your problem is "I have an English page
and I need a German one", that problem is solved, and solved well.

So why do multilingual sites still feel like a chore? Why does every agency I talk to have a
story about the French version that was "a bit behind" for half a year?

Because the hard part was never the first translation. It's every day after it.

## The day after launch

Here's how it usually goes. The site launches in English, German and French. Everything is
translated, reviewed, published. Everyone is happy.

Three weeks later, marketing changes the pricing paragraph on the English page. Someone
updates the German page, because the German market matters this quarter. Nobody touches
the French one. Nothing tells anyone that it is now wrong.

A month later, the blog gets a new post. The blog is a separate module, translated with a
different tool, by a different person, and the product is called "Starter plan" on the pages
and "Basic package" in the blog.

Half a year later, someone adds Polish. Three hundred pages, a blog, a product catalog. The
translation button works on each page. It doesn't tell you which three hundred pages, or what
it will cost, or which of them were going to change next week anyway.

None of this is a translation problem. Every single sentence was translated perfectly. It's a
**state** problem: nobody knows what is current, what is behind, and what is inconsistent.

## It's not a made-up story

That story is invented, but the problems aren't. Read the public issue trackers of open-source
CMSs and their translation plugins, and the same complaints come up again and again, from
agencies, in-house teams and single developers. All quotes below are real.

**"Which pages are out of sync?"** An agency asked for a table with "the languages" as columns
and "the status of translation" for every page, because "once you lost track it nearly
impossible to track it down if you have many pages". A team with tens of thousands of
machine-translated pages wrote that they "need to see the number of Pages that have manual
translations", and that it took SQL queries against the database to find out. Others just want
the editing screen to show which language tabs are still empty.

**"I changed a comma and the translation is gone."** One team reported that changing the
source "just deletes the previous translation without fallback … even if it's just a small
change like a comma missing". Another put it more bluntly: "translated strings are repeatedly
lost when a user changes the source string. This makes regular users REALLY angry!"

**"Half-translated pages go live."** A developer found that the only way to apply translations
to a page was to publish it: a page that's halfway translated can't be saved as a draft.
Another, adding Spanish to an English site, found that "all the Spanish pages will be instantly
published, and will use the English content".

**"We wrote our own script."** One developer was trying "to automate the translation of a …
website with hundreds of pages" and set out to write a script that sends everything to DeepL.
Others ask for empty fields to be filled by a local LLM in the background. Every team builds,
or wishes for, the same plumbing.

**"And what about everything that isn't a page?"** Products, reusable content blocks and other
data outside the page tree don't fit the page-based workflow, an agency explained; others asked
for a way to filter that content by translation status at all.

One agency summed it up: "The top customer complaint we get is probably that the sync does not
work."

## Four things a translate button can't know

When I list what goes wrong after the first translation, it falls into four groups.

**1. Currency: which translations are out of date?**
To know that the French pricing paragraph is stale, something has to remember *which version
of the English text* the French one was made from. A button that translates on demand has no
such memory. It translates; it forgets.

**2. Consistency: are we saying the same thing everywhere?**
Product names, legal terms, the formal or informal "you" (*Sie* or *du*, *vous* or *tu*). Each
translation is reasonable on its own; together they contradict each other. Consistency needs a
glossary and a memory of how we translated things before, shared across every place where
content lives.

**3. Control: who decided this is ready?**
Machine translation is good enough to be dangerous. It reads fluently, so nobody checks it.
A broken link, a mangled placeholder, an alt text that says nothing, a brand name translated
into a common noun. The fix isn't to avoid machine translation; it's to make sure nothing is
published without a person approving it, and that obvious errors are caught before that.

**4. Coverage: is *all* the content in the picture?**
Pages live in the CMS. The blog is a separate module. Products live in a shop or a catalog
database. Most tools see one of these. The editor sees all of them, and so does the visitor.

What these four have in common: they need **memory over time**. Which source text was each
translation based on? Which terms did we agree on? What did a person approve, and when? Which
content exists in which languages?

A plugin that runs when you click a button is stateless by design, and that's fine for what
it does. But the work that eats agencies' time is stateful.

## What I'd want as an editor

Strip away the technology, and what an editor needs is surprisingly simple:

- **A list of what's behind**, per language: "French: 12 texts out of date, 3 missing." Not a
  feeling, a list.
- **One action to fix it**: retranslate exactly those texts, nothing else, and put the
  results somewhere I can review them. A draft, not a published page.
- **The same words everywhere**: if I decide that "Starter plan" is "Einstiegstarif" in German,
  that decision applies to the pages, the blog and the product catalog.
- **Errors caught before I see them**: a link that disappeared, a placeholder that broke, a
  meta description that's now 240 characters long.
- **For agencies: the same overview across every client site**, so the question "which client
  is behind?" has an answer before the client asks it.

None of this is exotic. It's how software teams have handled translations of interface texts
for decades: translation files know when a source string changed and mark the translation as
*fuzzy*, to be checked, instead of throwing it away. Content never got the same treatment,
because content lives in many places, many formats and many tools.

## What makes it hard

If it's so obvious, why doesn't every CMS do it?

Because "which version was this translated from?" is harder than it sounds once content is
structured. A page is a tree of components or blocks, often with new IDs every time a new
version is saved. One system stores translations as extra rows, the next as extra columns, a
third as JSON in a single field. To say "this paragraph in French is stale", you need a stable
identity for every translatable piece across versions, languages and storage formats, and a
reliable way to tell whether its source changed.

That's plumbing. It's not glamorous, and no single plugin has a reason to build it across all
the places content lives.

## What I'm building

Disclosure: I'm the django CMS fellow, and what follows is my own project, Ponyglot, not a
django CMS Association product.

Ponyglot is that plumbing, for sites built on Django: open-source connectors for django CMS,
Wagtail, django-parler and django-modeltranslation extract every translatable field into one
model, where each piece has a stable key and a fingerprint of its source text. Taking the
problems above one by one:

- **"Which pages are out of sync?"** A matrix per page of what's up to date, stale, in review or
  missing, per language; a stale overview per site; and the same counts across all your sites.
  Content outside the page tree gets the same status as pages.
- **"I changed a comma."** The text shows as *stale*, like a fuzzy entry in a translation file.
  The live translation stays until a new one is approved, and translations an editor wrote by
  hand are never overwritten.
- **"Half-translated pages go live."** Results arrive as drafts, or as suggestions with a diff
  for content that has no drafts. Publishing is the approval; nothing is published
  automatically.
- **"We wrote our own script."** "Translate stale and missing" is one action, with a cost
  estimate first, from the dashboard, the CMS admin or the command line.
- **"Everything that isn't a page."** Pages, blog, products and other content share one
  glossary, one translation memory and one status.
- And QA checks for links, placeholders, HTML, length and SEO flag errors before anything is
  published.

It doesn't solve everything. Preparing a change as a draft in the source *and* the
translations at the same time, one of the most-requested wishes, is still open: Ponyglot
translates the published source. Regional variants derived from a parent language (French for
Belgium from French for France) aren't modelled yet either.

The translation itself is the boring part: DeepL or an EU-hosted LLM, whichever fits the
language. The free tools are great at it, and I'd rather work with them than against them.

We're onboarding a small group of agencies and product teams now. If your multilingual site
has a French version that's "a bit behind", I'd love to hear how you handle it today:
[ponyglot.app](https://ponyglot.app/?ref=blog-keeping-translated).

---

*Next in this series: how to know which translations are stale, with fingerprints and a few
lines of code.*
