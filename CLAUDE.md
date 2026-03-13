# CLAUDE.md — Codebase guide for AI assistants

This file helps AI coding assistants understand the repo quickly and make accurate edits.

---

## What this is

A personal portfolio SPA for John Gunerli, hosted on Cloudflare Pages. **Zero build step.** The entire frontend is a single file: `index.html`. There is no bundler, no framework, no package.json.

---

## File map

```text
index.html              — Everything: HTML, all CSS, all JS, all view content
data/posts.js           — Blog post content, keyed by slug (loaded before main script)
functions/api/chat.js   — Cloudflare Pages Function (server-side API proxy)
_redirects              — Cloudflare Pages URL redirects
.gitignore              — Ignores .env and .hugo_build.lock
README.md               — Human-facing project overview
CLAUDE.md               — This file
```

There is **no** build output directory, **no** `node_modules`, **no** Hugo setup (the old Hugo files were removed — ignore any historical references to `themes/`, `config.yml`, `archetypes/`, or `content/`).

---

## index.html structure

```text
<head>
  fonts (Google Fonts: DM Sans + Lora)
  <style>
    CSS custom properties (design tokens)
    Component styles in order:
      body → sidebar → main → home → input → chat → pages → artifacts → model selector → mobile
    Mobile breakpoint: @media (max-width: 768px)
  </style>
</head>
<body>
  .mobile-menu-btn        — hamburger, fixed top-left, hidden on desktop
  .sidebar-overlay        — tap-to-close backdrop, mobile only
  <aside.sidebar>         — nav + chat history + user footer
  <main#main>             — all views render here via innerHTML

  <script>
    ── CONTENT DATA ──────────────────────────
    const posts            — blog post content (loaded from data/posts.js)
    const projectGroups    — projects list, grouped by category
    const instagramPosts   — artifact URLs

    ── VIEWS (return HTML strings) ───────────
    homeView()
    blogListView()
    postView(slug)
    projectsView()
    artifactsView()
    notFoundView()

    ── ROUTER ────────────────────────────────
    getView(path)          — maps path → view function
    updateNav(path)        — sets .active on sidebar nav links
    navigate(path)         — pushState + render
    render(path)           — sets #main.innerHTML + updateNav + scrollTop

    ── CHAT STATE ────────────────────────────
    chatHistory[]          — OpenRouter message array for current session
    inChatMode             — true once first message sent
    selectedModel          — current model id or 'auto'
    currentSessionId       — id of active session (null on home)
    chatSessions[]         — all saved sessions (loaded from localStorage)

    ── CHAT SESSION FUNCTIONS ────────────────
    loadChatSessions()     — reads localStorage → chatSessions[]
    saveChatSessions()     — writes chatSessions[] → localStorage
    startNewChat()         — saves current, resets state, navigate('/')
    saveCurrentSession()   — upserts current session into chatSessions[]
    loadChatSession(id)    — restores a session into the chat view
    deleteChatSession(id)  — removes from chatSessions[], resets if active
    renderChatHistory()    — re-renders the sidebar #chat-history-list

    ── MODEL SELECTOR ────────────────────────
    MODEL_OPTIONS[]        — [{id, label, sub}, ...]
    modelSelectorHTML()    — returns dropdown + button HTML
    toggleModelDropdown()
    selectModel(id)
    refreshModelRows()     — re-renders all .model-wrap elements in place

    ── AI / CHAT FUNCTIONS ───────────────────
    SYSTEM_PROMPT          — persona + knowledge injected as system message
    detectIntent(query)    — fast client-side pattern match, returns string or null
    chatInputHTML()        — returns the input box HTML (used in both views)
    chatViewHTML()         — returns the full chat view HTML
    switchToChatMode()     — replaces #main with chatViewHTML()
    appendUserMsg(text)
    appendThinking()       — inserts animated thinking dots
    replaceThinking(text)  — replaces dots with AI answer text
    streamResponse(text)   — simulates streaming for instant (pattern-matched) replies
    scrollChat()
    escHtml(s)
    resetViewportZoom()    — iOS Safari blur fix (scroll to 0,0)
    toggleSend(input)      — shows/hides send button based on input content
    submitQuery()          — main handler: pattern match → AI fallback
    onEnter(e)

    ── MOBILE SIDEBAR ────────────────────────
    toggleMobileSidebar()
    click listener         — auto-closes sidebar on nav-link click (mobile)
  </script>
</body>
```

---

## CSS design tokens

```css
--bg:         #1c1917   /* page background */
--chip-bg:    #2a2523   /* hover surfaces, input background */
--input-bg:   #2a2523
--border:     #3a3530
--border-alt: #4a4540   /* focused border */
--text:       #f5f0e8
--text-2:     #b1ada1   /* secondary text */
--text-3:     #6b6560   /* muted/placeholder */
--accent:     #e0704a   /* brand orange */
```

---

## Routing

Client-side only via `history.pushState`. Routes:

| Path | View |
| ---- | ---- |
| `/` | `homeView()` |
| `/blog` | `blogListView()` |
| `/blog/:slug` | `postView(slug)` |
| `/projects` | `projectsView()` |
| `/artifacts` | `artifactsView()` |

All unknown paths fall through to `notFoundView()`. The `_redirects` file handles direct URL loads on Cloudflare Pages.

---

## Chat flow

```text
submitQuery()
  ├── detectIntent(query)  → if match: streamResponse() then return
  └── else:
        appendThinking()
        fetch POST /api/chat   (prod)
        fetch POST openrouter  (local dev, using localStorage key)
          model fallback order: llama-3.3-70b → gpt-oss-20b → nemotron-nano-9b
        replaceThinking(answer)
        saveCurrentSession()
```

Local dev detection: `location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.port`.

---

## Cloudflare Function

`functions/api/chat.js` — thin proxy, POST only.

- Reads API key from `env.OPENROUTER_API_KEY || env.OPENROUTER_KEY`
- Forwards the full request body to `https://openrouter.ai/api/v1/chat/completions`
- Adds `HTTP-Referer: https://johngunerli.com` and `X-Title: johngunerli.com`
- Returns the OpenRouter response with CORS headers

The env var must be set in **Cloudflare Pages → Settings → Environment variables** as `OPENROUTER_KEY`.

---

## Mobile notes

- Sidebar is `position: fixed; transform: translateX(-100%)` on mobile, slides in with `.open`
- `body` uses `height: 100dvh` (with `@supports` fallback to `100vh`) to avoid iOS Safari chrome overlap
- `viewport-fit=cover` in `<meta viewport>` enables `env(safe-area-inset-bottom)` for the input area
- Input `font-size: 16px` — must stay at 16px or above to prevent iOS auto-zoom on focus
- `resetViewportZoom()` on input blur forces `window.scrollTo(0,0)` on iOS to snap the viewport back

---

## Common edits

**Add a blog post** — add a key to `const posts` in `index.html`. Slug becomes the URL path.

**Add a project** — add an item to the relevant array inside `const projectGroups`.

**Add an artifact** — add `{ url: '...' }` to `const instagramPosts`.

**Update AI knowledge** — edit `SYSTEM_PROMPT`.

**Add an instant chat response** — add a branch to `detectIntent()`. Return a string (supports `**bold**` and `[text](url)` markdown).

**Add a language dot colour** — add `.lang-xyz { background: #hex; }` to the Projects section of the CSS, then use `dot: 'lang-xyz'` in `projectGroups`.
