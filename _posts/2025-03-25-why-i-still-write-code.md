---
layout: post
title: Why I Still Write Code
description: Why writing code still matters to me when building automation and systems meant to last.
reading_time: 10
category: software-reuse
---
I have been writing software for a long time, and my role has changed considerably along the way. I spend more time today thinking about architecture, product direction, automation, and the long-term consequences of technical decisions than about implementing individual features.

And yet, I still write code.

The reason is not that I think writing code is inherently valuable, or that everything important should be implemented by hand. Quite the opposite: I believe strongly in automation and in moving repetitive implementation work out of the way.

**I still write code because technical judgment requires contact with engineering reality.**

## Staying close

It is possible to understand a software system at many levels. You can understand its product, its architecture, its interfaces, its deployment, or the organization around it without knowing every detail of its implementation.

That distance is often useful. Architecture requires abstraction, and technical direction requires looking beyond the problem immediately in front of you.

But distance has a cost.

A clean architecture diagram does not tell you where an abstraction becomes awkward in practice. A specification does not necessarily reveal which existing assumption it violates. A pull request can look perfectly reasonable in isolation while gradually moving a system in the wrong direction.

Writing code occasionally takes me back into that reality.

I encounter the boundary that looked cleaner from above. I discover why an old piece of code is more complicated than I expected. I find that something I wanted to generalize should perhaps remain specific, or that two apparently unrelated problems are symptoms of the same architectural weakness.

Those observations influence decisions much larger than the code I happened to be writing.

## Close to the automation

This is particularly important to me because I like automation.

Good automation removes repetitive work, makes knowledge executable, and allows people to concentrate on decisions that actually require their attention. Much of my work over the years has been about making systems do more so that people have to do less.

But automation also creates distance.

Once something works reliably enough, we stop thinking about what happens inside it. That is often exactly what we want. Nobody should need to understand an entire technology stack merely to complete an everyday task.

The situation changes when we are responsible for the system itself.

Automation encodes assumptions about processes, data, responsibilities, and exceptional cases. Those assumptions gradually become part of how an organization operates, often surviving much longer than anyone originally expected.

Being close to the implementation helps me understand what we are actually automating, rather than only what we intended to automate.

The goal is not to do manually what a machine could do for me.

The goal is to understand enough to remain in control of what the machine does.

## Systems have surprisingly long lives

Software has a tendency to live longer than expected.

django CMS is a good example from my own work. It has evolved through many generations of Python, Django, browsers, deployment practices, contributors, organizations, and ideas about what a content management system should be.

A.IX is different, but the underlying design question is similar: what does it mean to build systems that may still matter decades from now? When investing is long-term the software also needs to be long-term.

Thinking in decades changes how I look at software.

The interesting question is no longer whether an architecture is elegant today. It is whether the system can absorb changes we cannot yet predict, whether parts can be replaced without replacing everything, and whether somebody will still be able to understand why important decisions were made.

Long-lived software does not survive by staying the same.

It survives because it can change.

## Good design compounds

This is where architecture becomes less theoretical.

A clear boundary might save a little work today, but over many years it can make hundreds of changes easier. A stable interface can allow several generations of implementations to come and go behind it. A deliberately small core reduces the number of assumptions that must survive every technological cycle.

Good design compounds.

Bad design compounds too. A convenient shortcut becomes a dependency, the dependency becomes an assumption, and eventually that assumption appears in places nobody anticipated when the original decision was made.

After enough years, the cost of a design decision has remarkably little to do with the amount of code involved.

This is one reason I still want to experience some of those decisions at implementation level. Architecture is not something decided once and subsequently implemented. It emerges through many small decisions made over the lifetime of a system.

You cannot steward a long-lived software system entirely from above.

## Designing for replacement

When building software expected to last, I don't think the objective should be to preserve today's implementation.

The objective should be to preserve the ability to replace it.

Operating systems change. Databases change. Frameworks change. Infrastructure changes. Organizations change. Requirements change. People certainly change.

Trying to predict all of those changes is futile.

What we can do is design boundaries that limit how far a change propagates. We can be deliberate about ownership of data. We can keep interfaces smaller than their implementations. We can avoid making the core of a system dependent on things that are likely to be temporary.

A stable system is not one in which nothing moves.
It is one in which things can move without everything moving at once.
That principle matters much more to me today than choosing the supposedly perfect technology for a particular moment.

## Digital sovereignty

There is a broader principle behind this that I increasingly think about as digital sovereignty.

The term is often discussed at the level of governments, cloud providers, regulation, or open-source policy. Those are important conversations, but there is also a very practical version of it.

Can we understand the systems we depend on? Can we operate them? Can we modify them when our requirements change? Can we move them? Can we keep them running when someone else's priorities change?
Open source helps, but access to source code alone does not create sovereignty.

Capability does.

An organization that technically possesses the source code to an important system but no longer has the knowledge required to understand or change it is not particularly sovereign.

The same principle applies at a personal level.

I don't need to implement everything myself, and I don't want to. But I want to retain the ability to investigate a system, understand the important parts, question its assumptions, and change it when necessary.

Writing code maintains some of that capability.

## Simplicity creates freedom

This also explains why I increasingly value simplicity.

Every additional dependency, service, abstraction, platform, and protocol may solve a real problem, but it also introduces another thing we depend on and another piece of knowledge someone has to maintain.

Complexity therefore has an organizational cost beyond development effort.

It reduces the number of people who can understand a system. It increases the number of external decisions that can affect it. It makes replacement harder and independent operation more expensive.
Sometimes that cost is absolutely justified.
But it should be a decision rather than an accident.

A system you understand is easier to change, and a system you can change is a system you have a chance of keeping.

## Coding is not the output

This changes what writing code means to me.

Earlier in my career, code was much more directly the occasional output of my work. A problem needed solving, and I implemented the solution.
Today, the most valuable outcome is often a decision: identifying the actual problem, finding the right boundary, choosing what should remain stable, deciding what should be replaced, or recognizing that something should not be built at all.

Writing code supports those decisions.

Sometimes I implement a small part because I want to test an architectural assumption. Sometimes I need to follow a problem deeply enough to understand where it actually originates. Sometimes building something is simply the fastest way to discover whether an idea survives contact with reality.

The amount of code I produce is therefore becoming less interesting to me.

The quality of the judgment it enables is much more interesting.

## Knowing when to go down a level

Moving toward architecture and technical stewardship does not mean continuously moving further away from implementation.

It means being able to move between levels.

Sometimes the right place to work is the product direction. Sometimes it is the architecture. Sometimes it is an interface or specification. And sometimes the uncertainty cannot be resolved from there, and the right thing to do is to go down another level and look at the code.

Then you come back up with better information.

The further I move from implementation as my primary job, the more deliberate I become about which code I still write.

I don't write code because writing code is the objective.

I write it to stay close enough to the systems I help shape that my decisions remain grounded in how those systems actually work.

For systems that should remain understandable, adaptable, and ours to change for decades, I think that matters.

That is why I still write code.
