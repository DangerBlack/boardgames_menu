import 'dotenv/config';
import express from 'express';
import { getBggCollection, getBggThing } from 'bgg-xml-api-client';
import he from 'he';
const { decode } = he;

const app = express();
const PORT = process.env.PORT || 3000;

const cache = new Map();
const CACHE_TTL = 120 * 60 * 1000;

app.use(express.static('public'));

if (!process.env.BGG_TOKEN) {
  console.error('BGG_TOKEN environment variable is required. Get one at https://boardgamegeek.com/settings/api');
  process.exit(1);
}
const clientSettings = { authorizationKey: process.env.BGG_TOKEN, timeout: 30000 };

app.get('/api/collection', async (req, res) => {
  const username = req.query.username?.trim();
  if (!username) {
    return res.status(400).json({ error: 'Missing username parameter' });
  }

  const cacheKey = username.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return res.json({ games: cached.games });
  }

  try {
    const data = await getBggCollection(
      { username, own: 1, excludesubtype: 'boardgameexpansion', stats: 1 },
      clientSettings
    );

    const rawItems = data?.item;
    if (!rawItems) {
      cache.set(cacheKey, { games: [], ts: Date.now() });
      return res.json({ games: [] });
    }

    const items = Array.isArray(rawItems) ? rawItems : [rawItems];

    const games = items.map((item) => ({
      id: parseInt(item.objectid, 10),
      name: decode(item.name?.text || item.name || 'Unknown'),
      year: item.yearpublished ? parseInt(item.yearpublished, 10) : null,
      thumbnail: item.thumbnail || null,
      image: item.image || null,
      minPlayers: item.stats?.minplayers
        ? parseInt(item.stats.minplayers, 10)
        : null,
      maxPlayers: item.stats?.maxplayers
        ? parseInt(item.stats.maxplayers, 10)
        : null,
      playingTime: item.stats?.playingtime
        ? parseInt(item.stats.playingtime, 10)
        : null,
      numPlays: item.numplays ? parseInt(item.numplays, 10) : 0,
      weight: null,
      bggRating: null,
    }));

    // Batch-fetch complexity (weight) from thing endpoint
    const batchSize = 20;
    for (let i = 0; i < games.length; i += batchSize) {
      const batch = games.slice(i, i + batchSize);
      const ids = batch.map((g) => g.id).join(',');
      try {
        const thingData = await getBggThing({ id: ids, stats: 1 }, clientSettings);
        const thingItems = Array.isArray(thingData?.item)
          ? thingData.item
          : thingData?.item ? [thingData.item] : [];

        for (const t of thingItems) {
          const id = parseInt(t.id, 10);
          const game = batch.find((g) => g.id === id);
          if (game) {
            const stats = t.statistics?.ratings;
            if (stats?.averageweight?.value) {
              game.weight = parseFloat(stats.averageweight.value);
            }
            if (stats?.average?.value) {
              game.bggRating = parseFloat(stats.average.value);
            }
          }
        }
      } catch {
        // Silently skip weight for failed batches
      }
    }

    function sortKey(name) {
      return name.replace(/^(The|A|An)\s+/i, '').toLowerCase();
    }
    games.sort((a, b) => sortKey(a.name).localeCompare(sortKey(b.name)));

    cache.set(cacheKey, { games, ts: Date.now() });
    res.json({ games });
  } catch (err) {
    console.error('BGG API error:', err.message);
    res.status(500).json({
      error: 'Failed to fetch collection from BoardGameGeek.',
      details: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Board Games Menu — http://localhost:${PORT}`);
});
