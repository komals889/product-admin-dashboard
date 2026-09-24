import Image from "next/image";

export default function ProductCard({ products, onCardClick, onDeleteClick }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:hidden">
      {products.map((p) => (
        <div key={p.id} className="flex gap-3 rounded border p-3">
          <div onClick={() => onCardClick(p.id)} className="flex flex-1 cursor-pointer gap-3">
            {
              p?.thumbnail &&
            <Image src={p?.thumbnail?p?.thumbnail:null} alt={p?.title} width={60} height={60} className="rounded" />
            }
            <div className="flex-1 text-sm">
              <p className="font-medium">{p?.title}</p>
              <p className="text-gray-500">{p?.category}</p>
              <p>${p?.price} · ⭐ {p?.rating} · Stock: {p?.stock}</p>
            </div>
          </div>
          <button
            onClick={() => onDeleteClick(p)}
            className="self-start text-sm text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}