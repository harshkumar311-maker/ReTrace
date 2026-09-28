import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  fetchMyLostItems,
  fetchMyFoundItems,
} from "../services/itemService";

import { fetchMatches } from "../services/matchService";
import {
  getMyActiveClaims,
  getMyHandoverClaims,
  uploadHandoverPhoto,
} from "../services/claimService";

import StatCard from "../components/StatCard";
import ItemCard from "../components/ItemCard";

export default function DashboardPage() {
  const [lost, setLost] = useState([]);
  const [found, setFound] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeClaims, setActiveClaims] = useState([]);
  const [handoverClaims, setHandoverClaims] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploadingClaimId, setUploadingClaimId] = useState(null);
  const [handoverError, setHandoverError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const lostItems = await fetchMyLostItems();

        setLost(
          Array.isArray(lostItems)
            ? lostItems
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load my lost items:",
          error
        );

        setLost([]);
      }

      try {
        const foundItems = await fetchMyFoundItems();

        setFound(
          Array.isArray(foundItems)
            ? foundItems
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load my found items:",
          error
        );

        setFound([]);
      }

      try {
        const possibleMatches = await fetchMatches();

        setMatches(
          Array.isArray(possibleMatches)
            ? possibleMatches
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load matches:",
          error
        );

        setMatches([]);
      }

      try {
        const myActiveClaims = await getMyActiveClaims();
        setActiveClaims(Array.isArray(myActiveClaims) ? myActiveClaims : []);
      } catch (error) {
        console.error("Failed to load active claims:", error);
        setActiveClaims([]);
      }

      try {
        const myHandover = await getMyHandoverClaims();
        setHandoverClaims(Array.isArray(myHandover) ? myHandover : []);
      } catch (error) {
        console.error("Failed to load handover claims:", error);
        setHandoverClaims([]);
      }
    }

    loadDashboard();
  }, []);

  const recoveredLostItems = lost.filter(
    (item) =>
      String(item?.status || "").toUpperCase() ===
      "RECOVERED"
  );

  async function handleHandoverUpload(claimId) {
    if (!selectedPhoto) return;

    try {
      setUploadingClaimId(claimId);
      setHandoverError("");
      await uploadHandoverPhoto(claimId, selectedPhoto);
      setSelectedPhoto(null);
      const updated = await getMyHandoverClaims();
      setHandoverClaims(Array.isArray(updated) ? updated : []);
      const active = await getMyActiveClaims();
      setActiveClaims(Array.isArray(active) ? active : []);
    } catch (error) {
      console.error("Handover upload failed:", error);
      setHandoverError(error.message || "Unable to upload handover photo.");
    } finally {
      setUploadingClaimId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink-900">
        Your dashboard
      </h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="Lost reports"
          value={lost.length}
        />

        <StatCard
          label="Found reports"
          value={found.length}
        />

        <StatCard
          label="Possible matches"
          value={matches.length}
          tone="amber"
        />

        <StatCard
          label="Active claims"
          value={activeClaims.length}
        />

        <StatCard
          label="Recovered items"
          value={recoveredLostItems.length}
          tone="teal"
        />
      </div>

      <Section
        title="My lost items"
        viewAll="/browse"
      >
        {lost.length === 0 ? (
          <p className="text-sm text-ink-300">
            You have not reported any lost items yet.
          </p>
        ) : (
          lost.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
            />
          ))
        )}
      </Section>

      <Section
        title="My found items"
        viewAll="/browse"
      >
        {found.length === 0 ? (
          <p className="text-sm text-ink-300">
            You have not reported any found items yet.
          </p>
        ) : (
          found.slice(0, 3).map((item) => (
            <ItemCard
              key={item.id}
              item={item}
            />
          ))
        )}
      </Section>

      {activeClaims.some((claim) => claim.status === "APPROVED" && claim.finderName) && (
        <Section title="Approved claim & finder contact" viewAll={null}>
          {activeClaims
            .filter((claim) => claim.status === "APPROVED" && claim.finderName)
            .map((claim) => (
              <div key={claim.id} className="card p-5">
                <p className="font-medium text-ink-900">Claim #{claim.id} approved</p>
                <p className="mt-2 text-sm text-ink-500">You can now contact the finder and arrange the physical handover.</p>
                <div className="mt-4 space-y-1 text-sm text-ink-700">
                  <p><span className="font-medium">Name:</span> {claim.finderName}</p>
                  <p><span className="font-medium">Email:</span> {claim.finderEmail}</p>
                  {claim.finderPhone && <p><span className="font-medium">Phone:</span> {claim.finderPhone}</p>}
                </div>
                <p className="mt-4 text-xs font-medium text-signal-teal">Handover status: {claim.handoverPhotoUploaded ? "Completed" : "Pending finder photo"}</p>
              </div>
            ))}
        </Section>
      )}

      {handoverClaims.length > 0 && (
        <Section title="Handover proof" viewAll={null}>
          {handoverClaims.map((claim) => (
            <div key={claim.id} className="card p-5">
              <p className="font-medium text-ink-900">Claim #{claim.id}</p>
              <p className="mt-1 text-sm text-ink-500">The claim is approved. Upload one photo when you physically hand over the item.</p>
              {claim.handoverPhotoUploaded ? (
                <p className="mt-4 text-sm font-medium text-signal-teal">✓ Handover photo uploaded — item recovered.</p>
              ) : (
                <div className="mt-4">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => setSelectedPhoto(event.target.files?.[0] || null)}
                    className="block w-full text-sm"
                  />
                  <button
                    className="btn-primary mt-3"
                    disabled={!selectedPhoto || uploadingClaimId === claim.id}
                    onClick={() => handleHandoverUpload(claim.id)}
                  >
                    {uploadingClaimId === claim.id ? "Uploading…" : "Upload handover photo"}
                  </button>
                  {handoverError && <p className="mt-2 text-sm text-rose-600">{handoverError}</p>}
                </div>
              )}
            </div>
          ))}
        </Section>
      )}

      <Section
        title="Possible matches"
        viewAll="/matches"
      >
        {matches.length === 0 ? (
          <p className="text-sm text-ink-300">
            No possible matches yet.
          </p>
        ) : (
          matches.slice(0, 3).map((match) => (
            <Link
              key={match.id}
              to={`/matches/${match.id}`}
              className="card flex flex-col justify-between gap-3 p-5 hover:border-indigo-400"
            >
              <div>
                <p className="font-display text-lg font-semibold text-indigo-500">
                  {match.score}%
                </p>

                <p className="text-sm text-ink-500">
                  Possible match found
                </p>
              </div>

              <span className="text-sm font-medium text-indigo-500">
                View details →
              </span>
            </Link>
          ))
        )}
      </Section>

      <Section
        title="Recovery history"
        viewAll={null}
      >
        {recoveredLostItems.length === 0 ? (
          <p className="text-sm text-ink-300">
            Nothing recovered yet — that's next.
          </p>
        ) : (
          recoveredLostItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
            />
          ))
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  viewAll,
  children,
}) {
  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          {title}
        </h2>

        {viewAll && (
          <Link
            to={viewAll}
            className="text-sm font-medium text-indigo-500 hover:text-indigo-600"
          >
            View all →
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}