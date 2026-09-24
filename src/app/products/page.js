"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getProducts,
  searchProducts,
  getProductsByCategory,
  getCategories,
} from "../../service/ProductService";
import { useDebounce } from "../../hooks/useDebounce";
import { useAuth } from "../../context/AuthContext";

import SearchBar from "../../components/products/SearchBar";
import FilterBox from "../../components/products/FilterBox";
import ProductTable from "../../components/products/ProductTable";
import ProductCard from "../../components/products/ProductCard";
import Pagination from "../../components/products/Pagination";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorRetry from "../../components/ui/ErrorRetry";
import { deleteProduct } from "../../service/ProductService";
import DeleteConfirmModal from "../../components/products/DeleteConfirmModal";
import Link from "next/link";
import { getAddedProducts } from "../../lib/providerService";
import { Suspense } from "react";

const PAGE_SIZE_OPTIONS = [10, 20, 50];
function ProductsPageContent() {
  // ...ALL of your existing code stays exactly the same here
  // (every hook, every handler, the entire return JSX)
  // export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { logout } = useAuth();
  
    const rawPage = parseInt(searchParams.get("page"), 10);
    const rawLimit = parseInt(searchParams.get("limit"), 10);
  
    const limit = PAGE_SIZE_OPTIONS.includes(rawLimit) ? rawLimit : 10;
    const searchQuery = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const sortBy = searchParams.get("sortBy") || "";
    const order = searchParams.get("order") || "asc";
  
    const [searchInput, setSearchInput] = useState(searchQuery);
    const debouncedSearch = useDebounce(searchInput, 500);
  
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
  
    const requestIdRef = useRef(0);
  
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const page =
      Number.isInteger(rawPage) && rawPage > 0
        ? Math.min(rawPage, totalPages)
        : 1;
  
    function updateParams(updates) {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || value === undefined || value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.push(`/products?${params.toString()}`);
    }
  
    useEffect(() => {
      getCategories()
        .then(setCategories)
        .catch(() => setCategories([]));
    }, []);
  
    useEffect(() => {
      if (debouncedSearch !== searchQuery) {
        updateParams({
          q: debouncedSearch,
          page: 1,
          category: debouncedSearch ? "" : category,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);
  
    const fetchProducts = useCallback(async () => {
      const currentRequestId = ++requestIdRef.current;
      setLoading(true);
      setError("");
  
      const skip = (page - 1) * limit;
  
      try {
        let data;
        if (searchQuery) {
          data = await searchProducts({ q: searchQuery, limit, skip });
        } else if (category) {
          data = await getProductsByCategory({
            category,
            limit,
            skip,
            sortBy,
            order,
          });
        } else {
          data = await getProducts({ limit, skip, sortBy, order });
        }
  
        if (currentRequestId !== requestIdRef.current) return;
  
        let finalProducts = data.products;
        let finalTotal = data.total;
  
        if (page === 1 && !searchQuery && !category) {
          const added = getAddedProducts();
          finalProducts = [...added, ...data.products].slice(0, limit);
          finalTotal = data.total + added.length;
        }
  
        setProducts(finalProducts);
        setTotal(finalTotal);
      } catch (err) {
        if (currentRequestId !== requestIdRef.current) return;
        setError(err.message || "Failed to load products");
      } finally {
        if (currentRequestId === requestIdRef.current) setLoading(false);
      }
    }, [page, limit, searchQuery, category, sortBy, order]);
  
    useEffect(() => {
      fetchProducts();
    }, [fetchProducts]);
  
    function handleCategoryChange(value) {
      updateParams({ category: value, page: 1, q: value ? "" : searchQuery });
      if (value) setSearchInput("");
    }
    function handleDeleteClick(product) {
      setDeleteTarget(product);
    }
  
    async function handleConfirmDelete() {
      if (!deleteTarget) return;
      setDeleting(true);
      try {
        await deleteProduct(deleteTarget.id);
        // API doesn't actually persist the delete, so we remove it from
        // local state ourselves to simulate the change for this session.
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setTotal((prev) => prev - 1);
        setDeleteTarget(null);
      } catch (err) {
        setError(err.message || "Failed to delete product");
      } finally {
        setDeleting(false);
      }
    }
    function handleLogout() {
    logout();
    router.push("/login");
    }
    const showingFrom = total === 0 ? 0 : (page - 1) * limit + 1;
    const showingTo = Math.min(page * limit, total);
    const goToProduct = (id) => router.push(`/products/${id}`);
  
    return (
      <div className="mx-auto max-w-6xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Products</h1>
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Products</h1>
            <div className="flex items-center gap-2">
              <Link
                href="/products/new"
                className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
              >
                Add Product
              </Link>
              <button
                onClick={handleLogout}
                className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
  
        <div className="mb-4 flex flex-wrap gap-3">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            disabled={!!category}
          />
          <FilterBox
            categories={categories}
            category={category}
            onCategoryChange={handleCategoryChange}
            categoryDisabled={!!searchQuery}
            sortBy={sortBy}
            onSortChange={(value) => updateParams({ sortBy: value, page: 1 })}
            order={order}
            onOrderToggle={() =>
              updateParams({ order: order === "asc" ? "desc" : "asc", page: 1 })
            }
          />
        </div>
  
        {loading && <Loader />}
        {!loading && error && (
          <ErrorRetry message={error} onRetry={fetchProducts} />
        )}
        {!loading && !error && products.length === 0 && <EmptyState />}
  
        {!loading && !error && products.length > 0 && (
          <>
            <ProductTable
              products={products}
              onRowClick={goToProduct}
              onDeleteClick={handleDeleteClick}
            />
            <ProductCard
              products={products}
              onCardClick={goToProduct}
              onDeleteClick={handleDeleteClick}
            />
            <Pagination
              page={page}
              totalPages={totalPages}
              limit={limit}
              onLimitChange={(value) => updateParams({ limit: value, page: 1 })}
              onPageChange={(newPage) => updateParams({ page: newPage })}
              showingFrom={showingFrom}
              showingTo={showingTo}
              total={total}
            />
            <DeleteConfirmModal
              product={deleteTarget}
              deleting={deleting}
              onCancel={() => setDeleteTarget(null)}
              onConfirm={handleConfirmDelete}
            />
          </>
        )}
      </div>
    );
  // }
}
// New default export — this is the only genuinely new part
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-gray-500">Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
