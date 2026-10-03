---
layout: post
title: AI Doesn't Replace Engineering. It Moves It Up the Stack.
description: "Every layer we automate makes the layer above it the new bottleneck. AI is another step in an old progression — and it changes the size of the thing an engineer can hold."
reading_time: 9
category: automation-ai
related_reads:
  - open-source-is-dying-again
  - what-if-brute-force-produces-insight
---
In [Open Source Is Dying Again](/writing/open-source-is-dying-again/), I argued that when code becomes abundant, architecture counts. That was a claim about *what* becomes scarce. This one is about the mechanism behind it, and where it leads if you keep following it.

The usual debate is whether AI can replace engineers. I think that's the wrong question. "It can't, because it makes mistakes" ages badly with every model release. "It can, look at this demo" ignores everything that happens after the demo. The more useful observation is this:

**Every layer we successfully automate makes the layer above it the new bottleneck.**

## Following the bottleneck

Not long ago, the expensive step was writing the implementation. AI tools now take a large part of it, and agentic workflows extend the chain until routine maintenance runs largely on its own:

```text
problem → implementation → tests → documentation
issue → diagnosis → implementation → tests → pull request
dependency update → compatibility analysis → fixes → CI → release candidate
```

Excellent. We should automate all of it. There is no reason to keep repetitive mechanical work manual just for its own sake; the version pins will not miss us.

Once the pull request appears by itself, the question that takes the time is no longer *how do I write this?* but *should we merge it?* So we automate much of the review as well — architectural analysis, compatibility risks, a suggested decision — and the bottleneck moves again:

```text
Should we merge it?
  → Does this belong in the product?
    → What should the product become?
```

Each step is real progress. Each also moves the remaining work somewhere harder to describe, harder to measure, and harder to hand over.

## An issue that fixes itself

Take a mature library and an ordinary issue:

> Feature X doesn't work on Python 3.15.

An agent can plausibly handle all of it. It reproduces the failure, finds the change in Python that caused it, adapts the implementation, adds a regression test, runs the compatibility matrix, writes a changelog entry, and opens a pull request.

Measured by the activities we used to call engineering, almost nothing is left to do.

Yet someone still has to decide whether Python 3.15 should be supported yet. Whether the fix preserves compatibility for every user, not only for the test suite. Whether the changed abstraction is the right one, or merely the one that made the tests pass. Whether this warrants a release, and whether downstream projects need to know before it ships.

The code alone doesn't determine any of these answers. They also depend on the project's history, its users, its promises, and where it is going. Much of the engineering in this example is genuinely gone. What remains has moved up.

## We have done this before

That pattern is not new. Every major advance in software engineering has removed work developers at the time considered essential. Compilers removed most assembly programming. Garbage collection removed manual memory management from most application code. Frameworks removed enormous amounts of plumbing. Cloud platforms and managed databases removed much of the work of running servers and keeping them alive.

Much of that difficulty didn't move anywhere. It disappeared. Nobody mourns that web developers no longer allocate registers or implement TCP, and nobody had to pick that work up elsewhere.

But none of these steps eliminated engineering. Developers stopped worrying about memory layout and started worrying about data models, latency, consistency and user experience — problems that were always there, but out of reach behind the work of getting anything to run at all.

**Some difficulty disappears entirely. What remains moves upward.**

AI is another step in that progression, unusual mainly in its size and speed. It can genuinely eliminate large amounts of engineering work. The question is what remains, and where it goes.

## From code to intent

The question used to be: *how do I implement this?* Increasingly it is: *what exactly should happen?*

I rarely write tests from scratch anymore. I still decide what needs testing, which behaviour is a contract, and whether a test proves what it claims to prove. Typing the fixtures and assertions is increasingly a machine's job. Oddly, that hasn't made me think less about testing — only at a different level.

A vague ticket used to be partly self-correcting: a developer would run into the awkward case and come back with a question. Implementation was slow enough to double as discovery. An agent working from the same ticket produces, quickly and confidently, a beautifully implemented version of the wrong thing.

So more of the work goes into expressing **intent** precisely. That isn't prompt engineering. It is the part of engineering we used to do implicitly, while typing.

## From implementation to boundaries

When you can build almost anything, *what not to build* matters more. Should this be in the core or an extension? Is this an API, or a detail that should stay free to change? Do these two things share an abstraction, or just look similar today?

AI is very good at producing abstractions when asked. It is much less useful at telling you whether you should have one in the first place.

Boundaries were always the expensive decisions: you can't cheaply undo them once others depend on them. When the code inside them becomes cheap, the boundaries are most of what's left.

