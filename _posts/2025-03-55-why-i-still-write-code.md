---
layout: post
title: Why I Still Write Code
description: On staying close to automation, retaining digital sovereignty, and designing software that can evolve for decades.
reading_time: 5
category: software-reuse
---
I have been writing software for a long time, long enough to see technologies arrive with great enthusiasm and disappear again, and long enough to see systems outlive the assumptions under which they were built.

I still write code.

Not because writing code itself is the goal. Much of what I care about is actually the opposite: automation, making machines do work so humans don't have to. But I have found that staying close to the code matters, especially when building automation, maintaining digital sovereignty, and designing systems that are supposed to last.

## Close to the automation

I like automation because good automation quietly removes repetitive work. It turns knowledge into something executable and repeatable, and it can make an organization not only faster but also more reliable.

There is a temptation, however, to treat automation as a black box: something goes in, something useful comes out, and as long as that continues to happen, nobody needs to understand too much about what happens in between.

That works until it doesn't.

Automation encodes decisions and assumptions about processes, data, responsibilities, and exceptional cases. Over time, those assumptions become part of how an organization operates, often without anyone consciously deciding that they should.

The closer automation gets to important processes, the more important I find it to understand its internals. Writing code keeps me close to that layer and lets me see which decisions we are actually encoding, where complexity accumulates, and which dependencies we introduce.

The objective is not manual work, but automation we understand.

## Digital sovereignty is practical

Digital sovereignty can sound like a political or abstract concept, but for me it is much more practical. Can we understand the systems we depend on? Can we operate them ourselves? Can we modify them when our requirements change? Can we move them somewhere else?

And can we keep them running if a vendor changes direction, disappears, or simply decides that our use case is no longer interesting?

These questions become increasingly important as software becomes infrastructure. A system that is convenient today can become a dependency tomorrow, and once enough processes, knowledge, and data accumulate around it, replacing it becomes difficult regardless of what the original procurement decision said.

Open source is an important part of this, but open source alone is not sovereignty. Having access to source code is valuable; having the capability to understand, operate, and change that code is something else.

That capability has to exist somewhere.

For me, continuing to write code is part of maintaining it.

## Decades change the design problem

Many software discussions happen on a surprisingly short timescale. We talk about the next release, the next migration, the next framework, perhaps the next few years.

Some systems live much longer than that.

django CMS has been evolving for many years, across generations of Python, Django, browsers, deployment models, contributors, and organizations. A.IX is also built with the expectation that the systems around it should not simply disappear with the next technology cycle. Technology has vanished, A.IX has not.

Once you start thinking in decades, the design problem changes. It is no longer enough to ask whether something works today. You have to wonder whether someone will understand it ten years from now, whether individual components can be replaced, and whether today's dependencies are quietly determining tomorrow's possibilities.

You also have to accept that you cannot predict what those possibilities will be.

That changes how I think about architecture. Extensibility matters, but so does restraint. Stable interfaces matter. Clear ownership of data matters. Perhaps most importantly, the ability to replace parts of a system without replacing the whole system matters.

## Good design compounds

Architecture is often discussed as an upfront investment: spend more time designing something now and development may become easier later. In long-lived systems, I think the effect is stronger than that.

Good design compounds.

A clear boundary makes one change easier, then another, then another. A stable interface allows implementations behind it to be replaced. A deliberately small core reduces the number of assumptions that have to survive every technological generation.

The opposite compounds too. A convenient shortcut becomes a dependency, the dependency becomes an assumption, and the assumption spreads through the system. Years later, changing it requires touching things that appeared completely unrelated when the original decision was made.

None of these decisions necessarily look dramatic at the time.

Their significance emerges with time.

This is why systems intended to last need restraint. Not every possibility needs an abstraction, not every new technology needs to become part of the foundation, and not every problem requires another layer.

Often, good architecture is as much about what a system does not know as what it does.

## Longevity requires change

Software that lasts for decades does not survive by staying the same. Operating systems change, databases change, deployment models change, security expectations change, organizations change, and the people maintaining the software certainly change.

Long-lived software survives because it can change.

That means designing not to preserve today's implementation, but to preserve the ability to replace it. Those two goals can look similar when a system is young, but over a decade they lead to very different architectures.

A stable system is not one in which nothing moves.

It is one in which things can move without everything moving at once.

This is why I care about interfaces, boundaries, modularity, and ownership of data. They are sometimes treated as architectural aesthetics, but their real value is much more practical: they make change affordable.

## Simplicity is operational freedom

There is another connection between good design and digital sovereignty that I think is easy to overlook: complexity reduces freedom.

Every additional service, dependency, platform, protocol, and abstraction introduces another thing that has to remain available and understood. Sometimes that complexity is absolutely justified, but it has a cost beyond development effort.

Complexity narrows the set of people who can understand a system. It increases the number of external decisions that can affect it. It makes migrations harder and independent operation more difficult.

Simplicity therefore has strategic value.

A system you understand is a system you can change, and a system you can change is a system you have a chance of keeping.

## Why code?

None of this strictly requires me to write code myself. Architecture can be discussed in diagrams, processes can be documented, and implementation can be delegated.

But I don't want architecture to become detached from implementation.

Code is where I can test whether an abstraction is actually useful. It is where I discover whether a boundary is clean or merely looks clean in a diagram. It is where the operational consequences of a design decision eventually become concrete.

Sometimes the fastest way to understand a system is still to build (at least a part of) it.

Writing code keeps that feedback loop short. It keeps me close to the automation and keeps architectural decisions connected to their consequences. Perhaps just as importantly, it maintains my own ability to change the systems I depend on rather than merely consume them.

## Building things we can keep

I am less interested today in how quickly software can be built than I once was. Speed matters, of course, and there are plenty of situations where it is the right thing to optimize.

For important systems, however, I increasingly find myself asking a different question.

Can we keep this?

Can we understand it, operate it, adapt it, and still make meaningful decisions about it years from now? Can the people who come after us do the same, without having to reconstruct all the assumptions we made along the way?

That is ultimately what digital sovereignty means to me. It does not mean doing everything yourself, avoiding external technology, or avoiding automation. It means retaining enough knowledge and control to make your own decisions.

It means retaining agency.

Good architecture creates that agency. Open systems create that agency. Knowledge creates that agency.

And for me, writing code is still part of maintaining it.

That is why I still write code.
