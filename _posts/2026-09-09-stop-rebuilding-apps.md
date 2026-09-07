---
layout: post
title: Stop Rebuilding the Same Django App for Every Client
description: How reusable Django applications can turn agency project work into accumulating product knowledge.
reading_time: 8
---
Agencies build different websites for different clients, but they don't always build different applications. One corporate website needs people, another needs locations, another needs events. Others need services, jobs, case studies, publications, or projects.

The details differ, but the underlying concepts often don't. And yet we frequently build them again: a `Person` model for one customer, another `Person` model for the next, with different CMS integration, templates, multilingual setup, and publishing logic.

After five projects, the agency has implemented People five times. It has completed five projects — but has it built an asset?

**Build the domain application once. Adapt it to the client.**

## The Repetition Is Easy to Miss

Take something as ordinary as a team section. The first client needs:

```text
Person
├── name
├── role
├── photo
└── biography
```

The next client also needs departments and locations. A third needs multiple languages, while a fourth needs drafts and publishing. The fifth wants people to appear on team pages, office pages, articles, and landing pages.

These projects are different, but much of what we're building is not. We still have a person with relationships, URLs, templates, perhaps an API, and because this is a CMS project, we repeatedly need the same editorial capabilities around it:

* localization
* versioning
* preview
* publishing
* frontend editing
* permissions
* composition into pages

The recurring cost isn't only the `Person` model. It is everything required to turn that model into something editors can actually work with.

## Project Reuse Is Not Product Reuse

Of course, developers already reuse code. We copy models and plugins, keep project templates, and borrow snippets from previous projects. That helps, but copying an implementation is different from maintaining a reusable application.

When I copy the People implementation from Client A into Client B, the two versions immediately begin to diverge. A bug fixed for Client B doesn't automatically improve Client A. A better editorial workflow discovered on Client C doesn't become available to the others, and a useful API added for Client D remains a Client D feature.

The agency keeps learning. The software doesn't.

**What if recurring project knowledge accumulated in reusable Django applications instead?**

## Django Already Has the Right Unit of Reuse

Django has had an answer to this problem from the beginning: applications.

A People application can own the things that belong to the People domain:

```text
people/
├── models.py
├── urls.py
├── views.py
├── api.py
├── templates/
└── ...
```

It can define what a `Person` is, relationships between people, departments and locations, APIs, permissions, and business logic. None of this needs to belong to the CMS.

This is the same distinction I argued for in [The CMS Is Not the Application](ref:djangocms_stories.post:636):

> **The application should own the architecture. The CMS should make it editable.**

The difficulty has traditionally been the second half. Making a normal Django application feel like first-class content inside a CMS has required enough integration work that rebuilding the feature inside each project can still feel easier.

That is the problem I've been trying to reduce with `djangocms-custom-content`.

## Make the Application Editable

Suppose we start with a reusable People application. Its domain might be very small:

```python
class Person(models.Model):
    slug = models.SlugField(unique=True)
```

Then we add the editorial content that needs to vary by language and publishing state:

```python
class PersonContent(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    language = models.CharField(max_length=15)

    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    biography = models.TextField()
```

What we want from the CMS is not ownership of `Person`. We want capabilities around it: make the content multilingual and versioned, give editors preview and frontend editing, allow people to be composed into pages, and provide a useful administration interface.

The `Person` remains part of the Django application. The CMS makes it manageable as content.

That distinction is what makes reuse interesting.

## One Application, Different Clients

Client A can use the People application with a simple team page. Client B can add departments, Client C can relate people to offices, Client D can expose them through an API to another frontend, and Client E can use the same people in articles, case studies, and landing pages.

The projects don't have to become identical. The reusable application provides a stable domain and a set of capabilities, while individual projects remain free to compose and extend them.

Conceptually:

```text
                    People
                      │
          ┌───────────┼───────────┐
          │           │           │
      Client A    Client B    Client C
          │           │           │
       Team       Locations      API
       pages       + teams     + website
```

A useful improvement to `People` can now flow back into the reusable application instead of remaining trapped inside one customer project.

Over time, the agency isn't merely delivering projects. It is accumulating capabilities.

## From Projects to a Capability Portfolio

Once you start looking at agency work this way, People is only the beginning. Many agencies repeatedly build some variation of:

```text
people/
events/
locations/
services/
jobs/
projects/
case_studies/
publications/
```

Not every agency needs the same applications, and there shouldn't be one universal model for an Event or Service that satisfies every website. The point is not to standardize every client. The point is that an agency can decide where **its own recurring knowledge** deserves to become software.

Perhaps after building event systems for four customers, you know what your Event application should look like. Perhaps your agency has a particularly good model for Locations, or understands publishing organizations and has developed excellent applications for Authors, Publications, and Topics.

That knowledge can become part of your capability portfolio. The next project starts from there rather than from zero.

## Reuse Changes the Economics of Improvement

Suppose improving the People application takes two days. If it belongs to one client project, the improvement needs to justify two days for that client. If the application is used across ten projects, the economics change.

Accessibility improvements benefit ten implementations. A better editing experience benefits ten editorial teams. Compatibility work benefits ten projects. A bug fix happens once, and a new CMS capability becomes available everywhere the application is used.

The cost of making the shared capability better is spread across the value it creates.

That is how product development works. Agency work usually doesn't — but perhaps the boundary doesn't need to be as sharp as we assume.

## Reusable Does Not Mean Generic

There is an obvious danger here. Once developers discover reuse, we tend to generalize. Our simple People application becomes configurable, then highly configurable, then it needs twenty settings because every previous customer did something slightly different.

Eventually we have created a generic framework nobody particularly enjoys using.

That's not what I'm proposing. A reusable application should still have opinions and represent a useful model of its domain. Projects can extend it when necessary, and sometimes a client's requirements really are different enough that a separate implementation is the right answer.

The goal isn't maximum reuse. Just as with component architecture, maximum flexibility isn't automatically a virtue.

The goal is to identify the things we genuinely build repeatedly and allow the knowledge behind them to accumulate.

## This Is What I'm Exploring with djangocms-custom-content

`djangocms-custom-content` is infrastructure for experimenting with this model. It tries to make the CMS-specific part of a reusable Django application inexpensive enough that the application can remain the primary architectural unit.

A normal Django domain can gain multilingual editorial content, versioning, preview, frontend editing, CMS administration, application URLs, and relationships between versioned and ordinary Django objects without having to become a special-purpose CMS architecture.

I've included applications such as People, Services, and Categories as examples, not because I think django CMS should own universal implementations of those concepts. Quite the opposite: they are there to explore how little CMS-specific machinery should be necessary for developers to build their own reusable applications.

The framework is still young. The interesting test now isn't whether I can add more features to it.

**It is whether other developers and agencies recognize the problem.**

## What Do You Keep Rebuilding?

That's the question I'm most interested in. If you build Django or django CMS projects for multiple clients, which applications have you built more than once?

People? Events? Locations? Services? Jobs? Or something much more specific to the industries you work with?

And if you've tried turning those implementations into reusable Django applications, what stopped the reuse from working? Were customers' domains genuinely too different? Was extension too difficult? Did CMS integration create too much project-specific plumbing? Did maintaining a reusable package cost more than rebuilding it?

Those answers matter more to me right now than another feature request. Because if the recurring problem is real, the opportunity isn't merely to make custom content easier. It's to change what accumulates when we build client projects.

**The agency should keep more than the experience. The software should learn too.**
