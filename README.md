# johngunerli.github.io

Personal portfolio and blog for [John Gunerli](https://johngunerli.com) — a Claude-inspired single-page app with a built-in AI chat assistant.

---

## What's in here

| Path                    | Purpose                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `index.html`            | The entire SPA — all views, routing, styles, and JS in one file                               |
| `data/posts.js`         | Blog post content, keyed by slug                                                              |
| `tools/`                | Local post editor — gitignored, runs on this machine only (see [Writing posts](#writing-posts)) |
| `functions/api/chat.js` | Cloudflare Pages Function that proxies OpenRouter API calls (keeps the API key server-side)   |
| `_redirects`            | URL redirect rules for Cloudflare Pages                                                       |

---

## Architecture

```text
Browser
  └── index.html (SPA)
        ├── Client-side router  (history.pushState)
        ├── Views: Home, Blog, Post, Projects, Artifacts, Chat
        ├── Chat history stored in localStorage
        └── /api/chat  ──►  functions/api/chat.js
                                  └── OpenRouter API
                                        ├── meta-llama/llama-3.3-70b-instruct:free
                                        ├── openai/gpt-oss-20b:free
                                        └── nvidia/nemotron-nano-9b-v2:free
```

The site is a **zero-build, zero-dependency** static SPA. No bundler, no framework. Everything lives in `index.html`.

---

## Running locally

Any static file server works. `node tools/serve.js` serves the site at <http://localhost:4000> (and the post editor at `/editor`). Or use VS Code Live Server:

1. Open the folder in VS Code
2. Right-click `index.html` → **Open with Live Server**

The chat AI won't work locally without an API key. Set one in the browser console once:

```js
localStorage.setItem('openrouter_api_key', 'sk-or-v1-...')
```

Get a free key at [openrouter.ai](https://openrouter.ai). On local dev the app routes API calls directly to OpenRouter with this key; on production it goes through the Cloudflare Function instead.

---

## Deploying

The site is hosted on **Cloudflare Pages** and auto-deploys from the `master` branch on push.

### Required environment variable

In the Cloudflare Pages dashboard → **Settings → Environment variables**, add:

| Variable          | Value                                    |
| ----------------- | ---------------------------------------- |
| `OPENROUTER_KEY`  | Your OpenRouter API key (`sk-or-v1-...`) |

The Cloudflare Function at `functions/api/chat.js` reads this and proxies requests to OpenRouter. The key is never exposed to the browser.

---

## Adding content

### New blog post

Use the local editor — see [Writing posts](#writing-posts) below. It writes `data/posts.js` for you.

If you'd rather do it by hand, add an entry to the `posts` object in `data/posts.js`:

```js
'my-post-slug': {
  title: 'My Post Title',
  date: 'March 2026',
  meta: 'Tag1, Tag2',
  tags: ['Tag1', 'Tag2'],
  body: `<p>Your content here.</p>`
},
```

Either way it appears in the Blog list automatically and is routable at `/blog/my-post-slug`. Posts render in the order they appear in the file.

### New project

Add an item to the relevant group in `projectGroups` (or create a new group):

```js
{ name: 'my-repo', desc: 'What it does.', lang: 'Python', dot: 'lang-python', url: 'https://github.com/...' }
```

### New artifact (Instagram post)

Add a URL to `instagramPosts` in `index.html`:

```js
{ url: 'https://www.instagram.com/p/YOUR_POST_ID/' },
```

---

## Writing posts

A small local editor for writing and editing blog posts, so you never have to hand-edit `data/posts.js`. It lives in `tools/` and is **gitignored** — it runs on this machine only and never reaches Cloudflare. (Trade-off: a fresh clone won't have it.)

```bash
node tools/serve.js
```

Then open **<http://localhost:4000/editor>**. The real site is served alongside it at <http://localhost:4000>, so you can check a draft at `/blog` in the same tab.

| Action | How |
| ------ | --- |
| New post | **+ New post**, then fill in title, slug, date, meta line, and tags |
| Write | Markdown in the left pane, live preview on the right |
| Reorder | **▲ ▼** on hover in the sidebar — file order is the order `/blog` displays |
| Delete | **Delete** in the top bar |
| Write to disk | **Save to posts.js**, or ⌘S |

Markdown supported: `**bold**`, `*italic*`, `[text](url)`, `## heading`, `- list`, `> quote`, and a blank line for a new paragraph. It converts to the same simple HTML the posts already use, and existing posts are converted back to Markdown when you open them.

Save only writes the file — publishing stays a deliberate step:

```bash
git add data/posts.js
git commit -m "new post: my post title"
git push          # Cloudflare Pages deploys from master
```

**Safeguards.** Re-saving untouched posts produces a byte-identical file, so your diffs only ever show what you actually changed. Before writing, the server re-parses its own output and aborts if it doesn't match; it also copies the previous version to `data/posts.js.bak` (gitignored) and refuses to write an empty file.

Requires Node (any recent version). No `npm install` — the server uses only the standard library, keeping the repo dependency-free.

---

## Customising the AI assistant

The assistant's persona and knowledge are controlled by `SYSTEM_PROMPT` in `index.html`. Edit it to update what the AI knows about you.

Common queries are handled client-side by `detectIntent()` — a pattern-matching function that returns instant responses without hitting the API at all. Add patterns there for anything you want answered reliably and fast.

---

## Tech used

- Vanilla HTML / CSS / JS — no build step
- [DM Sans](https://fonts.google.com/specimen/DM+Sans) + [Lora](https://fonts.google.com/specimen/Lora) via Google Fonts
- [OpenRouter](https://openrouter.ai) for free LLM inference
- [Cloudflare Pages](https://pages.cloudflare.com) for hosting + edge functions
