"use client";

import { useState } from "react";

const CATEGORIES_FALLBACK = []; // passed in as a prop from the page

export default function ProductForm({ initialData, categories, onSubmit, submitting }) {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    price: initialData?.price ?? "",
    stock: initialData?.stock ?? "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // clear that field's error as soon as the user edits it
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.category) newErrors.category = "Category is required";

    if (form.price === "" || Number(form.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    if (form.stock === "" || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) {
      newErrors.stock = "Stock must be a whole number, 0 or more";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return; // guard against double-submit on fast clicks
    if (!validate()) return;

    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          className="w-full rounded border px-3 py-2 text-sm"
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        <select
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        >
          <option value="">Select a category</option>
          {(categories || CATEGORIES_FALLBACK).map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Stock</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-blue-600 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
}