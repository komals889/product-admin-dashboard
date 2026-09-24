"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addProduct, getCategories } from "../../../service/ProductService";
import ProductForm from "../../../components/products/ProductForm";
import { addLocalProduct } from "../../../lib/providerService";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  async function handleSubmit(formData) {
    setSubmitting(true);
    setError("");
    try {
      await addProduct(formData); // API call — doesn't persist, but shows the request happening
      addLocalProduct(formData); // store locally so it appears in your list
      router.push("/products");
    } catch (err) {
      setError(err.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-4 text-xl font-semibold">Add Product</h1>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <ProductForm
        categories={categories}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}
