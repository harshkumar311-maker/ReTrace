import { useEffect, useState } from "react";
import { fetchAdminStats } from "../services/adminStatsService";
import StatCard from "../components/StatCard";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchAdminStats();

        setStats(data);
      } catch (error) {
        console.error("Failed to load admin stats:", error);
        setError("Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">
        Overview
      </h1>

      {loading && (
        <p className="mt-6 text-sm text-ink-500">
          Loading dashboard statistics...
        </p>
      )}

      {error && (
        <p className="mt-6 text-sm text-rose-600">
          {error}
        </p>
      )}

      {stats && !loading && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

            <StatCard
              label="Total reports"
              value={stats.totalReports}
            />

            <StatCard
              label="Lost reports"
              value={stats.lostReports}
            />

            <StatCard
              label="Found reports"
              value={stats.foundReports}
            />

            <StatCard
              label="Possible matches"
              value={stats.possibleMatches}
              tone="amber"
            />

            <StatCard
              label="Successful recoveries"
              value={stats.successfulRecoveries}
              tone="teal"
            />

            <StatCard
              label="Pending claims"
              value={stats.pendingClaims}
              tone="amber"
            />

            <StatCard
              label="Flagged reports"
              value={stats.flaggedReports}
              tone="rose"
            />

          </div>

          <div className="mt-10 card p-5">
            <p className="font-display text-base font-semibold text-ink-900">
              Recent activity
            </p>

            <ul className="mt-4 space-y-3 text-sm text-ink-500">
              <li>
                🔎 New possible match generated for a lost item.
              </li>

              <li>
                ✅ Claim activity recorded in the system.
              </li>

              <li>
                📄 New item report submitted.
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}