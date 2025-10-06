const state = {
  ingredients: [],
  drinks: [],
  filter: 'all',
  searchTerm: '',
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
  drinkSearch: document.getElementById('drink-search'),
  drinksList: document.getElementById('drinks-list'),
  filterButtons: document.querySelectorAll('.drinks-filter .chip'),
  filterGroup: document.querySelector('.drinks-filter'),
  drinkTemplate: document.getElementById('drink-template'),
  openDrinkDialog: document.getElementById('open-add-drink'),
  cancelDrinkDialog: document.getElementById('cancel-add-drink'),
  closeDrinkDialog: document.getElementById('close-add-drink'),
  drinkDialog: document.getElementById('add-drink-dialog')
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
  state.ingredients = data.map((item) => ({
    ...item,
    inStock: !!item.inStock
  }));
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
  if (!elements.ingredientCatalog || !elements.drinkIngredientCatalog) return;

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
  item.setAttribute('aria-pressed', ingredient.inStock ? 'true' : 'false');
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
  if (!elements.inventoryCount || !elements.ingredientList) return;

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
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Add items to your fridge to start tracking availability.';
    elements.ingredientList.append(empty);
    return;
  }

  const sorted = [...state.ingredients].sort((a, b) => a.name.localeCompare(b.name));
  const groups = new Map();

  for (const ingredient of sorted) {
    const label = ingredient.category?.trim() || 'Other';
    if (!groups.has(label)) {
      groups.set(label, []);
    }
    groups.get(label).push(ingredient);
  }

  const groupNames = Array.from(groups.keys()).sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b);
  });

  const fragment = document.createDocumentFragment();
  for (const name of groupNames) {
    const groupContainer = document.createElement('div');
    groupContainer.className = 'ingredient-group';

    const title = document.createElement('h3');
    title.className = 'ingredient-group-title';
    title.textContent = name;
    groupContainer.append(title);

    const list = document.createElement('ul');
    list.className = 'pill-list ingredient-group-list';
    for (const ingredient of groups.get(name)) {
      list.append(renderIngredientPill(ingredient));
    }

    groupContainer.append(list);
    fragment.append(groupContainer);
  }

  elements.ingredientList.append(fragment);
}

function normaliseIngredientInput(name) {
  return name.trim().replace(/\s+/g, ' ');
}

function resolveIngredientName(value) {
  const cleanValue = normaliseIngredientInput(value || '');
  if (!cleanValue) return '';
  const existing = state.ingredients.find((item) => item.name.toLowerCase() === cleanValue.toLowerCase());
  return existing ? existing.name : cleanValue;
}

function renderSelectedDrinkIngredients() {
  const list = elements.selectedDrinkIngredients;
  if (!list) return;

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
  if (elements.drinkIngredients) {
    elements.drinkIngredients.value = state.drinkFormIngredients.join(', ');
  }
  if (elements.drinkIngredientSearch && state.drinkFormIngredients.length > 0) {
    elements.drinkIngredientSearch.setCustomValidity('');
  }
}

