"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getProductById } from "../../../service/ProductService";
import Loader from "../../../components/ui/Loader";
import ErrorRetry from "../../../components/ui/ErrorRetry";
import { getOverride } from "../../../lib/providerService";


export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchProduct() {
  setLoading(true);
  setError("");
  setNotFound(false);

  try {
    const data = await getProductById(id);

    if (data?.message) {
      setNotFound(true);
    } else {
      const override = getOverride(id);
      setProduct(override ? { ...data, ...override } : data);
      setActiveImage(0);
    }
  } catch (err) {
    setError(err.message || "Failed to load product");
  } finally {
    setLoading(false);
  }
}

  if (loading) return <Loader />;
  if (error) return <ErrorRetry message={error} onRetry={fetchProduct} />;

  if (notFound) {
    return (
      <div className="mx-auto max-w-xl p-6 text-center">
        <h1 className="mb-2 text-xl font-semibold">Product not found</h1>
        <p className="mb-4 text-sm text-gray-500">
          No product exists with id &quot;{id}&quot;.
        </p>
        <button
          onClick={() => router.push("/products")}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
        >
          Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <button
        onClick={() => router.push("/products")}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back to products
      </button>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Images */}
        <div>
          <div className="mb-3 aspect-square overflow-hidden rounded border">
            <Image
              src={product.images?.[activeImage] || product.thumbnail}
              alt={product.title}
              width={500}
              height={500}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product?.images?.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 ${
                    i === activeImage ? "border-blue-600" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" width={64} height={64} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="mb-1 text-2xl font-semibold">{product.title}</h1>
          <p className="mb-3 text-sm text-gray-500">{product.category}</p>
          <p className="mb-3 text-2xl font-bold">${product.price}</p>
          <p className="mb-4 text-sm text-gray-700">{product.description}</p>

          <div className="mb-4 flex gap-4 text-sm text-gray-600">
            <span>⭐ {product.rating}</span>
            <span>Stock: {product.stock}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/products/${id}/edit`)}
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
          <div className="space-y-3">
            {product.reviews.map((review, i) => (
              <div key={i} className="rounded border p-3 text-sm">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium">{review.reviewerName}</span>
                  <span>⭐ {review.rating}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}