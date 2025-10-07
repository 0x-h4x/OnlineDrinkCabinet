let initialized = false;
let frameId = null;
let fridgeCard = null;
let drinksCard = null;
let drinksScrollArea = null;
let layoutMediaQuery = null;
let resizeObserver = null;
let mediaChangeHandler = null;

function clearComputedHeights() {
  if (drinksCard) {
    drinksCard.style.removeProperty('height');
  }

  if (drinksScrollArea) {
    drinksScrollArea.style.removeProperty('max-height');
  }
}

function getCardMetrics() {
  if (!drinksCard || !drinksScrollArea) {
    return null;
  }

  const cardRect = drinksCard.getBoundingClientRect();
  const scrollRect = drinksScrollArea.getBoundingClientRect();
  const style = window.getComputedStyle(drinksCard);

  const paddingBottom = Number.parseFloat(style.paddingBottom) || 0;
  const paddingTop = Number.parseFloat(style.paddingTop) || 0;
  const offsetWithinCard = Math.max(0, scrollRect.top - cardRect.top - paddingTop);

  return {
    offsetWithinCard,
    paddingBottom
  };
}

function applyScrollAreaHeight() {
  frameId = null;

  if (!initialized || !fridgeCard || !drinksScrollArea) {
    return;
  }

  clearComputedHeights();

  if (layoutMediaQuery && !layoutMediaQuery.matches) {
    return;
  }

  const fridgeHeight = fridgeCard.getBoundingClientRect().height;

  if (!Number.isFinite(fridgeHeight) || fridgeHeight <= 0) {
    return;
  }

  const metrics = getCardMetrics();

  if (!metrics) {
    return;
  }

  const availableHeight = fridgeHeight - metrics.offsetWithinCard - metrics.paddingBottom;

  if (!Number.isFinite(availableHeight)) {
    return;
  }

  const clampedAvailable = Math.max(0, Math.floor(availableHeight));
  const clampedCardHeight = Math.max(0, Math.floor(fridgeHeight));

  drinksCard.style.height = `${clampedCardHeight}px`;
  drinksScrollArea.style.maxHeight = `${clampedAvailable}px`;
}

function observeLayoutChanges() {
  if (typeof ResizeObserver === 'function') {
    resizeObserver = new ResizeObserver(() => scheduleDrinksPanelHeightUpdate());
    resizeObserver.observe(fridgeCard);
    resizeObserver.observe(drinksCard);
  }

  if (layoutMediaQuery) {
    mediaChangeHandler = () => scheduleDrinksPanelHeightUpdate();
    if (typeof layoutMediaQuery.addEventListener === 'function') {
      layoutMediaQuery.addEventListener('change', mediaChangeHandler);
    } else if (typeof layoutMediaQuery.addListener === 'function') {
      layoutMediaQuery.addListener(mediaChangeHandler);
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
