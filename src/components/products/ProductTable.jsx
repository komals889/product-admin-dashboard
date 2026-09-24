import Image from "next/image";

export default function ProductTable({ products, onRowClick, onDeleteClick }) {
  return (
    <table className="hidden w-full text-sm md:table">
      <thead>
        <tr className="border-b text-left">
          <th className="py-2">Image</th>
          <th className="py-2">Title</th>
          <th className="py-2">Category</th>
          <th className="py-2">Price</th>
          <th className="py-2">Rating</th>
          <th className="py-2">Stock</th>
          <th className="py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products?.map((p) => (
          <tr key={p?.id} className="border-b hover:bg-gray-50">
            <td className="cursor-pointer py-2" onClick={() => onRowClick(p.id)}>
              {
                p?.thumbnail &&
              <Image src={p?.thumbnail?p?.thumbnail:null} alt={p?.title} width={40} height={40} className="rounded" />
              }
            </td>
            <td className="cursor-pointer py-2" onClick={() => onRowClick(p?.id)}>{p?.title}</td>
            <td className="py-2">{p?.category}</td>
            <td className="py-2">${p?.price}</td>
            <td className="py-2">{p?.rating}</td>
            <td className="py-2">{p?.stock}</td>
            <td className="py-2">
              <button
                onClick={(e) => {
                  e?.stopPropagation();
                  onDeleteClick(p);
                }}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}