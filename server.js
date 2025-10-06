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

const baseIngredients = [
  { name: 'Vodka', category: 'Base Spirit' },
  { name: 'White rum', category: 'Base Spirit' },
  { name: 'Gin', category: 'Base Spirit' },
  { name: 'Tequila (silver)', category: 'Base Spirit' },
  { name: 'Triple sec', category: 'Liqueur' },
  { name: 'Peach schnapps', category: 'Liqueur' },
  { name: 'Coconut rum', category: 'Liqueur' },
  { name: 'Pineapple juice', category: 'Juice' },
  { name: 'Cranberry juice', category: 'Juice' },
  { name: 'Orange juice', category: 'Juice' },
  { name: 'Lime juice', category: 'Juice' },
  { name: 'Lemon juice', category: 'Juice' },
  { name: 'Grapefruit juice', category: 'Juice' },
  { name: 'Simple syrup', category: 'Syrup' },
  { name: 'Grenadine', category: 'Syrup' },
  { name: 'Passion fruit syrup', category: 'Syrup' },
  { name: 'Orgeat', category: 'Syrup' },
  { name: 'Cola', category: 'Soda' },
  { name: 'Ginger beer', category: 'Soda' },
  { name: 'Tonic water', category: 'Soda' },
  { name: 'Sparkling water', category: 'Soda' },
  { name: 'Prosecco', category: 'Wine' },
  { name: 'Bitters', category: 'Aromatic' },
  { name: 'Elderflower syrup', category: 'Syrup' },
  { name: 'Vanilla syrup', category: 'Syrup' },
  { name: 'Coconut cream', category: 'Mixer' },
  { name: 'Cucumber', category: 'Garnish' },
  { name: 'Mint leaves', category: 'Herb' },
  { name: 'Maraschino cherries', category: 'Garnish' },
  { name: 'Edible flowers', category: 'Garnish' }
];

