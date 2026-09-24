const STORAGE_KEY = "productOverrides";
const ADDED_KEY = "addedProducts";

function getAllOverrides() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function getOverride(id) {
  const overrides = getAllOverrides();
  return overrides[id] || null;
}

export function setOverride(id, data) {
  const overrides = getAllOverrides();
  overrides[id] = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function getAddedProducts() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ADDED_KEY)) || [];
  } catch {
    return [];
  }
}

export function addLocalProduct(product) {
  const existing = getAddedProducts();
  // give it a fake id that won't collide with DummyJSON's real ids (which go up to ~194)
  const newProduct = { ...product, id: Date.now(), thumbnail: product.thumbnail || "" };
  const updated = [newProduct, ...existing];
  localStorage.setItem(ADDED_KEY, JSON.stringify(updated));
  return newProduct;
}