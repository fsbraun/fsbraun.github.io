---
layout: post
title: What If Brute Force Produces Insight?
description: AI, mathematical discovery, and what remains when searching for answers becomes cheap.
reading_time: 8
category: automation-ai
---
OpenAI recently reported that a system involving on the order of 10,000 concurrent AI agents produced a proposed resolution of the Navier–Stokes Millennium Prize Problem. According to [OpenAI's account of the experiment](https://openai.com/index/navier-stokes-solution/), the effort took about 88 hours, involved 2.7 million agent messages and roughly 130 billion output tokens, followed by another 17 hours of Lean formalization and verification.

The [Clay Mathematics Institute describes the problem as "apparently" settled](https://www.claymath.org/news/navier-stokes-announcement/), while emphasizing that its evaluation process is deliberately unhurried. So there is good reason not to treat the story as finished yet.

Still, my first reaction was: that's an extraordinary amount of brute force. My second reaction was: does it matter?

If the resulting mathematics withstands scrutiny, the proof can be inspected independently of the process that discovered it. We can ask whether each step follows, whether its assumptions are valid, and whether its conclusion is justified. The proof doesn't remember how it was found.

## Search and Insight

Some of the most beautiful results in mathematics are interesting because they reveal unexpected structure. [Gödel's incompleteness theorems](https://plato.stanford.edu/entries/goedel-incompleteness/), for example, establish fundamental limits on what sufficiently expressive consistent formal systems can prove. Their importance doesn't come from someone having performed a particularly large calculation. They changed how we understand formal mathematics.

That makes massive AI searches feel fundamentally different. Thousands of agents exploring possibilities sounds less like mathematical insight and more like an enormous search procedure. But perhaps the distinction isn't as clear as it seems.

Humans traditionally do both: we search and we compress. We try approaches, discard them, notice connections, and eventually find an argument that reduces all that exploration to something another person can understand.

AI may dramatically reduce the cost of the search. OpenAI describes its agents exploring different approaches in parallel and later cross-pollinating promising intermediate results between groups. If systems can do this at enormous scale, vastly more mathematical territory becomes accessible.

The enormous search can disappear once a compact argument has been found.

> **Perhaps brute force isn't the opposite of insight. It can be a way of finding it.**

## Does It Matter How We Got There?

Imagine two mathematicians independently produce the same elegant proof. One arrives at it after years of intuition and careful thought. The other uses a program that searches millions of possibilities until it eventually produces the argument. The discovery processes are completely different; the resulting mathematics may be identical.

Of course, mathematics is more than correctness. We value explanations, useful concepts, connections, and proofs that reveal *why* something is true. But those qualities can exist in the resulting proof regardless of how messy the path toward it was.

An ugly search can discover a beautiful argument.

This becomes more interesting when AI finds something we didn't expect. Proving a result mathematicians already strongly suspected is one thing. Producing a valid proof of something that overturns prevailing intuition is another.

Take the [P versus NP problem](https://www.claymath.org/millennium/p-vs-np/). Most computer scientists expect \(P \neq NP\), but nobody has proved it. Imagine a machine-generated proof establishing \(P = NP\) instead. Humans inspect it, formal systems verify it, and nobody finds an error.

At that point, saying it was "only brute force" would miss what happened. An enormous search would have produced a result that changed our understanding of computation.

> **The brute force would not merely have found the proof. It would have surprised us.**

## Search Is Moving Up the Stack

I've been thinking about a related question in software development. AI is clearly reducing the cost of implementation, which suggests that scarce human work moves upward toward intent, context, architecture, and judgment.

AI doing mathematics complicates that picture because it isn't merely executing a path somebody else specified. Increasingly, it can also search for the path. In the Navier–Stokes effort, the agents were deliberately given different approaches to explore, with intermediate findings later fed into further searches.

That suggests a progression:

```
execution
    ↓
search for solutions
    ↓
verification
    ↓
interpretation
    ↓
choosing worthwhile problems
```

We shouldn't assume that AI stops permanently at any particular line. But as execution and search become cheaper, the value of the remaining layers changes.

For mathematics, verification still matters. OpenAI has also [published the Lean formalizations](https://github.com/openai/NavierStokesAndEuler) and instructions for independently checking them. But verification isn't the end of the work.

If a machine really proved \(P = NP\), for example, knowing that the proof is correct would only begin the next phase. We would want to understand why our intuition had been wrong, what follows from the result, which existing assumptions need to be reconsidered, and what new questions suddenly become interesting.

A proof can establish that something is true without telling us what the result means.

And before all of that comes another question: why were we looking there in the first place?

## What Remains Scarce?

I don't find the question "Can AI have insight?" particularly useful. It depends too much on what we mean by insight and what we believe happens internally in humans or machines.

A more practical question is:

> **What remains scarce when machines can search enormous spaces of possible solutions?**

Today, choosing worthwhile problems, understanding why they matter, interpreting results, and connecting them to everything else we know still look like unusually valuable forms of judgment. Perhaps AI will become good at those things too. I don't see a strong reason to assume otherwise.

That is why the interesting consequence of AI doing mathematics may not be that machines are becoming mathematicians. It may be that **search and insight were less cleanly separated than we thought**.

If AI keeps making both execution and search cheaper, the useful question for humans is no longer simply what machines cannot do. It becomes:

> **Which questions are worth asking, which answers matter, and what do we understand differently once the search is no longer ours alone?**
