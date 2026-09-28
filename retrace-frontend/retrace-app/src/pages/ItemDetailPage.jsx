import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchItem } from "../services/itemService";
import { fetchMatchesForItem } from "../services/matchService";
import { formatDate, formatTime, titleCase } from "../utils/format";

const API_BASE_URL = "http://localhost:8080/api/images/items";

export default function ItemDetailPage() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadItem() {
      try {
        setError("");

        const data = await fetchItem(id);
        setItem(data);

        if (data?.reportType?.toLowerCase() === "lost") {
          try {
            const matchData = await fetchMatchesForItem(id);
            setMatches(matchData || []);
          } catch (matchError) {
            console.error("Failed to load matches:", matchError);
            setMatches([]);
          }
        } else {
          setMatches([]);
        }
      } catch (err) {
        console.error("Failed to load item:", err);
        setError("Unable to load this item.");
      }
    }

    loadItem();
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          to="/browse"
          className="text-sm font-medium text-ink-500 hover:text-ink-900"
        >
          ← Back
        </Link>

        <div className="card mt-6 p-6">
          <p className="text-sm text-signal-rose">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 text-ink-300">
        Loading…
      </div>
    );
  }

  const reportType = item.reportType?.toLowerCase();

  const title =
    item.title ||
    item.model ||
    item.itemName ||
    item.name ||
    "Untitled item";

  const category = item.category
    ? titleCase(item.category)
    : "Unknown category";

  const subcategory = item.subcategory
    ? titleCase(item.subcategory)
    : "Unknown type";

  const status = item.status?.toLowerCase();

  const statusLabel =
    status === "recovered"
      ? "Recovered"
      : status === "matched"
        ? "Matched"
        : reportType === "lost"
          ? "Lost"
          : "Found";

  const statusClass =
    status === "recovered"
      ? "bg-emerald-50 text-emerald-700"
      : reportType === "lost"
        ? "bg-signal-rose/10 text-signal-rose"
        : "bg-signal-teal/10 text-signal-teal";

  const imageUrls = Array.isArray(item.imageUrls)
    ? item.imageUrls
    : [];

  const getImageUrl = (url) => {
    if (!url) return "";

    const filename = url.split("/").pop();

    return `${API_BASE_URL}/${filename}`;
  };

  const dateValue = item.date
    ? formatDate(item.date)
    : "Not provided";

  const timeValue = item.time
    ? formatTime(item.time)
    : "Not provided";

  const descriptionValue =
    item.description?.trim() ||
    "No description provided.";

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">

      <Link
        to="/browse"
        className="text-sm font-medium text-ink-500 hover:text-ink-900"
      >
        ← Back
      </Link>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            {title}
          </h1>

          <p className="mt-1 text-sm text-ink-400">
            {category} → {subcategory}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-sm px-2.5 py-1 text-xs font-medium ${statusClass}`}
        >
          {statusLabel}
        </span>
      </div>

      {/* PHOTOS */}
      {imageUrls.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-ink-900">
            Photos
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {imageUrls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="overflow-hidden rounded-2xl border border-ink-100 bg-ink-50"
              >
                <img
                  src={getImageUrl(url)}
                  alt={`${title} photo ${index + 1}`}
                  className="h-64 w-full object-cover"
                  onError={(event) => {
                    console.error(
                      "Failed to load image:",
                      getImageUrl(url)
                    );

                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ITEM DETAILS */}
      <div className="card mt-6 divide-y divide-ink-100">

        <Row
          label="Location"
          value={item.location || "Not provided"}
        />

        <Row
          label="Date"
          value={dateValue}
        />

        <Row
          label="Time"
          value={timeValue}
        />

        {item.color && (
          <Row
            label="Color"
            value={titleCase(item.color)}
          />
        )}

        {item.brand && (
          <Row
            label="Brand"
            value={item.brand}
          />
        )}

        {item.model && (
          <Row
            label="Model"
            value={item.model}
          />
        )}

        <Row
          label="Description"
          value={descriptionValue}
        />

        <Row
          label="Photos"
          value={
            imageUrls.length > 0
              ? `${imageUrls.length} uploaded`
              : "No photos uploaded"
          }
        />

      </div>

      {/* POSSIBLE MATCHES */}
      {matches.length > 0 && (
        <div className="mt-8">

          <h2 className="font-display text-lg font-semibold text-ink-900">
            Possible matches for this report
          </h2>

          <p className="mt-1 text-sm text-ink-400">
            These items were identified as possible matches.
          </p>

          <div className="mt-3 space-y-3">
            {matches.map((match) => (
              <Link
                key={match.id}
                to={`/matches/${match.id}`}
                className="card flex items-center justify-between p-4 transition hover:border-indigo-400"
              >
                <span className="text-sm font-medium text-ink-900">
                  {match.score}% possible match
                </span>

                <span className="text-sm text-indigo-500">
                  View →
                </span>
              </Link>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">

      <span className="text-sm text-ink-300">
        {label}
      </span>

      <span className="text-sm font-medium text-ink-900 sm:max-w-[70%] sm:text-right">
        {value}
      </span>

    </div>
  );
}