---
layout: page
title: Blog
description: Technical articles and insights on software engineering, entrepreneurship, and building scalable systems by Ahmed Emam.
permalink: /blog/
---

# Blog

Welcome to my blog! Here I share insights on software engineering, entrepreneurship, building scalable systems, and lessons learned from my journey as a founder and engineer.

---

<div class="post-list">
{% for post in site.posts %}
  <article class="post-item">
    <h2 class="post-title">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h2>
    <div class="post-meta">
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>
      {% if post.author %} • {{ post.author }}{% endif %}
      {% if post.reading_time %} • {{ post.reading_time }} min read{% endif %}
    </div>
    <div class="post-excerpt">
      {{ post.excerpt | strip_html | truncatewords: 50 }}
    </div>
    <a href="{{ post.url | relative_url }}" class="read-more">Read more →</a>
  </article>
{% endfor %}
</div>

{% if site.posts.size == 0 %}
<p style="text-align: center; color: rgba(224, 224, 224, 0.6); margin: 3em 0;">
  No blog posts yet. Check back soon for technical articles and insights!
</p>
{% endif %}

---

## Topics I Write About

- **Software Engineering**: Architecture, design patterns, best practices
- **Cloud & DevOps**: AWS, GCP, infrastructure, deployment strategies
- **Entrepreneurship**: Building startups, team building, product development
- **Full-Stack Development**: React, Node.js, databases, APIs
- **Leadership**: Engineering management, mentorship, culture building
- **Tech Education**: Training engineers, community building

---

## Stay Updated

Subscribe to my [LinkedIn](https://www.linkedin.com/in/ahmedemam11/) for updates when new articles are published, or follow me on [GitHub](https://github.com/ahmedemam) for code examples and projects.
