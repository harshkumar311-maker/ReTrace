import { Link } from "react-router-dom";
import { formatDate, titleCase } from "../utils/format";

const CATEGORY_ICON = {
  electronics: "📱",
  wallet: "👛",
  bags: "🎒",
  documents: "📄",
  keys: "🔑",
  jewelry: "💍",
  clothing: "👕",
  books: "📚",
  gaming: "🎮",
  other: "🧸",
};

export default function ItemCard({ item }) {
  const reportType = String(item?.reportType || "").toLowerCase();

  const isLost = reportType === "lost";
  const isFound = reportType === "found";

  return (
    <Link
      to={`/item/${item.id}`}
      className="card flex flex-col gap-3 p-5 transition-colors hover:border-indigo-400"
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl">
          {CATEGORY_ICON[
            String(item?.category || "").toLowerCase()
          ] || "🧸"}
        </span>

        {isLost && (
          <span className="rounded-sm bg-signal-rose/10 px-2 py-0.5 text-xs font-medium text-signal-rose">
            Lost
          </span>
        )}

        {isFound && (
          <span className="rounded-sm bg-signal-teal/10 px-2 py-0.5 text-xs font-medium text-signal-teal">
            Found
          </span>
        )}
      </div>

      <div>
        <p className="font-display text-base font-semibold text-ink-900">
          {item?.title || item?.model || "Unnamed item"}
        </p>

        <p className="text-xs text-ink-300">
          {titleCase(item?.category)} →{" "}
          {titleCase(item?.subcategory)}
        </p>
      </div>

      <div className="space-y-1 text-sm text-ink-500">
        <p>📍 {item?.location || "—"}</p>

        <p>
          📅 {formatDate(item?.date || item?.createdAt)}
        </p>
      </div>
    </Link>
  );
}