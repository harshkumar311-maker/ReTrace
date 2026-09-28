import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLostItems, fetchFoundItems } from "../services/itemService";
import { formatDate, titleCase } from "../utils/format";

export default function AdminReportsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        setError("");

        const [lostItems, foundItems] = await Promise.all([
          fetchLostItems(),
          fetchFoundItems(),
        ]);

        setItems([...lostItems, ...foundItems]);
      } catch (error) {
        console.error("Failed to load reports:", error);
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Reports
        </h1>

        {!loading && (
          <p className="text-sm text-ink-300">
            {items.length} total
          </p>
        )}
      </div>

      {loading && (
        <p className="mt-6 text-sm text-ink-500">
          Loading reports...
        </p>
      )}

      {error && (
        <p className="mt-6 text-sm text-signal-rose">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="card mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-ink-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium text-ink-900">
                      {item.title || item.model || "Untitled item"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={
                          String(item.reportType).toLowerCase() === "lost"
                            ? "text-signal-rose"
                            : "text-signal-teal"
                        }
                      >
                        {titleCase(item.reportType)}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-ink-500">
                      {titleCase(item.category)}
                    </td>

                    <td className="px-4 py-3 text-ink-500">
                      {item.location || "—"}
                    </td>

                    <td className="px-4 py-3 text-ink-500">
                      {formatDate(item.date)}
                    </td>

                    <td className="px-4 py-3 text-ink-500">
                      {titleCase(item.status)}
                    </td>

                    <td className="px-4 py-3">
                      <Link
                        to={`/item/${item.id}`}
                        className="text-indigo-500 hover:underline"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {items.length === 0 && (
              <div className="p-8 text-center text-sm text-ink-500">
                No reports found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}