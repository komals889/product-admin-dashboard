"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, updateProduct, getCategories } from "../../../../service/ProductService";
import ProductForm from "../../../../components/products/ProductForm";
import Loader from "../../../../components/ui/Loader";
import ErrorRetry from "../../../../components/ui/ErrorRetry";
import { setOverride,getOverride } from "../../../../lib/providerService";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [productData, categoriesData] = await Promise.all([
        getProductById(id),
        getCategories(),
      ]);
      setProduct(productData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(formData) {
  setSubmitting(true);
  setError("");
  try {
    await updateProduct(id, formData);
    // API doesn't persist this — save it locally so the details page
    // can show the edited values instead of the stale API response.
    setOverride(id, { ...product, ...formData });
    router.push(`/products/${id}`);
  } catch (err) {
    setError(err.message || "Failed to update product");
  } finally {
    setSubmitting(false);
  }
}
async function loadData() {
  setLoading(true);
  setError("");
  try {
    const [productData, categoriesData] = await Promise.all([
      getProductById(id),
      getCategories(),
    ]);
    const override = getOverride(id);
    setProduct(override ? { ...productData, ...override } : productData);
    setCategories(categoriesData);
  } catch (err) {
    setError(err.message || "Failed to load product");
  } finally {
    setLoading(false);
  }
}

  if (loading) return <Loader />;
  if (error) return <ErrorRetry message={error} onRetry={loadData} />;

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-4 text-xl font-semibold">Edit Product</h1>
      <ProductForm
        initialData={product}
        categories={categories}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}