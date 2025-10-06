# Online Drink Cabinet

A cocktail recipe book backed by SQLite that helps you manage your home bar inventory and discover what you can mix with the bottles you already have.

## Features

- **Fridge & Pantry module** – add ingredients, tag them by category, and flip them in or out of stock. Everything is stored in a SQLite database so your inventory persists between sessions.
- **Cocktail library** – browse a curated starter collection of spritzes, highballs, and sours. Every recipe checks against your fridge to highlight what is ready to shake and what still needs a shopping trip.
- **Custom creations** – add new drinks with a name, comma-separated ingredient list, and preparation instructions. Ingredients are automatically linked in the database so availability stays in sync.
- **Server-side API** – the front end fetches data from a tiny Express API, which you can extend or connect to other clients if needed.

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer (ships with `npm`)

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the API and web server:
   ```bash
   npm start
   ```
3. Open [http://localhost:1933](http://localhost:1933) in your browser. The Express server serves the static front-end files and the JSON API at the same port.

The first start seeds the SQLite database (`data/cabinet.db`) with a base catalogue of ingredients and drinks. Subsequent launches reuse the same file so your additions persist.

## Development tips

- The API lives in `server.js`. It exposes `/api/ingredients` and `/api/drinks` endpoints for listing, creating, and updating data.
- Ingredient inventory is toggled with `PATCH /api/ingredients/:id`. Use `POST /api/ingredients/reset` to clear stock flags without removing entries.
- Drinks created through the UI automatically create missing ingredients in the catalogue (marked out of stock by default) so you can immediately manage them in the fridge module.

To iterate faster while developing, you can run the server with hot reload using `npm run dev` (requires `nodemon`, installed as a dev dependency).

## Hosting on GitHub Pages

GitHub Pages only serves static assets, so the full stack version of this project (which relies on the Express/SQLite API) cannot run there by itself. You can, however, host the front-end files on Pages and point them at a separately hosted instance of the API.

1. Deploy the API to a platform that supports long-running Node services (for example [Render](https://render.com/), [Railway](https://railway.app/), or [Fly.io](https://fly.io/)). Use `npm start` as the entry point and make sure the service listens on the port provided by the host instead of the hard-coded `1933` when running in production.
2. Once the backend is deployed, note its public base URL (e.g. `https://your-app.onrender.com`). Update `app.js` to use that URL when building `fetch` requests instead of the relative `/api/...` paths, or inject it via an environment-specific configuration.
3. Build a static bundle consisting of `index.html`, `styles.css`, `app.js`, and any assets. Commit them to a `gh-pages` branch and enable GitHub Pages in the repository settings, selecting that branch as the source.
4. Visit the GitHub Pages site. The client will load from GitHub's CDN and communicate with your hosted API.

If you prefer a single hosting target, consider deploying the entire Node app to a service that supports both static files and Node processes; GitHub Pages alone is not sufficient because it cannot run the Express server or host the SQLite database.

## Function overview

### Server (`server.js`)

- `migrate()` – ensures the SQLite schema for ingredients, drinks, and their join table exists before handling requests.
- `seedIngredients()` – inserts the starter ingredient catalogue while keeping any user-supplied categories intact.
- `seedDrinks()` – loads the base drink recipes, linking them to the corresponding ingredients.
- `normaliseIngredientName(name)` – trims and collapses whitespace so ingredient and drink names stay consistent.
- Express route handlers – serve and mutate ingredient and drink data (`/api/ingredients`, `/api/drinks`) with validation and error handling.

### Client (`app.js`)

- `fetchJSON(url, options)` – wraps `fetch` calls, throwing helpful errors when responses fail.
- `loadIngredients()` / `loadDrinks()` – hydrate the UI state from the API and trigger rendering.
- `updateIngredientCatalog()` – keeps the datalist suggestions for ingredient names current.
- `syncDrinkAvailability()` – merges fridge stock levels into each drink so availability badges stay accurate.
- `renderIngredients()` / `renderDrinks()` – build the DOM for the fridge pills and drink cards, including empty states and badges.
- `summariseDrink(drink)` / `shouldDisplayDrink(drink)` – compute aggregate stats for filtering and status messaging.
