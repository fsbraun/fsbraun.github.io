---
layout: default
title: Writing
nav_key: writing
description: Essays and notes by Fabian Braun, organized around ideas rather than chronology.
permalink: /writing/
---

<header class="page-header">
  <div class="page-heading">
    <div>
      <p class="eyebrow">Writing</p>
      <h1>Thinking in public.</h1>
    </div>
    <p class="lede">Essays and notes organized around ideas rather than publication dates. Published work sits alongside questions and pieces still in development.</p>
  </div>
</header>

{% if site.posts.size > 0 %}
<section class="category-section published-writing">
  <h2>Published</h2>
  <div class="post-list">
    {% for post in site.posts %}
    <a class="post-list-item" href="{{ post.url | relative_url }}">
      <div>
        <p class="eyebrow">{{ post.date | date: "%B %-d, %Y" }}</p>
        <h3>{{ post.title }}</h3>
        {% if post.description %}<p>{{ post.description }}</p>{% endif %}
      </div>
      <span aria-hidden="true">Read&nbsp; →</span>
    </a>
    {% endfor %}
  </div>
</section>
{% endif %}

<section class="category-section">
  <h2>Content systems<br>&amp; architecture</h2>
  <div class="idea-list">
    <article class="idea">
      <h3><a href="https://www.django-cms.org/resources/blog/2026/08/24/the-cms-is-not-the-application/">The CMS Is Not the Application</a></h3>
      <p>Where the boundary between application and content system belongs.</p>
      <a class="text-link" href="https://www.django-cms.org/resources/blog/2026/08/24/the-cms-is-not-the-application/">Read on django-cms.org&nbsp; ↗</a>
    </article>
    <article class="idea">
      <h3><a href="https://www.django-cms.org/resources/blog/2026/08/31/make-your-django-application-editable/">Make Your Django Application Editable</a></h3>
      <p>Adding editorial capabilities without surrendering application architecture.</p>
      <a class="text-link" href="https://www.django-cms.org/resources/blog/2026/08/31/make-your-django-application-editable/">Read on django-cms.org&nbsp; ↗</a>
    </article>
    <article class="idea">
      <h3><a href="https://www.django-cms.org/resources/blog/2026/09/07/plugin-architecture-is-editor-experience/">Plugin Architecture Is Editor Experience</a></h3>
      <p>How technical component architecture becomes product design.</p>
      <a class="text-link" href="https://www.django-cms.org/resources/blog/2026/09/07/plugin-architecture-is-editor-experience/">Read on django-cms.org&nbsp; ↗</a>
    </article>
    <article class="idea">
      <h3>Headless Is an Architecture, Not a Product Strategy</h3>
      <p>Why a delivery pattern cannot answer the product questions on its own.</p>
      <span class="status">On the horizon</span>
    </article>
  </div>
</section>

<section class="category-section">
  <h2>Software, reuse<br>&amp; organizations</h2>
  <div class="idea-list">
    <article class="idea">
      <h3>Stop Rebuilding the Same Django App for Every Client</h3>
      <p>What reusable applications demand from architecture, teams, and product thinking.</p>
      <span class="status">On the horizon</span>
    </article>
  </div>
</section>

<section class="category-section">
  <h2>Automation<br>&amp; AI</h2>
  <div class="idea-list">
    <article class="idea">
      <h3>I Don’t Want an AI Button in My CMS</h3>
      <p>Why useful automation belongs in workflows and capabilities, not novelty controls.</p>
      <span class="status">On the horizon</span>
    </article>
    <article class="idea">
      <h3>AI Doesn’t Replace Engineering. It Moves It Up the Stack.</h3>
      <p>How agentic tools change the level at which engineers specify, evaluate, and maintain systems.</p>
      <span class="status">On the horizon</span>
    </article>
  </div>
</section>

<section class="category-section">
  <h2>Investing<br>&amp; decision systems</h2>
  <div class="idea-list">
    <article class="idea">
      <h3>A.IX Insights</h3>
      <p>Writing on systematic investing, risk, and repeatable investment decisions lives at A.IX Capital.</p>
      <a class="text-link" href="https://www.aix-capital.com/de/artikel/">Read at A.IX Capital&nbsp; ↗</a>
    </article>
  </div>
</section>
