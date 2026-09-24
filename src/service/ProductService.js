import api from "../lib/axios";

export async function getProducts({ limit, skip, sortBy, order }) {
  const { data } = await api.get("/products", {
    params: { limit, skip, sortBy, order },
  });
  return data; // { products, total, skip, limit }
}

export async function searchProducts({ q, limit, skip }) {
  const { data } = await api.get("/products/search", {
    params: { q, limit, skip },
  });
  return data;
}

export async function getProductsByCategory({ category, limit, skip, sortBy, order }) {
  const { data } = await api.get(`/products/category/${category}`, {
    params: { limit, skip, sortBy, order },
  });
  return data;
}

export async function getCategories() {
  const { data } = await api.get("/products/categories");
  return data; // [{ slug, name, url }, ...]
}
export async function getProductById(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}
export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
export async function updateProduct(id, productData) {
  const { data } = await api.put(`/products/${id}`, productData);
  return data;
}
export async function addProduct(productData) {
  const { data } = await api.post("/products/add", productData);
  return data;
}