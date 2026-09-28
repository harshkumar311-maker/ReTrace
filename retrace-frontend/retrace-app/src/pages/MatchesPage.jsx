import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMatches } from "../services/matchService";
import MatchScoreCard from "../components/MatchScoreCard";
import { titleCase } from "../utils/format";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMatches() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchMatches();
        setMatches(data);
      } catch (err) {
        console.error("Error loading matches:", err);
        setError("Unable to load matches.");
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-ink-300">
        Loading matches…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-sm text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink-900">
        Possible matches
      </h1>

      <p className="mt-1.5 text-sm text-ink-500">
        ReTrace compares reports and surfaces possible matches —
        never a guarantee, always something to verify.
      </p>

      {matches.length === 0 ? (
        <div className="mt-8 card p-8 text-center">
          <p className="font-display text-lg font-semibold text-ink-900">
            No possible matches yet
          </p>

          <p className="mt-2 text-sm text-ink-500">
            ReTrace will show possible matches when a found item
            matches one of your lost reports.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {matches.map((match) => {
            const lost = match.lostItem;
            const found = match.foundItem;

            if (!lost || !found) {
              return null;
            }

            const lostName =
              lost.title ||
              lost.model ||
              "Unnamed lost item";

            const foundName =
              found.title ||
              found.model ||
              "Unnamed found item";

            const lostCategory = lost.category
              ? titleCase(lost.category)
              : "";

            const lostSubcategory = lost.subcategory
              ? titleCase(lost.subcategory)
              : "";

            const foundCategory = found.category
              ? titleCase(found.category)
              : "";

            const foundSubcategory = found.subcategory
              ? titleCase(found.subcategory)
              : "";

            return (
              <Link
                key={match.id}
                to={`/matches/${match.id}`}
                className="card flex flex-col gap-5 p-5 transition-colors hover:border-indigo-400 sm:flex-row sm:items-center"
              >
                <MatchScoreCard score={match.score} />

                <div className="flex-1">
                  <p className="font-display text-lg font-semibold text-ink-900">
                    Possible match found
                  </p>

                  <div className="mt-3 grid gap-3 text-sm text-ink-500 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-ink-300">
                        Your lost item
                      </p>

                      <p className="font-medium text-ink-900">
                        {lostName}
                      </p>

                      {(lostCategory || lostSubcategory) && (
                        <p className="mt-0.5 text-xs text-ink-400">
                          {lostCategory}
                          {lostCategory && lostSubcategory
                            ? " → "
                            : ""}
                          {lostSubcategory}
                        </p>
                      )}

                      <p className="mt-1">
                        📍{" "}
                        {lost.location ||
                          "Location not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-ink-300">
                        Possible found item
                      </p>

                      <p className="font-medium text-ink-900">
                        {foundName}
                      </p>

                      {(foundCategory || foundSubcategory) && (
                        <p className="mt-0.5 text-xs text-ink-400">
                          {foundCategory}
                          {foundCategory && foundSubcategory
                            ? " → "
                            : ""}
                          {foundSubcategory}
                        </p>
                      )}

                      <p className="mt-1">
                        📍{" "}
                        {found.location ||
                          "Location not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                <span className="shrink-0 text-sm font-medium text-indigo-500">
                  View details →
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}