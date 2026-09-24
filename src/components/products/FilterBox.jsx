export default function FilterBox({
  categories,
  category,
  onCategoryChange,
  categoryDisabled,
  sortBy,
  onSortChange,
  order,
  onOrderToggle,
}) {
  return (
    <>
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        disabled={categoryDisabled}
        title={categoryDisabled ? "Clear search to filter by category" : ""}
        className="rounded border px-3 py-2 text-sm disabled:bg-gray-100"
      >
        <option value="">All categories</option>
        {categories?.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded border px-3 py-2 text-sm"
      >
        <option value="">Sort by</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
        <option value="title">Title</option>
      </select>

      <button
        onClick={onOrderToggle}
        disabled={!sortBy}
        className="rounded border px-3 py-2 text-sm disabled:opacity-50"
      >
        {order === "asc" ? "Asc ↑" : "Desc ↓"}
      </button>
    </>
  );
}