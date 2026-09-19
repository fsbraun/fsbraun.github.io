---
layout: default
title: Writing archive
description: All published essays and articles by Fabian Braun, in reverse chronological order.
permalink: /writing/archive/
---

<header class="page-header">
  <div class="page-heading">
    <div>
      <p class="eyebrow">Writing archive</p>
      <h1>Every post, by date.</h1>
    </div>
    <p class="lede">All published essays and articles, with the newest first.</p>
  </div>
</header>

<section class="category-section" aria-labelledby="archive-heading">
  <h2 id="archive-heading">All posts</h2>
  <div class="idea-list">
    {% assign archive_posts = site.posts | sort: "date" | reverse %}
    {% for post in archive_posts %}
    {% assign post_url = post.external_url | default: post.url %}
    <article class="idea idea-published">
      <p class="idea-meta"><time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: "%B %-d, %Y" }}</time>{% if post.reading_time %} · {{ post.reading_time }} min read{% endif %}</p>
      <h3><a href="{% if post.external_url %}{{ post_url }}{% else %}{{ post_url | relative_url }}{% endif %}">{{ post.title }}</a></h3>
      {% if post.description %}<p>{{ post.description }}</p>{% endif %}
      {% if post.external_url %}
      <a class="text-link" href="{{ post_url }}">Read on {{ post.external_site | default: "the original site" }}&nbsp; ↗</a>
      {% else %}
      <a class="text-link" href="{{ post_url | relative_url }}">Read the essay&nbsp; →</a>
      {% endif %}
    </article>
    {% endfor %}
  </div>
</section>