## From components to systems

This is the change I find most interesting.

Instead of spending an afternoon implementing one component, I can spend it exploring three approaches. An agent prototypes each one. Another generates the migrations, writes integration tests, and checks what breaks for existing users. I read the results, throw two away, and keep the parts of the third that worked.

**AI doesn't merely make the same engineer faster. It changes the size of the thing an engineer can hold and manipulate.**

Not long ago, I mostly manipulated functions. Then modules. Increasingly, whole subsystems: I can ask what would happen if a layer worked differently and get an answer in the form of working code, not a diagram and a guess.

That is a different job, not a faster version of the old one.

## Architecture becomes executable

Historically, architecture was expensive to test. You could argue for approach A or approach B, but building both properly might take months. So architectural decisions rested heavily on prediction: the most experienced person in the room imagined how each option would behave under load, under change, and under five years of feature requests.

If prototypes become cheap enough, architecture becomes increasingly **empirical**.

Instead of three meetings about whether an approach will work, have agents build representative slices of both. Benchmark them. Write the ugly cases. Simulate the migration from the current system. Try next year's likely feature request and see which design absorbs it.

That doesn't make experience worthless. Experience is what tells you which slices are representative and which ugly cases matter. And it changes what the valuable skill is: when producing answers becomes cheap, knowing **which uncertainty is worth spending computation on** becomes the scarce part. Seniority may come to mean less knowing the answers, and more knowing which questions are worth paying to answer.

## It doesn't stop at architecture

So far, this sounds like an argument that architects are safe. I don't think the movement stops there.

Imagine software maintenance that is close to autonomous. Agents watch dependencies, fix regressions, review each other's changes, prepare releases and monitor production. Architectural analysis is excellent, and the suggested decisions are usually right.

What is left is **product judgment**. Which users matter most when their needs conflict? Which incompatibilities are worth imposing? Which architecture enables the next five years rather than the next release? Which feature request is a local requirement that should stay out of the core? When should an old abstraction finally be allowed to die?

There is an old word for the people who make those calls on a long-lived system: stewards. A steward carries enough context to know why the system looks the way it does, enough authority to decide where it goes next, and enough continuity to live with the consequences. None of those three is a property of code, and none of them is produced by producing more of it.

Now suppose AI becomes excellent at recommending product decisions too. It models the user base, simulates migration costs, and proposes a roadmap better argued than most human ones.

What is left then is **accountability**. Someone still has to decide whose interests the system serves, and answer for it when those interests conflict. Accountability isn't primarily a capability. It is a role. It exists because the people affected by a decision need someone who can be asked, persuaded, challenged, overruled or replaced.

Followed all the way through, the stack looks like this:

```text
code → intent → boundaries → architecture → product judgment → accountability
```

Each layer was always there. What changes is how much of the work sits in it.

## The uncomfortable part

None of this means every engineer is fine.

The risk isn't that engineering disappears. It's that engineers keep working at the old layer while that layer is automated underneath them.

Someone who describes their job as

> I turn tickets into Python.

has a problem, because that description is now a reasonable specification for software.

Someone who describes it as

> I understand this domain well enough to turn ambiguous needs into systems that survive contact with reality.

has suddenly acquired extraordinarily powerful tools.

There is a harder question hidden here. Nobody is born with context. People learned to work at the higher layers by spending years at the lower ones: fixing bugs in unfamiliar corners of a codebase, writing tests that reveal how a system really behaves, implementing small features and watching them collide with large ones. That work was never only output. It was also how people learned what the output meant.

There is a paradox here: AI may make experienced engineers dramatically more capable while making it harder for inexperienced engineers to become experienced.

If agents now do that work better, AI doesn't only move engineering upward. **It may remove the ladder people used to climb to get there.** Learning will have to happen more deliberately — closer to the people who already carry the context, as programs like [Djangonaut Space](https://djangonaut.space) already practise. That is a real problem. But it is a problem of how we pass on the craft, not a sign that the craft is going away.

## Code was never the decision

We have been moving up the stack for as long as software engineering has existed.

AI is unsettling because the layer being automated this time is the one many of us identify as engineering itself: writing code. For a generation of developers, the code *was* the work, and being good at it was being good at the job.

I suspect that identification will come to look as strange as equating programming with register allocation.

Code is one representation of an engineering decision. It has never been the decision itself.

If machines become extraordinarily good at producing the representation, we get to spend more of our time on what mattered all along: understanding what should exist, how its parts should fit together, and who answers for the choices we make.

**AI doesn't replace engineering. It moves it up the stack.**
