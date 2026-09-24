export default function SearchBar({ value, onChange, disabled }) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      title={disabled ? "Clear category filter to search" : ""}
      className="flex-1 min-w-[180px] rounded border px-3 py-2 text-sm disabled:bg-gray-100"
    />
  );
}