function addDrinkIngredient(rawValue) {
  const resolvedName = resolveIngredientName(rawValue || '');
  if (!resolvedName) {
    if (elements.drinkIngredientSearch) {
      elements.drinkIngredientSearch.value = '';
    }
    return;
  }

  const exists = state.drinkFormIngredients.some(
    (item) => item.toLowerCase() === resolvedName.toLowerCase()
  );
  if (exists) {
    if (elements.drinkIngredientSearch) {
      elements.drinkIngredientSearch.value = '';
    }
    return;
  }

  state.drinkFormIngredients.push(resolvedName);
  renderSelectedDrinkIngredients();
  updateDrinkFormState();
  if (elements.drinkIngredientSearch) {
    elements.drinkIngredientSearch.value = '';
    elements.drinkIngredientSearch.focus();
  }
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
  if (elements.drinkForm) {
    elements.drinkForm.reset();
  }
  if (elements.drinkIngredientSearch) {
    elements.drinkIngredientSearch.value = '';
    elements.drinkIngredientSearch.setCustomValidity('');
  }
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
  const query = state.searchTerm.trim().toLowerCase();
  if (query) {
    const searchableText = [
      drink.name,
      drink.instructions,
      ...drink.ingredients.map((ingredient) => ingredient.name)
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    if (!searchableText.includes(query)) {
      return false;
    }
  }

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
  const template = elements.drinkTemplate;
  if (!template) return document.createDocumentFragment();

  const node = template.content.cloneNode(true);
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
    ingredientItem.classList.add(ingredient.inStock ? 'ingredient-ready' : 'ingredient-missing');
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
  if (!elements.drinksList) return;

  elements.drinksList.innerHTML = '';
  if (state.drinks.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'No drinks saved yet. Use the Add drink button to get started.';
    elements.drinksList.append(empty);
    return;
  }

  const drinksToShow = state.drinks.filter(shouldDisplayDrink);
  if (drinksToShow.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    const trimmedSearch = state.searchTerm.trim();
    if (trimmedSearch) {
      empty.textContent = `No drinks match "${trimmedSearch}". Try a different name or ingredient.`;
    } else if (state.filter === 'ready') {
      empty.textContent = 'Nothing is fully stocked yet. Add more ingredients to unlock drinks.';
    } else if (state.filter === 'missing') {
      empty.textContent = 'Everything here is ready to shake. Switch filters to explore more.';
    } else {
      empty.textContent = 'No drinks to display.';
    }
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
  const name = elements.ingredientName?.value.trim();
  const category = elements.ingredientCategory?.value.trim();
  if (!name) return;

  try {
    await fetchJSON('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category: category || null, inStock: true })
    });
    if (elements.ingredientForm) {
      elements.ingredientForm.reset();
    }
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
  if (elements.drinkIngredientSearch) {
    elements.drinkIngredientSearch.setCustomValidity('');
  }

  const name = elements.drinkName?.value.trim();
  const instructions = elements.drinkRecipe?.value.trim();
  const ingredientsInput = state.drinkFormIngredients.map((value) => value.trim()).filter(Boolean);

  if (!name || !instructions || ingredientsInput.length === 0) {
    if (ingredientsInput.length === 0 && elements.drinkIngredientSearch) {
      elements.drinkIngredientSearch.setCustomValidity('Add at least one ingredient to the drink.');
      elements.drinkIngredientSearch.reportValidity();
    } else if (elements.drinkForm) {
      elements.drinkForm.reportValidity();
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
    closeAddDrinkModal({ reset: false });
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

function handleDrinkSearchInput(event) {
  state.searchTerm = event.target.value;
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
  if (elements.drinkIngredientSearch) {
    addDrinkIngredient(elements.drinkIngredientSearch.value);
  }
}

function openAddDrinkModal() {
  const dialog = elements.drinkDialog;
  if (!dialog) return;

  if (typeof dialog.showModal === 'function') {
    if (!dialog.open) {
      dialog.showModal();
    }
  } else {
    dialog.setAttribute('open', '');
    dialog.classList.add('modal-fallback-open');
    document.body?.classList.add('modal-open-fallback');
  }

  elements.openDrinkDialog?.setAttribute('aria-expanded', 'true');
  document.body?.classList.add('modal-open');

  window.requestAnimationFrame(() => {
    elements.drinkName?.focus();
  });
}

function closeAddDrinkModal({ reset = true, restoreFocus = true } = {}) {
  const dialog = elements.drinkDialog;
  if (!dialog) return;

  dialog.classList.remove('modal-fallback-open');

  if (typeof dialog.close === 'function') {
    if (dialog.open) {
      dialog.close();
    }
  } else if (dialog.hasAttribute('open')) {
    dialog.removeAttribute('open');
  }

  if (reset) {
    resetDrinkForm();
  }

  if (restoreFocus) {
    elements.openDrinkDialog?.focus();
  }

  elements.openDrinkDialog?.setAttribute('aria-expanded', 'false');
  document.body?.classList.remove('modal-open');
  document.body?.classList.remove('modal-open-fallback');
}

function handleOpenDrinkDialog() {
  openAddDrinkModal();
}

function handleCloseDrinkDialog() {
  closeAddDrinkModal();
}

function handleDrinkDialogCancel(event) {
  event.preventDefault();
  closeAddDrinkModal();
}

function setupEventListeners() {
  elements.ingredientForm?.addEventListener('submit', handleIngredientSubmit);
  elements.resetInventory?.addEventListener('click', handleResetInventory);
  elements.drinkForm?.addEventListener('submit', handleDrinkSubmit);
  elements.filterGroup?.addEventListener('click', handleFilterClick);
  elements.drinkSearch?.addEventListener('input', handleDrinkSearchInput);
  elements.drinkIngredientSearch?.addEventListener('change', handleDrinkIngredientSelection);
  elements.drinkIngredientSearch?.addEventListener('keydown', handleDrinkIngredientKeydown);
  elements.selectedDrinkIngredients?.addEventListener('click', handleSelectedIngredientClick);
  elements.addIngredientToDrink?.addEventListener('click', handleAddIngredientButton);
  elements.openDrinkDialog?.addEventListener('click', handleOpenDrinkDialog);
  elements.cancelDrinkDialog?.addEventListener('click', handleCloseDrinkDialog);
  elements.closeDrinkDialog?.addEventListener('click', handleCloseDrinkDialog);
  elements.drinkDialog?.addEventListener('cancel', handleDrinkDialogCancel);
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
