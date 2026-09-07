// Cloudflare Pages Function that proxies the Letterboxd RSS feed.
// Letterboxd sends no CORS headers, so the browser cannot read the feed directly.

const FEED = 'https://letterboxd.com/johngunerli/rss/';
const MAX_ITEMS = 12;
const TTL = 1800;                     // 30 min fresh
const CACHE_KEY = 'https://johngunerli.com/__cache/watching';

// Workers have no DOMParser, so pull fields out with regex.
function tag(block, name) {
  const m = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? m[1].trim() : null;
}

function unescapeXml(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
          .replace(/&amp;/g, '&');
}

function parseFeed(xml) {
  const items = [];

  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = m[1];

    // The feed also carries list posts, which have no film attached.
    const title = tag(block, 'letterboxd:filmTitle');
    if (!title) continue;

    const rating = tag(block, 'letterboxd:memberRating');
    const poster = (block.match(/<img src="([^"]+)"/) || [])[1] || null;

    items.push({
      title: unescapeXml(title),
      year: tag(block, 'letterboxd:filmYear'),
      rating: rating ? Number(rating) : null,
      watched: tag(block, 'letterboxd:watchedDate'),
      rewatch: tag(block, 'letterboxd:rewatch') === 'Yes',
      url: tag(block, 'link'),
      poster: poster ? unescapeXml(poster) : null,
    });
  }

  // The feed is ordered by when an entry was logged, not when it was watched,
  // so a backfilled batch of old films would otherwise fill the whole page.
  items.sort((a, b) => (b.watched || '').localeCompare(a.watched || ''));

  return items.slice(0, MAX_ITEMS);
}

export async function onRequestGet() {
  const cache = caches.default;
  const cacheKey = new Request(CACHE_KEY);

  try {
    const res = await fetch(FEED, {
      headers: { 'User-Agent': 'johngunerli.com' },
      cf: { cacheTtl: TTL, cacheEverything: true },
    });
    if (!res.ok) throw new Error(`letterboxd responded ${res.status}`);

    const items = parseFeed(await res.text());
    if (!items.length) throw new Error('no film entries in feed');

    const body = JSON.stringify({ items, fetchedAt: new Date().toISOString() });
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': `public, max-age=300, s-maxage=${TTL}, stale-while-revalidate=86400`,
    };

    // Keep a copy so an upstream failure can still be answered with real data.
    await cache.put(cacheKey, new Response(body, { headers }));

    return new Response(body, { headers });
  } catch (err) {
    const stale = await cache.match(cacheKey);
    if (stale) return stale;

    // Nothing cached either: hand the client an empty list rather than a 5xx,
    // so it can fall back on its own localStorage copy.
    return new Response(JSON.stringify({ items: [], error: err.message }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    });
  }
}
