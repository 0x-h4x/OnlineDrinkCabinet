let initialized = false;
let frameId = null;
let fridgeCard = null;
let drinksCard = null;
let drinksScrollArea = null;
let layoutMediaQuery = null;

function calculateNonScrollableHeight() {
  if (!drinksCard || !drinksScrollArea) {
    return 0;
  }

  const cardRect = drinksCard.getBoundingClientRect();
  const scrollRect = drinksScrollArea.getBoundingClientRect();
  return cardRect.height - scrollRect.height;
}

function applyScrollAreaHeight() {
  frameId = null;

  if (!initialized || !fridgeCard || !drinksScrollArea) {
    return;
  }

  drinksScrollArea.style.removeProperty('max-height');

  if (layoutMediaQuery && !layoutMediaQuery.matches) {
    return;
  }

  const fridgeHeight = fridgeCard.getBoundingClientRect().height;
  const nonScrollableHeight = calculateNonScrollableHeight();
  const availableHeight = fridgeHeight - nonScrollableHeight;

  if (Number.isFinite(availableHeight) && availableHeight > 0) {
    drinksScrollArea.style.maxHeight = `${Math.floor(availableHeight)}px`;
  }
}

function observeLayoutChanges() {
  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(() => scheduleDrinksPanelHeightUpdate());
    observer.observe(fridgeCard);
    observer.observe(drinksCard);
  }

  if (layoutMediaQuery) {
    const listener = () => scheduleDrinksPanelHeightUpdate();
    if (typeof layoutMediaQuery.addEventListener === 'function') {
      layoutMediaQuery.addEventListener('change', listener);
    } else if (typeof layoutMediaQuery.addListener === 'function') {
      layoutMediaQuery.addListener(listener);
    }
  }

  window.addEventListener('resize', scheduleDrinksPanelHeightUpdate, { passive: true });
}

export function initializeLayoutSync() {
  if (initialized) {
    return;
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  drinksCard = document.querySelector('.drinks-card');
  fridgeCard = document.querySelector('.fridge-card');

  if (!drinksCard || !fridgeCard) {
    return;
  }

  drinksScrollArea = drinksCard.querySelector('.drinks-scroll-area');
  if (!drinksScrollArea) {
    return;
  }

  layoutMediaQuery = typeof window.matchMedia === 'function' ? window.matchMedia('(min-width: 900px)') : null;

  initialized = true;
  observeLayoutChanges();
  scheduleDrinksPanelHeightUpdate();
}

export function scheduleDrinksPanelHeightUpdate() {
  if (!initialized) {
    return;
  }

  if (frameId !== null) {
    return;
  }

  if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
    applyScrollAreaHeight();
    return;
  }

  frameId = window.requestAnimationFrame(applyScrollAreaHeight);
}
