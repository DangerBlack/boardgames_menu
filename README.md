# Board Games Menu

> **Game Night à la Carte** — a fancy restaurant-style menu builder for your board game collection.

Import your BoardGameGeek collection and compose a multi-course "menu" of games for the evening: **Antipasto** (short/light games to warm up), **Portata Principale** (the main event), and **Dolce** (a sweet finish). Preview and print the menu for a touch of class on game night.

## Features

- **BGG Import** — Fetches your owned collection from BoardGameGeek (expansions excluded), including player counts, play time, complexity rating, BGG rating, and play count.
- **Smart Sorting** — Games are automatically suggested as *Antipasto* (≤30 min or complexity < 2.0) or *Portata Principale*.
- **Cycle Assignment** — Click a game to add it to a course; click again to cycle through courses; a third click removes it.
- **Full-text Search** — Filter your collection by name.
- **Multi-dimensional Filters** — Filter by course assignment, player count, duration, and complexity.
- **Player Count** — Set the number of guests; the preview modal reflects it.
- **Elegant Preview** — A refined restaurant-style modal with dates, player count, star ratings (based on play count), and print support.
- **Print-ready** — Print styles hide UI chrome and render a clean A4 menu.
- **Caching** — Collection data is cached server-side for 2 hours to avoid hitting BGG rate limits.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express |
| Frontend | Vanilla JS, CSS (no framework) |
| API | [BoardGameGeek XML API](https://boardgamegeek.com/wiki/page/BGG_XML_API2) via [`bgg-xml-api-client`](https://www.npmjs.com/package/bgg-xml-api-client) |
| Fonts | Playfair Display, Lato (Google Fonts) |
| Container | Docker (Node 22 Alpine) |

## Getting Started

### Prerequisites

- Node.js 22+
- A BoardGameGeek account with a public collection
- A [BGG API token](https://boardgamegeek.com/settings/api) — **required** by current BGG API rules

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd boardgames_menu

# Install dependencies
npm install

# Set your BGG API token (required — BGG no longer allows anonymous requests)
cp .env.example .env
# Edit .env and add your BGG_TOKEN
```

### Run

```bash
npm start
```

Open http://localhost:3000

### Docker

```bash
docker build -t boardgames-menu .
docker run -p 3000:3000 --env-file .env boardgames-menu
```

## Configuration

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP server port |
| `BGG_TOKEN` | *(required)* | BoardGameGeek API token. **Mandatory** — BGG no longer permits anonymous requests. [Get yours here](https://boardgamegeek.com/settings/api). |

## How to Use

1. **Import** — Enter your BGG username and click *Import*.
2. **Browse & Filter** — Use search, course tags, and stat filters to find games.
3. **Compose** — Click a game card to add it. Click again to cycle course (Antipasto → Principale → Dolce → removed). You can assign up to 5 games to *Portata Principale*.
4. **Set Players** — Use the −/+ controls to set guest count.
5. **Preview** — Click *Preview Menu* to see the polished restaurant-style menu.
6. **Print** — Click *Print* for a clean A4 format.

## API

### `GET /api/collection?username=<bgg-username>`

Fetches the user's owned BGG collection with stats.

**Response:**
```json
{
  "games": [
    {
      "id": 12345,
      "name": "Wingspan",
      "year": 2019,
      "thumbnail": "https://...",
      "image": "https://...",
      "minPlayers": 1,
      "maxPlayers": 5,
      "playingTime": 70,
      "numPlays": 12,
      "weight": 2.4,
      "bggRating": 7.9
    }
  ]
}
```

## License

MIT
