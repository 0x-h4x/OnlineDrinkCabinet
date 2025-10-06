const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 1933;
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'cabinet.db');

fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

const { baseDrinks, baseIngredients } = require('./seed/defaultData');

const SEED_VERSION = 2;


function migrate() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      category TEXT,
      in_stock INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS drinks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      instructions TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS drink_ingredients (
      drink_id INTEGER NOT NULL,
      ingredient_id INTEGER NOT NULL,
      PRIMARY KEY (drink_id, ingredient_id),
      FOREIGN KEY (drink_id) REFERENCES drinks(id) ON DELETE CASCADE,
      FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `).run();
}

function seedIngredients() {
  const insert = db.prepare('INSERT OR IGNORE INTO ingredients (name, category) VALUES (?, ?)');
  const updateCategory = db.prepare('UPDATE ingredients SET category = COALESCE(category, ?) WHERE name = ?');
  const transaction = db.transaction(() => {
    for (const item of baseIngredients) {
      insert.run(item.name, item.category);
      updateCategory.run(item.category, item.name);
    }
  });
  transaction();
}

function seedDrinks() {
  const insertDrink = db.prepare('INSERT OR IGNORE INTO drinks (name, instructions) VALUES (?, ?)');
  const getDrinkId = db.prepare('SELECT id FROM drinks WHERE name = ?');
  const getIngredientId = db.prepare('SELECT id FROM ingredients WHERE LOWER(name) = LOWER(?)');
  const insertLink = db.prepare('INSERT OR IGNORE INTO drink_ingredients (drink_id, ingredient_id) VALUES (?, ?)');

  const transaction = db.transaction(() => {
    for (const drink of baseDrinks) {
      insertDrink.run(drink.name, drink.instructions);
      const drinkRow = getDrinkId.get(drink.name);
      if (!drinkRow) continue;
      for (const ingredient of drink.ingredients) {
        const ingredientRow = getIngredientId.get(ingredient);
        if (!ingredientRow) continue;
        insertLink.run(drinkRow.id, ingredientRow.id);
      }
    }
  });
  transaction();
}

function seedDatabaseIfNeeded() {
  const getSeedVersionStatement = db.prepare('SELECT value FROM app_meta WHERE key = ?');
  const upsertSeedVersionStatement = db.prepare(
    'INSERT INTO app_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  );

  const row = getSeedVersionStatement.get('seed_version');
  const parsed = row ? Number.parseInt(row.value, 10) : 0;
  const currentVersion = Number.isFinite(parsed) ? parsed : 0;
  if (currentVersion >= SEED_VERSION) {
    return;
  }

  seedIngredients();
  seedDrinks();
  upsertSeedVersionStatement.run('seed_version', String(SEED_VERSION));
}

migrate();
seedDatabaseIfNeeded();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function normaliseIngredientName(name) {
  return name.trim().replace(/\s+/g, ' ');
}

function validateDrinkPayload(payload = {}) {
  const errors = [];
  const name = typeof payload.name === 'string' ? normaliseIngredientName(payload.name) : '';
  if (!name) {
    errors.push('Drink name is required.');
  }

  const instructions = typeof payload.instructions === 'string' ? payload.instructions.trim() : '';
  if (!instructions) {
    errors.push('Instructions are required.');
  }

  const rawIngredients = Array.isArray(payload.ingredients) ? payload.ingredients : [];
  const seen = new Set();
  const ingredients = [];

  for (const value of rawIngredients) {
    if (typeof value !== 'string') continue;
    const cleaned = normaliseIngredientName(value);
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    ingredients.push(cleaned);
  }

  if (ingredients.length === 0) {
    errors.push('At least one ingredient is required.');
  }

  return {
    ok: errors.length === 0,
    errors,
    data: errors.length === 0 ? { name, instructions, ingredients } : null
  };
}

const selectIngredientByName = db.prepare(
  'SELECT id, name, category, in_stock as inStock FROM ingredients WHERE LOWER(name) = LOWER(?)'
);
const insertIngredient = db.prepare('INSERT INTO ingredients (name, category, in_stock) VALUES (?, ?, 0)');
const updateIngredientCategory = db.prepare('UPDATE ingredients SET category = ? WHERE id = ?');

function ensureIngredient(name, { category = null } = {}) {
  const cleanedName = normaliseIngredientName(name);
  if (!cleanedName) {
    throw new Error('Ingredient name is required.');
  }

  const cleanedCategory = category && typeof category === 'string' ? normaliseIngredientName(category) : null;

  let ingredient = selectIngredientByName.get(cleanedName);
  if (ingredient) {
    const currentCategory = ingredient.category || null;
    if (
      cleanedCategory &&
      (!currentCategory || currentCategory.toLowerCase() !== cleanedCategory.toLowerCase())
    ) {
      updateIngredientCategory.run(cleanedCategory, ingredient.id);
      ingredient = { ...ingredient, category: cleanedCategory };
    }
    return { ...ingredient, inStock: !!ingredient.inStock };
  }

  const insertResult = insertIngredient.run(cleanedName, cleanedCategory);
  return {
    id: insertResult.lastInsertRowid,
    name: cleanedName,
    category: cleanedCategory,
    inStock: false
  };
}

const selectDrinkById = db.prepare('SELECT id, name, instructions FROM drinks WHERE id = ?');
const selectDrinkIngredients = db.prepare(`
  SELECT i.id, i.name, i.category, i.in_stock as inStock
  FROM drink_ingredients di
  JOIN ingredients i ON i.id = di.ingredient_id
  WHERE di.drink_id = ?
  ORDER BY i.name COLLATE NOCASE
`);

function getDrinkWithAvailability(drinkId) {
  const drink = selectDrinkById.get(drinkId);
  if (!drink) return null;

  const ingredients = selectDrinkIngredients.all(drinkId).map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    inStock: !!row.inStock
  }));

  const total = ingredients.length;
  const available = ingredients.filter((item) => item.inStock).length;
  const missing = ingredients.filter((item) => !item.inStock);

  return {
    id: drink.id,
    name: drink.name,
    instructions: drink.instructions,
    ingredients,
    availability: {
      total,
      available,
      missing: missing.map((item) => item.name)
    }
  };
}

app.get('/api/ingredients', (req, res) => {
  const ingredients = db
    .prepare('SELECT id, name, category, in_stock as inStock FROM ingredients ORDER BY name COLLATE NOCASE')
    .all();
  res.json(ingredients);
});

app.post('/api/ingredients', (req, res) => {
  const { name, category = null, inStock = false } = req.body || {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Ingredient name is required.' });
  }
  const cleanName = normaliseIngredientName(name);
  const categoryValue = category && typeof category === 'string' ? normaliseIngredientName(category) : null;
  const insert = db.prepare(
    'INSERT INTO ingredients (name, category, in_stock) VALUES (?, ?, ?) ON CONFLICT(name) DO UPDATE SET category = COALESCE(excluded.category, ingredients.category)'
  );
  const result = insert.run(cleanName, categoryValue, inStock ? 1 : 0);
  const ingredient = db
    .prepare('SELECT id, name, category, in_stock as inStock FROM ingredients WHERE name = ?')
    .get(cleanName);
  res.status(result.changes ? 201 : 200).json(ingredient);
});

app.patch('/api/ingredients/:id', (req, res) => {
  const { id } = req.params;
  const { inStock } = req.body || {};
  if (typeof inStock !== 'boolean') {
    return res.status(400).json({ message: 'inStock must be a boolean.' });
  }
  const update = db.prepare('UPDATE ingredients SET in_stock = ? WHERE id = ?');
  const result = update.run(inStock ? 1 : 0, id);
  if (result.changes === 0) {
    return res.status(404).json({ message: 'Ingredient not found.' });
  }
  const ingredient = db
    .prepare('SELECT id, name, category, in_stock as inStock FROM ingredients WHERE id = ?')
    .get(id);
  res.json(ingredient);
});

app.post('/api/ingredients/reset', (req, res) => {
  db.prepare('UPDATE ingredients SET in_stock = 0').run();
  const ingredients = db
    .prepare('SELECT id, name, category, in_stock as inStock FROM ingredients ORDER BY name COLLATE NOCASE')
    .all();
  res.json(ingredients);
});

app.get('/api/drinks', (req, res) => {
  const drinks = db.prepare('SELECT id FROM drinks ORDER BY name COLLATE NOCASE').all();
  const payload = drinks
    .map((row) => getDrinkWithAvailability(row.id))
    .filter((drink) => drink !== null);
  res.json(payload);
});

const insertDrinkStatement = db.prepare('INSERT INTO drinks (name, instructions) VALUES (?, ?)');
const linkIngredientStatement = db.prepare('INSERT INTO drink_ingredients (drink_id, ingredient_id) VALUES (?, ?)');

app.post('/api/drinks', (req, res, next) => {
  const validation = validateDrinkPayload(req.body);
  if (!validation.ok) {
    return res.status(400).json({ message: validation.errors[0], errors: validation.errors });
  }

  const { name, instructions, ingredients } = validation.data;

  try {
    const createDrink = db.transaction(() => {
      const result = insertDrinkStatement.run(name, instructions);
      const drinkId = result.lastInsertRowid;

      for (const ingredientName of ingredients) {
        const ingredient = ensureIngredient(ingredientName);
        linkIngredientStatement.run(drinkId, ingredient.id);
      }

      return drinkId;
    });

    const drinkId = createDrink();
    const payload = getDrinkWithAvailability(drinkId);
    res.status(201).json(payload);
  } catch (error) {
    if (error && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ message: 'A drink with that name already exists.' });
    }
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error.' });
});

app.listen(PORT, () => {
  console.log(`Drink cabinet API listening on http://localhost:${PORT}`);
});
