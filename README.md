# johngunerli.github.io

Personal portfolio and blog for [John Gunerli](https://johngunerli.com) — a Claude-inspired single-page app with a built-in AI chat assistant.

---

## What's in here

| Path                    | Purpose                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `index.html`            | The entire SPA — all views, routing, styles, and JS in one file                               |
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

Any static file server works. VS Code Live Server is the easiest:

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

1. Add an entry to the `posts` object in `index.html`:

```js
'my-post-slug': {
  title: 'My Post Title',
  date: 'March 2026',
  meta: 'Tag1, Tag2',
  tags: ['Tag1', 'Tag2'],
  body: `<p>Your content here.</p>`
},
```

1. That's it — it automatically appears in the Blog list and is routable at `/blog/my-post-slug`.

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

## Customising the AI assistant

The assistant's persona and knowledge are controlled by `SYSTEM_PROMPT` in `index.html`. Edit it to update what the AI knows about you.

Common queries are handled client-side by `detectIntent()` — a pattern-matching function that returns instant responses without hitting the API at all. Add patterns there for anything you want answered reliably and fast.

---

## Tech used

- Vanilla HTML / CSS / JS — no build step
- [DM Sans](https://fonts.google.com/specimen/DM+Sans) + [Lora](https://fonts.google.com/specimen/Lora) via Google Fonts
- [OpenRouter](https://openrouter.ai) for free LLM inference
- [Cloudflare Pages](https://pages.cloudflare.com) for hosting + edge functions
