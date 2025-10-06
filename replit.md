# Online Drink Cabinet - Replit Setup

## Overview
A cocktail recipe manager with ingredient inventory tracking, powered by SQLite and Express. The application helps you manage your home bar inventory and discover cocktails you can make with the ingredients you have on hand.

**Current State**: Configured for Replit environment
**Last Updated**: 2025-10-06

## Recent Changes
- 2025-10-06: Initial import and Replit configuration
  - Updated server to bind to 0.0.0.0:5000 for Replit
  - Enhanced .gitignore with comprehensive Node.js patterns
  - Created project documentation

## Project Architecture

### Technology Stack
- **Backend**: Node.js + Express + SQLite (better-sqlite3)
- **Frontend**: Vanilla JavaScript + HTML + CSS
- **Database**: SQLite with automatic seeding
- **Package Manager**: npm

### Project Structure
```
/
├── server.js           # Express server + API + static file serving
├── app.js              # Frontend JavaScript (state management + DOM)
├── index.html          # Main HTML page
├── styles.css          # Application styles
├── seed/
│   └── defaultData.js  # Initial ingredients and cocktail recipes
├── data/
│   └── cabinet.db      # SQLite database (auto-generated)
└── package.json        # Dependencies and scripts
```

### Key Features
1. **Ingredient Management**: Add ingredients with categories, toggle in-stock status
2. **Cocktail Library**: Browse 40+ pre-loaded cocktail recipes
3. **Custom Drinks**: Create your own recipes with automatic ingredient linking
4. **Search & Filter**: Find drinks by name/ingredient, filter by availability
5. **Persistent Storage**: SQLite database with automatic seeding

### Database Schema
- `ingredients`: id, name, category, in_stock, created_at
- `drinks`: id, name, instructions, created_at
- `drink_ingredients`: drink_id, ingredient_id (many-to-many)
- `app_meta`: key-value pairs for seed versioning

### API Endpoints
- `GET /api/ingredients` - List all ingredients
- `POST /api/ingredients` - Add new ingredient
- `PATCH /api/ingredients/:id` - Toggle in-stock status
- `POST /api/ingredients/reset` - Clear all stock flags
- `GET /api/drinks` - List all drinks with availability
- `POST /api/drinks` - Create new drink (auto-creates missing ingredients)

## User Preferences
None specified yet.

## Development Notes
- Server serves both API and static frontend files from root directory
- Database auto-creates on first run with seed data (40+ cocktails, 50+ ingredients)
- Port configured for Replit environment (5000, bound to 0.0.0.0)
- CORS enabled for API access
- All ingredients and drinks use case-insensitive, normalized names
