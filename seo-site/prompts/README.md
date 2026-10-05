# Prompts from the method (reference)

The skills (`/blog`, `/service`, ...) already contain these. Keep them here to reuse or tweak by hand.

## 1. Build the website (already done in this project)
> Build a beautiful website with: a homepage, an index page for blog posts, an index page for service pages.
> Attached is a screenshot of the design I want — clone that design. Use static site generation.

Tip: find a design reference on dribbble.com (search "<your niche> website"), screenshot it, attach it in Claude.
To restyle this project: attach the screenshot and say "restyle app/globals.css and the components to match this design;
don't change the page structure, metadata or content files."

## 2. First blog post
> Create a blog post about "<keyword>". Also create a keyword cluster from related keywords in data/keywords.csv
> (or your own). Add images from Pexels — my API key is in .env.

## 3. Learn my voice
> Update references/voice.md, humor.md, opinions.md, stats.md and stories.md from these posts: <paste>.
> Also add this passage as a humor reference: <paste>.

## 4. Rewrite like the top 3
> Rewrite the post using my humor, voice, opinions, stats and stories. Before writing, search Google for the primary keyword,
> analyze the top 3 ranking articles (not Reddit/forums), and copy what works: average word count, number of H2s,
> images, subtopics covered. Then beat them.

## 5. Service page
> Build a service page for the primary keyword "<service city>". It's a landing page for that city and service.
> It should look the same as the homepage.

## 6. On-page SEO
> Update the page with every item in seo/on-page-checklist.md, but keep the voice and humor of the post.

## 7. Technical SEO
> Here's my Lighthouse report: <paste>. Optimize so I get 100 in performance, accessibility, best practices and SEO.
> Also generate robots.txt and sitemap.xml.

## 8. Bottle it into a skill (already done: .claude/skills/blog)
> Create a skill called "blog" that does everything we did in this conversation: pick a keyword from keywords.csv,
> build a keyword cluster, analyze the top 3, add Pexels images, write in my voice/humor, apply on-page SEO,
> and reuse the same optimized page template every time.

## 9. Go live
> Upload my whole project to this GitHub repo: <url>. / Add this meta tag for Google Search Console verification,
> then deploy to GitHub and Vercel: <meta ...>.
