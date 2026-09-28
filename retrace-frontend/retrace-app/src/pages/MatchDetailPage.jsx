import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMatch } from "../services/matchService";
import MatchScoreCard from "../components/MatchScoreCard";
import MatchComparison from "../components/MatchComparison";
import MatchBreakdown from "../components/MatchBreakdown";

export default function MatchDetailPage() {
  const { id } = useParams();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMatch() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchMatch(id);
        setMatch(data);
      } catch (err) {
        console.error("Error loading match:", err);
        setError("Unable to load this match.");
      } finally {
        setLoading(false);
      }
    }

    loadMatch();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-ink-300">
        Loading match…
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          to="/matches"
          className="text-sm font-medium text-ink-500 hover:text-ink-900"
        >
          ← All matches
        </Link>

        <p className="mt-6 text-sm text-red-500">
          {error || "Match not found."}
        </p>
      </div>
    );
  }

  const lost = match.lostItem;
  const found = match.foundItem;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        to="/matches"
        className="text-sm font-medium text-ink-500 hover:text-ink-900"
      >
        ← All matches
      </Link>

      <div className="mt-4 flex flex-col items-center gap-4 border-b border-ink-100 pb-8 text-center">
        <MatchScoreCard score={match.score} />

        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Possible match found
        </h1>

        <p className="max-w-md text-sm text-ink-500">
          This is a possible match, not a confirmed one. Review the details
          below, and verify ownership if you believe this is your item.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <MatchComparison
          lostItem={lost}
          foundItem={found}
        />

        <MatchBreakdown
          breakdown={match.breakdown}
        />

        <div className="card flex flex-col items-center gap-3 p-6 text-center">
          <p className="font-display text-lg font-semibold text-ink-900">
            Think this might be yours?
          </p>

          <p className="max-w-sm text-sm text-ink-500">
            You'll be asked a few private questions to verify ownership before
            any contact details are shared.
          </p>

          <Link
            to={`/claim/${match.lostItemId}-${match.foundItemId}`}
            className="btn-primary mt-2"
          >
            This might be mine
          </Link>
        </div>
      </div>
    </div>
  );
}