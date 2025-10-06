const state = {
  ingredients: [],
  drinks: [],
  filter: 'all',
  drinkFormIngredients: []
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
  drinkIngredientSearch: document.getElementById('drink-ingredient-search'),
  drinkIngredientCatalog: document.getElementById('drink-ingredient-catalog'),
  selectedDrinkIngredients: document.getElementById('selected-ingredients'),
  addIngredientToDrink: document.getElementById('add-ingredient-to-drink'),
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
  elements.drinkIngredientCatalog.innerHTML = '';
  const sorted = [...state.ingredients].sort((a, b) => a.name.localeCompare(b.name));
  for (const ingredient of sorted) {
    const option = document.createElement('option');
    option.value = ingredient.name;
    elements.ingredientCatalog.append(option);

    const drinkOption = document.createElement('option');
    drinkOption.value = ingredient.name;
    elements.drinkIngredientCatalog.append(drinkOption);
  }
}

function updateDrinkAvailability(drinks, availability) {
  return drinks.map((drink) => {
    const ingredients = drink.ingredients.map((ingredient) => {
      const inStock = availability.has(ingredient.id)
        ? availability.get(ingredient.id)
        : ingredient.inStock;
      return { ...ingredient, inStock: !!inStock };
    });

    const total = ingredients.length;
    const availableCount = ingredients.filter((item) => item.inStock).length;
    const missingNames = ingredients.filter((item) => !item.inStock).map((item) => item.name);

    return {
      ...drink,
      ingredients,
      availability: {
        total,
        available: availableCount,
        missing: missingNames
      }
    };
  });
}

function syncDrinkAvailability() {
  const availability = new Map(state.ingredients.map((item) => [item.id, item.inStock]));
  state.drinks = updateDrinkAvailability(state.drinks, availability);
}

function renderIngredientPill(ingredient) {
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
  return item;
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
    elements.ingredientList.append(renderIngredientPill(ingredient));
  }
}

function normaliseIngredientInput(name) {
  return name.trim().replace(/\s+/g, ' ');
}

function resolveIngredientName(value) {
  const cleanValue = normaliseIngredientInput(value);
  if (!cleanValue) return '';
  const existing = state.ingredients.find((item) => item.name.toLowerCase() === cleanValue.toLowerCase());
  return existing ? existing.name : cleanValue;
}

function renderSelectedDrinkIngredients() {
  const list = elements.selectedDrinkIngredients;
  list.innerHTML = '';

  if (state.drinkFormIngredients.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'selector-empty';
    empty.textContent = 'No ingredients yet. Search and add from the field below.';
    list.append(empty);
    return;
  }

  state.drinkFormIngredients.forEach((name, index) => {
    const item = document.createElement('li');
    item.className = 'selector-pill';

    const label = document.createElement('span');
    label.textContent = name;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'remove-pill';
    remove.dataset.index = index;
    remove.setAttribute('aria-label', `Remove ${name}`);
    remove.textContent = '×';

    item.append(label, remove);
    list.append(item);
  });
}

function updateDrinkFormState() {
  elements.drinkIngredients.value = state.drinkFormIngredients.join(', ');
  if (state.drinkFormIngredients.length > 0) {
    elements.drinkIngredientSearch.setCustomValidity('');
  }
}

function addDrinkIngredient(rawValue) {
  const resolvedName = resolveIngredientName(rawValue || '');
  if (!resolvedName) {
    return;
  }

  const exists = state.drinkFormIngredients.some(
    (item) => item.toLowerCase() === resolvedName.toLowerCase()
  );
  if (exists) {
    elements.drinkIngredientSearch.value = '';
    return;
  }

  state.drinkFormIngredients.push(resolvedName);
  renderSelectedDrinkIngredients();
  updateDrinkFormState();
  elements.drinkIngredientSearch.value = '';
  elements.drinkIngredientSearch.focus();
}

function removeDrinkIngredient(index) {
  if (index < 0 || index >= state.drinkFormIngredients.length) {
    return;
  }
  state.drinkFormIngredients.splice(index, 1);
  renderSelectedDrinkIngredients();
  updateDrinkFormState();
}

function resetDrinkForm() {
  state.drinkFormIngredients = [];
  elements.drinkForm.reset();
  elements.drinkIngredientSearch.value = '';
  renderSelectedDrinkIngredients();
  updateDrinkFormState();
}

function summariseDrink(drink) {
  if (drink.availability) {
    const missingNames = new Set(
      Array.isArray(drink.availability.missing)
        ? drink.availability.missing.map((name) => name.toLowerCase())
        : []
    );
    const missingFromList = drink.ingredients.filter((ingredient) =>
      missingNames.has(ingredient.name.toLowerCase())
    );
    const total = drink.availability.total ?? drink.ingredients.length;
    const available = drink.availability.available ?? drink.ingredients.length - missingFromList.length;
    return {
      total,
      available,
      missing: missingFromList,
      ready: total > 0 && missingFromList.length === 0
    };
  }

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

function renderDrinkCard(drink) {
  const node = elements.drinkTemplate.content.cloneNode(true);
  const listItem = node.querySelector('.drink-card');
  listItem.dataset.drinkId = drink.id;

  const summary = summariseDrink(drink);

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

  return node;
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

  for (const drink of drinksToShow) {
    elements.drinksList.append(renderDrinkCard(drink));
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
  elements.drinkIngredientSearch.setCustomValidity('');
  const name = elements.drinkName.value.trim();
  const instructions = elements.drinkRecipe.value.trim();
  const ingredientsInput = state.drinkFormIngredients.map((value) => value.trim()).filter(Boolean);

  if (!name || !instructions || ingredientsInput.length === 0) {
    if (ingredientsInput.length === 0) {
      elements.drinkIngredientSearch.setCustomValidity('Add at least one ingredient to the drink.');
      elements.drinkIngredientSearch.reportValidity();
    }
    return;
  }

  try {
    await fetchJSON('/api/drinks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, instructions, ingredients: ingredientsInput })
    });
    resetDrinkForm();
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

function handleDrinkIngredientSelection(event) {
  addDrinkIngredient(event.target.value);
}

function handleDrinkIngredientKeydown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    addDrinkIngredient(event.target.value);
  } else if (event.key === 'Backspace' && event.target.value === '') {
    removeDrinkIngredient(state.drinkFormIngredients.length - 1);
  }
}

function handleSelectedIngredientClick(event) {
  const button = event.target.closest('button[data-index]');
  if (!button) return;
  const index = Number.parseInt(button.dataset.index, 10);
  if (Number.isNaN(index)) return;
  removeDrinkIngredient(index);
}

function handleAddIngredientButton() {
  addDrinkIngredient(elements.drinkIngredientSearch.value);
}

function setupEventListeners() {
  elements.ingredientForm.addEventListener('submit', handleIngredientSubmit);
  elements.resetInventory.addEventListener('click', handleResetInventory);
  elements.drinkForm.addEventListener('submit', handleDrinkSubmit);
  document.querySelector('.drinks-filter').addEventListener('click', handleFilterClick);
  elements.drinkIngredientSearch.addEventListener('change', handleDrinkIngredientSelection);
  elements.drinkIngredientSearch.addEventListener('keydown', handleDrinkIngredientKeydown);
  elements.selectedDrinkIngredients.addEventListener('click', handleSelectedIngredientClick);
  elements.addIngredientToDrink.addEventListener('click', handleAddIngredientButton);
}

async function bootstrap() {
  setupEventListeners();
  renderSelectedDrinkIngredients();
  updateDrinkFormState();
  try {
    await Promise.all([loadIngredients(), loadDrinks()]);
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
