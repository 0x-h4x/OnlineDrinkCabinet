# Online Drink Cabinet

A cocktail recipe book backed by SQLite that helps you manage your home bar inventory and discover what you can mix with the bottles you already have.

## Features

- **Fridge & Pantry module** – add ingredients, tag them by category, and flip them in or out of stock. Everything is stored in a SQLite database so your inventory persists between sessions.
- **Cocktail library** – browse a curated starter collection of spritzes, highballs, and sours. Every recipe checks against your fridge to highlight what is ready to shake and what still needs a shopping trip.
- **Custom creations** – add new drinks with a name, searchable ingredient selector (with inline creation), and preparation instructions. Ingredients are automatically linked in the database so availability stays in sync.
- **Search & filter controls** – find drinks by name, ingredient, or method while toggling between ready-to-mix and missing-ingredient views.
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

The first start seeds the SQLite database (`data/cabinet.db`) with a base catalogue of ingredients and drinks. Subsequent launches reuse the same file so your additions persist, and seeding only re-runs when the bundled dataset version changes.
The first start seeds the SQLite database (`data/cabinet.db`) with a base catalogue of ingredients and drinks. Subsequent launches reuse the same file so your additions persist.

## Development tips

- The API lives in `server.js`. It exposes `/api/ingredients` and `/api/drinks` endpoints for listing, creating, and updating data.
- Ingredient inventory is toggled with `PATCH /api/ingredients/:id`. Use `POST /api/ingredients/reset` to clear stock flags without removing entries.
- Drinks created through the UI automatically create missing ingredients in the catalogue (marked out of stock by default) so you can immediately manage them in the fridge module.

To iterate faster while developing, you can run the server with hot reload using `npm run dev` (requires `nodemon`, installed as a dev dependency).

## Function overview

### Server (`server.js`)

- `migrate()` – ensures the SQLite schema for ingredients, drinks, and their join table exists before handling requests.
- `seedIngredients()` – inserts the starter ingredient catalogue while keeping any user-supplied categories intact (data lives in `seed/defaultData.js`).
- `seedDrinks()` – loads the base drink recipes from `seed/defaultData.js`, linking them to the corresponding ingredients.
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
- `summariseDrink(drink)` / `shouldDisplayDrink(drink)` – compute aggregate stats, support readiness filters, and match the search box.
- `summariseDrink(drink)` / `shouldDisplayDrink(drink)` – compute aggregate stats for filtering and status messaging.
