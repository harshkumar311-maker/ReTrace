import { formatDate, formatTime, titleCase } from "../utils/format";

function ItemPanel({ heading, item }) {
  const itemName =
    item?.title ||
    item?.model ||
    "Unnamed item";

  const category = item?.category
    ? titleCase(item.category)
    : "";

  const subcategory = item?.subcategory
    ? titleCase(item.subcategory)
    : "";

  const hasDate = Boolean(item?.date);
  const hasTime = Boolean(item?.time);

  return (
    <div className="card p-5">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-300">
        {heading}
      </p>

      <p className="font-display text-lg font-semibold text-ink-900">
        {itemName}
      </p>

      {(category || subcategory) && (
        <p className="mt-1 text-sm text-ink-400">
          {category}
          {category && subcategory ? " → " : ""}
          {subcategory}
        </p>
      )}

      <div className="mt-3 space-y-1.5 text-sm text-ink-500">
        <p>
          📍 {item?.location || "Location not specified"}
        </p>

        {(hasDate || hasTime) && (
          <p>
            🕐{" "}
            {hasDate ? formatDate(item.date) : "Date not specified"}
            {hasTime ? ` · ${formatTime(item.time)}` : ""}
          </p>
        )}

        {item?.color && (
          <p>🎨 {item.color}</p>
        )}

        {item?.brand && (
          <p>🏷️ {item.brand}</p>
        )}
      </div>

      {item?.description && (
        <p className="mt-3 text-sm text-ink-500">
          {item.description}
        </p>
      )}
    </div>
  );
}

export default function MatchComparison({
  lostItem,
  foundItem,
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ItemPanel
        heading="Your lost item"
        item={lostItem}
      />

      <ItemPanel
        heading="Possible found item"
        item={foundItem}
      />
    </div>
  );
}