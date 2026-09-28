---
layout: post
title: Open Source Is Dying Again
description: "AI is breaking the reciprocity that kept open source going — through licenses, reputation, and the cost of forking. What remains is the reciprocity that was always worth the most: passing knowledge on."
reading_time: 10
category: software-reuse
related_reads:
  - why-i-still-write-code
  - join-djangonaut-space-program
---
Open source has died many times already.

It was supposed to die when large companies decided it was a threat. It was supposed to die when those same companies decided it was a business model. It was supposed to die when cloud providers started offering managed versions of projects they did not maintain, and again when projects responded by switching to licenses that were no longer open. Every few years, someone discovers that the maintainers of critical infrastructure are unpaid and exhausted, and the obituaries get written once more.

And yet the ecosystem kept growing.

So I am suspicious of anyone announcing the end of open source. But I also think this time is different, because the thing that is changing is not a business model or a license. It is the cost of the work itself.

**AI has not killed open source. It has killed the bargain that open source contributors thought they had made.**

## The old bargain

Nobody ever wrote the bargain down, but most contributors understood it.

You publish your work. Others may use it, study it, change it, and often build businesses on it. In return, a few things hold. Your name stays attached to the work. The license sets the terms under which others reuse it. And the quality of your contributions becomes visible: you build a reputation, and that reputation turns into jobs, invitations, clients, and influence.

None of this was ever guaranteed. But it was stable enough that people chose to take part.

At its core, the bargain was about reciprocity, though never of the one-to-one kind. Nobody paid back the specific person whose library they used. You took from the commons and gave back to the commons. Anthropologists call this generalized reciprocity: it works across a whole community rather than between two parties. That is why it survived obvious free-riding. Enough people gave back, and everyone was also a user of everyone else's work.

Open source never relied on goodwill alone to keep that going. Licenses made reciprocity a legal obligation, at least for attribution and, with copyleft, for sharing changes. Reputation made it visible. And economics made it sensible.

Each of those assumptions is now under pressure.

## Copying has become cheap

Open source always depended on a subtle economic fact: even with the source code available, reproducing a mature project was expensive.

You could read every line of Django. That did not mean you could build a comparable framework over a weekend. The value was not only in the code but in the thousands of decisions embedded in it, and understanding those decisions took time. So it was usually cheaper to use the project, and often to contribute back, than to rebuild it.

That cost has collapsed.

A model trained on public code can produce something that looks very much like the solution a project arrived at over years, adapted to a slightly different context, in minutes. The patterns, the idioms, the carefully chosen boundaries are all available as raw material. Work that once required a developer to understand and reproduce an implementation can increasingly be generated from a description of the desired result.

The incentive to use the original, and with it the incentive to contribute to it, becomes weaker.

This matters more than it seems, because contributing back was rarely pure altruism. Companies upstreamed their patches because maintaining a private fork was expensive. Every new release meant merging their changes again, so giving the changes to the project was the cheaper path. Reciprocity was, to a large extent, simply the rational choice.

AI lowers the cost of maintaining divergent code as well. If a private variant can be regenerated or re-adapted cheaply, the economic pressure to contribute back weakens. Copyleft enforced reciprocity through law, the cost of forking enforced it through economics. Both are eroding at the same time.

## Licenses without effect

Licenses were the legal backbone of the bargain. Even the most permissive ones usually ask for one thing: keep the copyright notice, credit the authors.

AI-generated code does not do that. It does not reproduce a project; it reproduces what it learned from many projects, recombined. There is no notice to keep, because there is no identifiable copy. The attribution requirement, the one condition nearly all open source licenses share, simply has nothing to attach to.

Copyleft licenses face the same problem in a sharper form. Their strength was that derived work had to remain open. But if the derivation passes through a model, is the output derived work? Maybe. Probably, in some cases. Proving it is another matter.

## Rights you cannot enforce

Even where a claim exists, enforcing it is close to impossible.

To enforce a license, you need to show that your work was copied, by whom, and in violation of which terms. With AI-generated code, the copying happens inside a training process you cannot inspect, and the output appears in codebases you will never see. The individual maintainer has no realistic way to find out, and even less of a way to pursue it.

Rights that cannot be enforced are, in practice, suggestions.

## Reputation that never arrives

For many contributors, reputation mattered more than licenses. Very few people have ever sued over open source. Many people built careers on it.

That is eroding too. When someone uses a well-known library directly, they see the name of the project and, sometimes, its authors. When someone receives an AI-generated implementation of the same idea, they see nothing. The knowledge still travels. The credit does not.

The work still matters. It just no longer makes the person who did it visible.

Seen together, licenses and reputation served the same purpose: they made reciprocity traceable. They connected a piece of work to the people who created it, so that credit, obligations, and opportunities could flow back to them. Once that trace disappears, reciprocity has nowhere to go. You cannot give back to someone you don't know you took from.