const baseDrinks = [
  {
    name: 'French 75',
    ingredients: ['Gin', 'Lemon juice', 'Simple syrup', 'Prosecco'],
    instructions: `Add 45 ml gin, 20 ml lemon juice, and 15 ml simple syrup to a shaker with ice. Shake for 10 s, strain into a flute, and top with 60 ml prosecco. Garnish with lemon peel.`
  },
  {
    name: 'Piña Colada',
    ingredients: ['White rum', 'Coconut cream', 'Pineapple juice'],
    instructions: `Blend 60 ml rum, 90 ml pineapple juice, and 30 ml coconut cream with ice until smooth. Pour into a chilled glass and garnish with cherry and pineapple wedge.`
  },
  {
    name: 'Elderflower Gin & Tonic',
    ingredients: ['Gin', 'Tonic water', 'Elderflower syrup', 'Lime juice'],
    instructions: `Add 45 ml gin, 10 ml elderflower syrup, and 10 ml lime juice to a glass of ice. Top with 120 ml tonic water. Stir gently and garnish with cucumber.`
  },
  {
    name: 'Cucumber Vodka Tonic',
    ingredients: ['Vodka', 'Tonic water', 'Cucumber', 'Lime juice'],
    instructions: `Muddle three cucumber slices in glass. Add 45 ml vodka and ice. Top with 120 ml tonic and 10 ml lime juice. Stir once.`
  },
  {
    name: 'Vodka Spritz',
    ingredients: ['Vodka', 'Elderflower syrup', 'Sparkling water', 'Lemon juice'],
    instructions: `Combine 45 ml vodka, 10 ml elderflower syrup, and 15 ml lemon juice in glass with ice. Top with 100 ml sparkling water. Stir.`
  },
  {
    name: 'Grapefruit Spritz',
    ingredients: ['Vodka', 'Grapefruit juice', 'Prosecco'],
    instructions: `Combine 45 ml vodka and 60 ml grapefruit juice in glass. Add ice, top with 90 ml prosecco, stir once. Garnish grapefruit peel.`
  },
  {
    name: 'Bay Breeze',
    ingredients: ['Vodka', 'Pineapple juice', 'Cranberry juice'],
    instructions: `Shake 45 ml vodka, 60 ml pineapple, and 60 ml cranberry juice with ice. Strain into tall glass with fresh ice.`
  },
  {
    name: 'Sea Breeze',
    ingredients: ['Vodka', 'Cranberry juice', 'Grapefruit juice'],
    instructions: `Shake 45 ml vodka, 60 ml cranberry, and 45 ml grapefruit juice with ice. Strain into ice-filled glass.`
  },
  {
    name: 'Malibu Sunrise',
    ingredients: ['Coconut rum', 'Orange juice', 'Grenadine'],
    instructions: `Add 45 ml coconut rum and 90 ml orange juice to glass with ice. Slowly pour 15 ml grenadine for gradient.`
  },
  {
    name: 'Tequila Sunrise',
    ingredients: ['Tequila (silver)', 'Orange juice', 'Grenadine'],
    instructions: `Add 45 ml tequila and 90 ml orange juice to glass. Slowly pour 15 ml grenadine. Do not stir.`
  },
  {
    name: 'Rum Punch',
    ingredients: ['White rum', 'Pineapple juice', 'Orange juice', 'Grenadine', 'Lime juice'],
    instructions: `Shake 60 ml rum, 60 ml pineapple, 60 ml orange, 15 ml grenadine, 10 ml lime juice with ice. Strain.`
  },
  {
    name: 'Passion Fruit Cooler',
    ingredients: ['Vodka', 'Passion fruit syrup', 'Lime juice', 'Sparkling water'],
    instructions: `Shake 45 ml vodka, 20 ml passion fruit syrup, and 10 ml lime juice. Strain into glass, top with 100 ml sparkling water.`
  },
  {
    name: 'Peach Paradise',
    ingredients: ['Peach schnapps', 'Orange juice', 'Grenadine'],
    instructions: `Add 45 ml schnapps and 90 ml orange juice over ice. Drizzle 10 ml grenadine.`
  },
  {
    name: 'Tropical Fizz',
    ingredients: ['White rum', 'Pineapple juice', 'Sparkling water'],
    instructions: `Build with 45 ml rum and 90 ml pineapple juice. Top with 100 ml sparkling water. Stir once.`
  },
  {
    name: 'Vanilla Colada',
    ingredients: ['Coconut rum', 'Vanilla syrup', 'Coconut cream', 'Pineapple juice'],
    instructions: `Shake 45 ml coconut rum, 15 ml vanilla syrup, 30 ml coconut cream, 90 ml pineapple juice. Strain into glass with crushed ice.`
  },
  {
    name: 'Lemon Drop',
    ingredients: ['Vodka', 'Lemon juice', 'Simple syrup', 'Triple sec'],
    instructions: `Shake 45 ml vodka, 15 ml triple sec, 20 ml lemon juice, 15 ml simple syrup with ice. Fine strain into coupe.`
  },
  {
    name: 'Margarita Classic',
    ingredients: ['Tequila (silver)', 'Lime juice', 'Triple sec', 'Simple syrup'],
    instructions: `Shake 45 ml tequila, 15 ml triple sec, 20 ml lime juice, 10 ml simple syrup. Strain over ice. Garnish lime wedge.`
  },
  {
    name: 'Rum Sour',
    ingredients: ['White rum', 'Lemon juice', 'Orgeat'],
    instructions: `Shake 45 ml rum, 25 ml lemon juice, 15 ml orgeat. Strain into rocks glass with ice.`
  },
  {
    name: 'French Blossom',
    ingredients: ['Gin', 'Elderflower syrup', 'Lemon juice', 'Prosecco'],
    instructions: `Shake 45 ml gin, 15 ml elderflower syrup, 15 ml lemon juice with ice. Strain into flute. Top with 60 ml prosecco.`
  },
  {
    name: 'Moscow Mule',
    ingredients: ['Vodka', 'Lime juice', 'Ginger beer'],
    instructions: `Add 45 ml vodka and 10 ml lime juice to mug. Add ice, top with 120 ml ginger beer. Stir gently.`
  },
  {
    name: 'Rum Mule',
    ingredients: ['White rum', 'Lime juice', 'Ginger beer'],
    instructions: `Same as Moscow Mule but with rum. Garnish mint.`
  },
  {
    name: 'Cuba Libre',
    ingredients: ['White rum', 'Cola', 'Lime juice'],
    instructions: `Add 45 ml rum and 10 ml lime juice to glass of ice. Top with 120 ml cola.`
  },
  {
    name: 'Sex on the Beach',
    ingredients: ['Vodka', 'Peach schnapps', 'Cranberry juice', 'Orange juice'],
    instructions: `Add 30 ml vodka, 30 ml schnapps, 60 ml cranberry, 60 ml orange juice. Stir.`
  },
  {
    name: 'Paloma Highball',
    ingredients: ['Tequila (silver)', 'Grapefruit juice', 'Sparkling water', 'Simple syrup', 'Lime juice'],
    instructions: `Shake tequila, 60 ml grapefruit, 10 ml lime, 10 ml simple syrup. Pour over ice. Top with sparkling water.`
  },
  {
    name: 'Southside Spritz',
    ingredients: ['Gin', 'Lemon juice', 'Simple syrup', 'Mint leaves', 'Sparkling water'],
    instructions: `Muddle 6 mint leaves, add 45 ml gin, 15 ml lemon, 15 ml simple syrup, ice, top with sparkling water.`
  },
  {
    name: 'Mai Tai Light',
    ingredients: ['White rum', 'Lime juice', 'Orgeat', 'Triple sec'],
    instructions: `Shake 45 ml rum, 20 ml lime, 15 ml orgeat, 10 ml triple sec. Strain over crushed ice.`
  },
  {
    name: 'Clover Club',
    ingredients: ['Gin', 'Lemon juice', 'Grenadine'],
    instructions: `Shake 45 ml gin, 20 ml lemon, 10 ml grenadine with ice. Strain into coupe.`
  },
  {
    name: 'Pink Sunset',
    ingredients: ['Coconut rum', 'Cranberry juice', 'Pineapple juice'],
    instructions: `Shake 45 ml coconut rum, 60 ml cranberry, 60 ml pineapple. Strain.`
  },
  {
    name: 'Citrus Sparkler',
    ingredients: ['Gin', 'Orange juice', 'Sparkling water', 'Bitters'],
    instructions: `Build with 45 ml gin, 60 ml orange juice, dash of bitters, top 100 ml sparkling water.`
  },
  {
    name: 'Mimosa',
    ingredients: ['Orange juice', 'Prosecco'],
    instructions: `Combine equal parts (60 ml each) orange juice and prosecco in flute. No ice.`
  }
];

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

