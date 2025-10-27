export default function PropertyActions({ onSubmit }) {
  return (
    <div className="mt-6 flex justify-end gap-4">
      <button
        type="button"
        onClick={onSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Property
      </button>
    </div>
  );
}