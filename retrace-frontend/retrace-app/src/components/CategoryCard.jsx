export default function CategoryCard({
  category,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`card flex flex-col items-center gap-2.5 px-4 py-6 text-center transition-all hover:-translate-y-0.5 hover:border-indigo-400 ${
        selected
          ? "border-indigo-500 ring-1 ring-indigo-500"
          : ""
      }`}
    >
      <span className="text-3xl">
        {category?.icon}
      </span>

      <span className="text-sm font-medium text-ink-700">
        {category?.label}
      </span>
    </button>
  );
}