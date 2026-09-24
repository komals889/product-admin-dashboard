// components/ErrorRetry.js
export default function ErrorRetry({ message, onRetry }) {
  return (
    <div className="py-10 text-center">
      <p className="mb-2 text-sm text-red-600">{message}</p>
      <button onClick={onRetry} className="rounded bg-blue-600 px-4 py-2 text-sm text-white">
        Retry
      </button>
    </div>
  );
}