## Someone always made the money

It would be easy to stop here and conclude that open source is finished. I don't think that is right, because the bargain was never as fair as we pretended.

Someone has always been making money from open source work, and it was rarely the people doing the work. Companies built products on top of volunteer projects. Cloud providers sold hosted versions of software they did not write. Consultants and agencies, myself included, earned a living by applying open source to their clients' problems. Most maintainers received a fraction of the value their work created, if anything at all.

AI makes this imbalance more visible and more extreme. But it did not invent it.

It also concentrates it. For more than a decade, open source has effectively meant GitHub, and the company that hosts much of the world's public code is now also selling AI coding tools trained on public code. The place where the work is shared and the business that profits from learning from it are no longer clearly separate. Moving to community-run forges such as [Codeberg](https://codeberg.org), as I am currently doing with my personal repositories, does not guarantee to take any code out of a training set. But it keeps the infrastructure of open source under the governance of the people who use it.

To be fair, contributors do get something back. They use AI tools trained on the commons too, and those tools make them more productive. But that return is mediated and monetized: developers get access to what the commons taught the model, as a subscription. It is still a form of reciprocity, but the relationship has become commercial, and the terms are set by someone else.

What AI changes is *which kind* of work can be captured cheaply by others. And that points to where contributors should put their effort.

## From coder to architect

What becomes cheap is implementation: producing working code for a problem that is already understood.

What does not become cheap is understanding the problem in the first place. Deciding what a system should do and, more importantly, what it should not do. Finding the boundaries that allow a codebase to evolve for a decade. Knowing which abstraction will hold and which one will quietly become a liability. Judging whether a contribution fits a project's direction, even when it looks perfectly reasonable in isolation.

That is architectural work, and it is increasingly the scarce part.

> **When code is abundant, architecture counts.**

The role of the open source contributor is shifting accordingly: from writing code to shaping systems. From producing implementations to making the decisions that implementations depend on. AI can generate a pull request. It cannot yet take responsibility for where a project is going, or for the community of people who depend on it.

## Twenty years of Django

Django is a good illustration of what this means in practice.

It was released as open source in 2005, and it is still one of the most widely used web frameworks two decades later. Comparatively little of its original code survives. The ORM, the template engine, the admin, request handling, and most other parts have been rewritten, some of them more than once. What survived is the architecture: the decisions about how the parts relate to each other.

Many of those decisions were made very deliberately, and some are written down in Django's [design philosophies](https://docs.djangoproject.com/en/stable/misc/design-philosophies/). Loose coupling between layers. A template language intentionally limited so that business logic stays out of templates. Projects composed of reusable applications, so that functionality can be shared between projects instead of rebuilt for each one. A strict deprecation policy, so that the framework can change without breaking its users every release.

Not every decision was right in hindsight. Early versions contained a good deal of "magic" that had to be removed again. Some abstractions aged better than others, and some are carried along today mainly because removing them would cost more than keeping them.

But the architecture held. It absorbed new versions of Python, a migrations framework, class-based views, a redesigned middleware system, and eventually asynchronous support, without forcing its users to start over. That is not the result of writing a lot of code. It is the result of a community that has spent twenty years carefully deciding which code to write, and which not.

An AI can reproduce Django's code. What it cannot reproduce is the process that produced it: the discussions, the trade-offs, the rejected proposals, and the people who carry the reasons forward.

## Where people grow into that role

Here is the part I find encouraging.

Architectural judgment is hard to learn in isolation. You learn it by working on real systems with a long history, alongside people who have already made many of the mistakes. Most organizations cannot offer that to more than a handful of people.

Open source can.

Mature open source projects are among the few places where anyone can study how long-lived software actually evolves, participate in design discussions, see why decisions were made, and receive feedback from experienced maintainers. That has always been true, but it used to be a side effect of contributing code. Now it may be the main reason to contribute at all.

Programs like [Djangonaut Space](https://djangonaut.space) show what this can look like. They don't just help people land their first pull request. They pair new contributors with experienced navigators, give them context on how a project works, and help them understand not only *what* to change but *why*. That is exactly the kind of knowledge AI does not replace, and exactly the kind of growth that makes contributors more valuable, not less.

It is also reciprocity in its most durable form. Navigators pass on what they once received from the people who mentored them. Open source reciprocity was never really about paying back the person you took from. It was about passing it on. That form of reciprocity doesn't need a license or an attribution notice, and no model can perform it on anyone's behalf.

## What is dying, and what isn't

So is open source dying?

The version in which the value of a contribution lay mainly in the code, protected by a license and rewarded with reputation, is in serious trouble. I don't think it is coming back.

But open source was never only a pile of code. It was also a place where people learned to build software together, where knowledge about how systems should be designed was passed on, and where judgment was developed in public.

That part is not dying. If anything, it has become more important.

The code will be copied. The understanding behind it still has to be earned.
