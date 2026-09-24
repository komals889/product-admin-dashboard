// components/EmptyState.js
export default function EmptyState({ message = "No products found." }) {
  return <p className="py-10 text-center text-sm text-gray-500">{message}</p>;
}