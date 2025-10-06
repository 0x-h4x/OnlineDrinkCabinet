const state = {
  ingredients: [],
  drinks: [],
  filter: 'all'
};

const elements = {
  ingredientForm: document.getElementById('add-ingredient-form'),
  ingredientName: document.getElementById('ingredient-input'),
  ingredientCategory: document.getElementById('ingredient-category'),
  ingredientList: document.getElementById('inventory-list'),
  inventoryCount: document.querySelector('.inventory-count'),
  resetInventory: document.getElementById('reset-inventory'),
  ingredientCatalog: document.getElementById('ingredient-catalog'),
  drinkForm: document.getElementById('add-drink-form'),
  drinkName: document.getElementById('drink-name'),
  drinkIngredients: document.getElementById('drink-ingredients'),
  drinkRecipe: document.getElementById('drink-recipe'),
  drinksList: document.getElementById('drinks-list'),
  filterButtons: document.querySelectorAll('.drinks-filter .chip'),
  drinkTemplate: document.getElementById('drink-template')
};

async function fetchJSON(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const message = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(message.message || 'Request failed');
  }
  return response.json();
}

async function loadIngredients() {
  const data = await fetchJSON('/api/ingredients');
  state.ingredients = data;
  syncDrinkAvailability();
  renderIngredients();
  updateIngredientCatalog();
  renderDrinks();
}

async function loadDrinks() {
  const data = await fetchJSON('/api/drinks');
  state.drinks = data;
  syncDrinkAvailability();
  renderDrinks();
}

function updateIngredientCatalog() {
  elements.ingredientCatalog.innerHTML = '';
  for (const ingredient of state.ingredients) {
    const option = document.createElement('option');
    option.value = ingredient.name;
    elements.ingredientCatalog.append(option);
  }
}

function syncDrinkAvailability() {
  const availability = new Map(state.ingredients.map((item) => [item.id, item.inStock]));
  state.drinks = state.drinks.map((drink) => ({
    ...drink,
    ingredients: drink.ingredients.map((ingredient) => ({
      ...ingredient,
      inStock: availability.has(ingredient.id) ? availability.get(ingredient.id) : ingredient.inStock
    }))
  }));
}

function renderIngredients() {
  const inStockCount = state.ingredients.filter((item) => item.inStock).length;
  if (state.ingredients.length === 0) {
    elements.inventoryCount.textContent = 'No ingredients saved yet.';
  } else {
    const summary = `${inStockCount} of ${state.ingredients.length} ingredient${
      state.ingredients.length === 1 ? '' : 's'
    } in stock`;
    elements.inventoryCount.textContent = summary;
  }

  elements.ingredientList.innerHTML = '';
  if (state.ingredients.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'Add items to your fridge to start tracking availability.';
    elements.ingredientList.append(empty);
    return;
  }

  const sorted = [...state.ingredients].sort((a, b) => a.name.localeCompare(b.name));
  for (const ingredient of sorted) {
    const item = document.createElement('li');
    item.className = `pill ${ingredient.inStock ? 'pill-active' : ''}`;
    item.dataset.id = ingredient.id;
    item.setAttribute('role', 'button');
    item.tabIndex = 0;
    item.title = ingredient.inStock ? 'Mark as out of stock' : 'Mark as in stock';
    item.textContent = ingredient.name;
    item.addEventListener('click', () => toggleIngredient(ingredient.id, !ingredient.inStock));
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleIngredient(ingredient.id, !ingredient.inStock);
      }
    });
    elements.ingredientList.append(item);
  }
}

function summariseDrink(drink) {
  const total = drink.ingredients.length;
  const available = drink.ingredients.filter((ingredient) => ingredient.inStock).length;
  const missing = drink.ingredients.filter((ingredient) => !ingredient.inStock);
  return {
    total,
    available,
    missing,
    ready: total > 0 && missing.length === 0
  };
}

function shouldDisplayDrink(drink) {
  const summary = summariseDrink(drink);
  switch (state.filter) {
    case 'ready':
      return summary.ready;
    case 'missing':
      return summary.missing.length > 0;
    default:
      return true;
  }
}

