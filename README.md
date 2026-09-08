# Fabian Braun — personal site

A restrained, content-first personal website built with Jekyll and hosted by GitHub Pages. There is no JavaScript framework, database, analytics, or external font dependency.

## Publish with the least effort

1. Create a public GitHub repository named `fsbraun.github.io`.
2. From this directory, initialize Git and push the site:

   ```sh
   git init
   git add .
   git commit -m "Create personal site"
   git branch -M main
   git remote add origin git@github.com:fsbraun/fsbraun.github.io.git
   git push -u origin main
   ```

3. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
4. GitHub will publish the site at `https://fsbraun.github.io/`.

If you use a different repository name, set `baseurl: "/repository-name"` in `_config.yml` so internal links work.

## Edit content

- Homepage: `index.md`
- Writing map: `writing.md`
- Projects: `projects.md`
- Biography: `about.md`
- Visual design: `assets/css/style.css`

To publish an essay, create a Markdown file in `_posts` named `YYYY-MM-DD-short-title.md`:

```md
---
layout: post
title: The CMS Is Not the Application
description: Where the boundary between application and content system belongs.
reading_time: 8
category: content-systems
---

Essay text starts here.
```

The post is added automatically to its category on the Writing page. Supported category values are `content-systems`, `software-reuse`, `automation-ai`, and `decision-systems`.

For an article published on another site, create the same dated file with front matter only:

```md
---
layout: post
title: The CMS Is Not the Application
description: Where the boundary between application and content system belongs.
category: content-systems
external_url: https://example.com/the-cms-is-not-the-application/
external_site: example.com
sitemap: false
---
```

The Writing page links directly to `external_url` and labels the link with `external_site`. Keeping `sitemap: false` prevents the empty local placeholder page from appearing in the sitemap.

The date in the filename controls publication: a future-dated file stays hidden until that date. Planned ideas remain curated directly in `writing.md`.

## Preview locally (optional)

With Ruby and Bundler installed:

```sh
bundle install
bundle exec jekyll serve
```

Open `http://127.0.0.1:4000`. A local preview is optional; GitHub Pages builds the same Jekyll source after each push.

## Custom domain (optional)

Add the domain in **Settings → Pages → Custom domain**, verify it in your GitHub account, and follow GitHub’s DNS instructions. GitHub recommends configuring a `www` subdomain alongside an apex domain.
