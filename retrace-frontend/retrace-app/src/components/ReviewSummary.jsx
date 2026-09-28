import { formatDate, formatTime, titleCase } from "../utils/format";
import { getSubcategory } from "../data/categories";

export default function ReviewSummary({
  reportType,
  category,
  subcategoryId,
  values,
  photos,
}) {
  const subcategory = category
    ? getSubcategory(category.id, subcategoryId)
    : null;

  const rows = [
    {
      label: "Report type",
      value:
        reportType === "lost"
          ? "Lost item"
          : reportType === "found"
          ? "Found item"
          : "—",
    },

    {
      label: "Category",
      value: category
        ? `${category.label} → ${subcategory?.label || "—"}`
        : "—",
    },

    ...(subcategory?.fields || [])
      .filter(
        (f) =>
          ![
            "description",
            "location",
            "landmark",
            "date",
            "time",
          ].includes(f.name)
      )
      .filter((f) => values?.[f.name])
      .map((f) => ({
        label: f.label,
        value:
          f.type === "private-text"
            ? "•••• (private)"
            : String(values[f.name]),
      })),

    {
      label: "Location",
      value: values?.location || "—",
    },

    ...(values?.landmark
      ? [
          {
            label: "Nearby landmark",
            value: values.landmark,
          },
        ]
      : []),

    {
      label: "Date",
      value: values?.date ? formatDate(values.date) : "—",
    },

    {
      label: "Time",
      value: values?.time ? formatTime(values.time) : "—",
    },

    {
      label: "Description",
      value: values?.description || "—",
    },

    {
      label: "Photos",
      value: `${photos?.length || 0} uploaded`,
    },
  ];

  return (
    <div className="card divide-y divide-ink-100">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
        >
          <span className="text-sm text-ink-300">
            {titleCase(row.label)}
          </span>

          <span className="text-sm font-medium text-ink-900 sm:text-right">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}