function renderDrinks() {
  elements.drinksList.innerHTML = '';
  if (state.drinks.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'No drinks saved yet. Add one above to get started.';
    elements.drinksList.append(empty);
    return;
  }

  const drinksToShow = state.drinks.filter(shouldDisplayDrink);
  if (drinksToShow.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent =
      state.filter === 'ready'
        ? 'Nothing is fully stocked yet. Add more ingredients to unlock drinks.'
        : 'Everything here is ready to shake. Switch filters to explore more.';
    elements.drinksList.append(empty);
    return;
  }

  const template = elements.drinkTemplate.content;
  for (const drink of drinksToShow) {
    const summary = summariseDrink(drink);
    const node = template.cloneNode(true);
    const listItem = node.querySelector('.drink-card');
    listItem.dataset.drinkId = drink.id;

    node.querySelector('.drink-title').textContent = drink.name;
    node.querySelector('.drink-recipe').textContent = drink.instructions;

    const status = node.querySelector('.drink-status');
    const badge = node.querySelector('.drink-badge');
    if (summary.ready) {
      status.textContent = 'Ready to mix';
      badge.textContent = 'Ready';
      badge.className = 'drink-badge badge-ready';
    } else if (summary.missing.length === summary.total) {
      status.textContent = 'Missing every ingredient';
      badge.textContent = 'Out';
      badge.className = 'drink-badge badge-missing';
    } else {
      status.textContent = `Missing ${summary.missing.length} of ${summary.total}`;
      badge.textContent = `${summary.available}/${summary.total}`;
      badge.className = 'drink-badge badge-partial';
    }

    const ingredientList = node.querySelector('.ingredient-list');
    ingredientList.innerHTML = '';
    for (const ingredient of drink.ingredients) {
      const ingredientItem = document.createElement('li');
      ingredientItem.textContent = ingredient.name;
      if (ingredient.inStock) {
        ingredientItem.classList.add('ingredient-ready');
      } else {
        ingredientItem.classList.add('ingredient-missing');
      }
      ingredientList.append(ingredientItem);
    }

    const missingText = node.querySelector('.missing-ingredients');
    if (summary.missing.length > 0) {
      missingText.textContent = `Missing: ${summary.missing.map((item) => item.name).join(', ')}`;
    } else {
      missingText.textContent = 'Everything you need is on hand.';
    }

    elements.drinksList.append(node);
  }
}

async function toggleIngredient(id, inStock) {
  try {
    await fetchJSON(`/api/ingredients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock })
    });
    await loadIngredients();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

async function handleIngredientSubmit(event) {
  event.preventDefault();
  const name = elements.ingredientName.value.trim();
  const category = elements.ingredientCategory.value.trim();
  if (!name) return;

  try {
    await fetchJSON('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category: category || null, inStock: true })
    });
    elements.ingredientForm.reset();
    await loadIngredients();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

async function handleResetInventory() {
  try {
    await fetchJSON('/api/ingredients/reset', { method: 'POST' });
    await loadIngredients();
  } catch (error) {
    console.error(error);
    alert('Unable to reset inventory.');
  }
}

async function handleDrinkSubmit(event) {
  event.preventDefault();
  const name = elements.drinkName.value.trim();
  const instructions = elements.drinkRecipe.value.trim();
  const ingredientsInput = elements.drinkIngredients.value
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (!name || !instructions || ingredientsInput.length === 0) {
    return;
  }

  try {
    await fetchJSON('/api/drinks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, instructions, ingredients: ingredientsInput })
    });
    elements.drinkForm.reset();
    await Promise.all([loadDrinks(), loadIngredients()]);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

function handleFilterClick(event) {
  const button = event.target.closest('button[data-filter]');
  if (!button) return;
  state.filter = button.dataset.filter;
  elements.filterButtons.forEach((chip) => chip.classList.toggle('chip-active', chip === button));
  renderDrinks();
}

function setupEventListeners() {
  elements.ingredientForm.addEventListener('submit', handleIngredientSubmit);
  elements.resetInventory.addEventListener('click', handleResetInventory);
  elements.drinkForm.addEventListener('submit', handleDrinkSubmit);
  document.querySelector('.drinks-filter').addEventListener('click', handleFilterClick);
}

async function bootstrap() {
  setupEventListeners();
  try {
    await Promise.all([loadIngredients(), loadDrinks()]);
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