migrate();
seedIngredients();
seedDrinks();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function normaliseIngredientName(name) {
  return name.trim().replace(/\s+/g, ' ');
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
  const drinks = db.prepare('SELECT id, name, instructions FROM drinks ORDER BY name COLLATE NOCASE').all();
  const ingredientStmt = db.prepare(`
    SELECT di.drink_id as drinkId, i.id, i.name, i.category, i.in_stock as inStock
    FROM drink_ingredients di
    JOIN ingredients i ON i.id = di.ingredient_id
    WHERE di.drink_id = ?
    ORDER BY i.name COLLATE NOCASE
  `);

  const payload = drinks.map((drink) => {
    const ingredients = ingredientStmt.all(drink.id).map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      inStock: !!row.inStock
    }));
    return {
      id: drink.id,
      name: drink.name,
      instructions: drink.instructions,
      ingredients
    };
  });
  res.json(payload);
});

app.post('/api/drinks', (req, res) => {
  const { name, instructions, ingredients } = req.body || {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Drink name is required.' });
  }
  if (!instructions || typeof instructions !== 'string') {
    return res.status(400).json({ message: 'Instructions are required.' });
  }
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ message: 'At least one ingredient is required.' });
  }

  const cleanName = normaliseIngredientName(name);
  const cleanInstructions = instructions.trim();
  const cleanIngredients = ingredients
    .map((item) => (typeof item === 'string' ? normaliseIngredientName(item) : null))
    .filter((item) => item);

  if (!cleanIngredients.length) {
    return res.status(400).json({ message: 'Ingredients are invalid.' });
  }

  const insertDrink = db.prepare('INSERT INTO drinks (name, instructions) VALUES (?, ?)');
  let drinkId;
  try {
    const result = insertDrink.run(cleanName, cleanInstructions);
    drinkId = result.lastInsertRowid;
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ message: 'A drink with that name already exists.' });
    }
    throw error;
  }

  const getIngredient = db.prepare('SELECT id FROM ingredients WHERE LOWER(name) = LOWER(?)');
  const insertIngredient = db.prepare('INSERT INTO ingredients (name) VALUES (?)');
  const linkIngredient = db.prepare('INSERT INTO drink_ingredients (drink_id, ingredient_id) VALUES (?, ?)');

  const transaction = db.transaction(() => {
    for (const ingredientName of cleanIngredients) {
      let ingredient = getIngredient.get(ingredientName);
      if (!ingredient) {
        const result = insertIngredient.run(ingredientName);
        ingredient = { id: result.lastInsertRowid };
      }
      linkIngredient.run(drinkId, ingredient.id);
    }
  });

  try {
    transaction();
  } catch (error) {
    db.prepare('DELETE FROM drinks WHERE id = ?').run(drinkId);
    throw error;
  }

  const drink = db
    .prepare('SELECT id, name, instructions FROM drinks WHERE id = ?')
    .get(drinkId);
  const ingredientsForDrink = db.prepare(`
      SELECT i.id, i.name, i.category, i.in_stock as inStock
      FROM drink_ingredients di
      JOIN ingredients i ON i.id = di.ingredient_id
      WHERE di.drink_id = ?
      ORDER BY i.name COLLATE NOCASE
    `);
  const payload = {
    id: drink.id,
    name: drink.name,
    instructions: drink.instructions,
    ingredients: ingredientsForDrink.all(drink.id).map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      inStock: !!row.inStock
    }))
  };

  res.status(201).json(payload);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error.' });
});

app.listen(PORT, () => {
  console.log(`Drink cabinet API listening on http://localhost:${PORT}`);
});
