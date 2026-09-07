# Artifacts page: Instagram embeds → Letterboxd films

Date: 2026-09-06

## Goal

Replace the Instagram embeds on `/artifacts` with recently-watched films, auto-synced
from `letterboxd.com/johngunerli`. The route, nav label, and icon stay as they are;
only the content beneath the page title changes.

## Decisions

| Question | Decision |
| --- | --- |
| Data source | Letterboxd public RSS. No API key. |
| Section name | Unchanged — still "Artifacts" at `/artifacts`. |
| Scope | 12 most recently watched, newest first. |
| Per-item detail | Poster, title, year, watched date, star rating. |
| Failure mode | Serve last good response from cache. |

Two accepted trade-offs:

- Letterboxd carries films only, so TV shows cannot appear. The original ask said
  "movies and shows"; the shows half is knowingly dropped with this source. Adding it
  later means a second upstream (Trakt) plus TMDB for artwork.
- "Status" from the original detail choice is meaningless when every item on the page
  is already watched, so the meta line carries watched date and rating instead.

## Components

### `functions/api/watching.js` (new)

GET-only Pages Function. Exists because `letterboxd.com` serves no CORS headers, so
the browser cannot read the feed directly.

Fetches `https://letterboxd.com/johngunerli/rss/` and parses it with regex — Workers
have no `DOMParser`. Per `<item>`:

| Output field | RSS source |
| --- | --- |
| `title` | `<letterboxd:filmTitle>` |
| `year` | `<letterboxd:filmYear>` |
| `rating` | `<letterboxd:memberRating>`, omitted when absent |
| `watched` | `<letterboxd:watchedDate>` |
| `rewatch` | `<letterboxd:rewatch>` equals `Yes` |
| `url` | `<link>` |
| `poster` | first `<img src>` in the `<description>` CDATA |

Items without `filmTitle` are dropped — the feed can carry list posts alongside film
entries. Output is capped at 12 and shaped `{ items, fetchedAt }`.

Caching: `s-maxage=1800, stale-while-revalidate=86400`, plus an explicit write into
the Workers `caches.default` so an upstream failure replays the last good body. If the
fetch fails and nothing is cached, return HTTP 200 with `{ items: [], error: true }`
so the client can fall back on its own copy rather than treating it as a hard error.

### `index.html`

Removed: the `instagramPosts` array and the `embed.js` script injection at the top of
`artifactsView()`. That drops a third-party script from the site.

Added:

- `artifactsView()` renders the page shell with skeleton tiles, then calls `loadWatching()`.
- `loadWatching()` paints from `localStorage['watching-cache']` first when present, so
  there is no empty flash, then fetches `/api/watching` and re-renders and re-caches.
  If the fetch fails and no local copy exists, show one quiet line linking to the
  Letterboxd profile — never a broken-looking grid.
- `filmCardHTML(item)` — poster with `loading="lazy"`, title, meta line; the whole card
  links to the Letterboxd film page in a new tab.

`detectIntent()` gains `movies|films|watching|letterboxd` in its artifacts pattern, with
reworded copy. `SYSTEM_PROMPT` is deliberately left untouched.

### CSS

The existing `.artifacts-grid` rules are a `columns: 2` masonry that exists only to
constrain Instagram's iframes; they are replaced by a poster grid using
`repeat(auto-fill, minmax(140px, 1fr))`, posters at `aspect-ratio: 2/3` with
`object-fit: cover`, and `--border` lightening to `--border-alt` on hover. Mobile drops
to `minmax(100px, 1fr)`.

## Verification

The repo has no test framework and no build step. Verification is:

1. Run the parser against the live feed under node and confirm the extracted fields.
2. Serve the site locally and load `/artifacts` to confirm render and fallback paths.

End-to-end confirmation of the Function requires `wrangler pages dev` or a deploy.
Whichever of these actually ran gets reported plainly; the rest is stated as unverified.
