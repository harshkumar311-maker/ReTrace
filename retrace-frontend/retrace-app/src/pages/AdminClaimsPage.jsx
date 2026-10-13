jsx
import { useEffect, useState } from "react";
import { fetchItem } from "../services/itemService";
import {
  getAllClaims,
  updateClaimStatus,
  getHandoverPhotoUrl,
} from "../services/claimService";
import { titleCase } from "../utils/format";

function HandoverPhoto({ claimId }) {
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";

    async function loadPhoto() {
      try {
        setLoading(true);
        setError("");
        setPhotoUrl("");

        const token = localStorage.getItem("token");

        const response = await fetch(getHandoverPhotoUrl(claimId), {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        });

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Handover photo is not available on the server."
              : `Unable to load photo (${response.status}).`
          );
        }

        const blob = await response.blob();

        if (!blob.type.startsWith("image/")) {
          throw new Error("The server did not return an image.");
        }

        objectUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          setPhotoUrl(objectUrl);
        } else {
          URL.revokeObjectURL(objectUrl);
          objectUrl = "";
        }
      } catch (err) {
        console.error("Failed to load handover photo:", err);

        if (!cancelled) {
          setError(err.message || "Unable to load handover photo.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPhoto();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [claimId]);

  if (loading) {
    return (
      <p className="mt-2 text-sm text-ink-400">
        Loading handover photo...
      </p>
    );
  }

  if (error) {
    return (
      <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-3">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!photoUrl) {
    return (
      <p className="mt-2 text-sm text-ink-400">
        No handover photo available.
      </p>
    );
  }

  return (
    <div className="mt-3">
      <p className="mb-2 text-sm font-medium text-ink-700">
        Handover Photo
      </p>

      <a
        href={photoUrl}
        target="_blank"
        rel="noreferrer"
        title="Click to view full-size photo"
      >
        <img
          src={photoUrl}
          alt={`Handover photo for claim ${claimId}`}
          className="max-h-72 w-auto max-w-full cursor-zoom-in rounded-lg border border-ink-200 object-contain"
        />
      </a>

      <p className="mt-1 text-xs text-ink-400">
        Click the photo to view full size.
      </p>
    </div>
  );
}

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadClaims();
  }, []);

  async function loadClaims() {
    try {
      setLoading(true);
      setError("");

      const data = await getAllClaims();
      setClaims(data);

      const itemIds = [
        ...new Set(
          data.flatMap((claim) => [
            claim.lostItemId,
            claim.foundItemId,
          ])
        ),
      ].filter((id) => id != null);

      const itemResults = await Promise.all(
        itemIds.map(async (id) => {
          try {
            const item = await fetchItem(id);
            return [id, item];
          } catch (err) {
            console.error(`Failed to load item ${id}:`, err);
            return [id, null];
          }
        })
      );

      setItems(Object.fromEntries(itemResults));
    } catch (err) {
      console.error("Failed to load claims:", err);
      setError(err.message || "Unable to load claims.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(claimId, status) {
    try {
      setUpdatingId(claimId);
      setError("");

      const updatedClaim = await updateClaimStatus(claimId, status);

      setClaims((current) =>
        current.map((claim) =>
          claim.id === claimId ? updatedClaim : claim
        )
      );
    } catch (err) {
      console.error("Failed to update claim:", err);
      setError(err.message || "Unable to update claim status.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Claims
        </h1>
        <p className="mt-6 text-sm text-ink-400">
          Loading claims...
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">
        Claims
      </h1>

      <p className="mt-1.5 text-sm text-ink-500">
        Review ownership claims submitted by users.
      </p>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {claims.length === 0 ? (
        <div className="mt-6 rounded-lg border border-ink-100 bg-white p-8 text-center">
          <p className="font-medium text-ink-700">No claims found</p>
          <p className="mt-1 text-sm text-ink-400">
            Submitted claims will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {claims.map((claim) => {
            const lost = items[claim.lostItemId];
            const found = items[claim.foundItemId];
            const isUpdating = updatingId === claim.id;

            const isApproved =
              String(claim.status).toUpperCase() === "APPROVED";

            const hasHandoverPhoto =
              claim.handoverPhotoUploaded === true ||
              String(claim.handoverPhotoUploaded).toLowerCase() === "true";

            return (
              <div
                key={claim.id}
                className="card flex flex-col gap-4 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-ink-900">
                      Claim #{claim.id}
                    </p>

                    <p className="mt-1 text-sm text-ink-600">
                      {lost?.title ||
                        lost?.model ||
                        lost?.subcategory ||
                        `Lost item #${claim.lostItemId}`}
                      {" ↔ "}
                      {found?.title ||
                        found?.model ||
                        found?.subcategory ||
                        `Found item #${claim.foundItemId}`}
                    </p>

                    <p className="mt-2 text-sm text-ink-500">
                      Claimant:{" "}
                      <span className="font-medium text-ink-700">
                        {claim.claimantName || "Unknown"}
                      </span>
                    </p>

                    <p className="text-sm text-ink-500">
                      Email: {claim.claimantEmail || "Not available"}
                    </p>

                    {claim.message && (
                      <div className="mt-3 rounded-md bg-ink-50 px-3 py-2">
                        <p className="text-xs font-medium text-ink-500">
                          Verification details
                        </p>
                        <p className="mt-1 whitespace-pre-line text-sm text-ink-600">
                          {claim.message}
                        </p>
                      </div>
                    )}

                    <p className="mt-3 text-sm text-ink-500">
                      Status:{" "}
                      <span className="font-semibold text-ink-800">
                        {titleCase(claim.status)}
                      </span>
                    </p>

                    {isApproved && (
                      <div className="mt-2">
                        <p className="text-sm text-ink-500">
                          Handover:{" "}
                          {hasHandoverPhoto
                            ? "Photo received · Recovered"
                            : "Waiting for finder photo"}
                        </p>

                        {hasHandoverPhoto && (
                          <HandoverPhoto claimId={claim.id} />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {String(claim.status).toUpperCase() === "PENDING" && (
                      <>
                        <button
                          className="btn-secondary !px-3 !py-1.5 text-xs"
                          disabled={isUpdating}
                          onClick={() =>
                            handleStatusUpdate(claim.id, "REJECTED")
                          }
                        >
                          {isUpdating ? "Updating..." : "Reject"}
                        </button>

                        <button
                          className="btn-primary !px-3 !py-1.5 text-xs"
                          disabled={isUpdating}
                          onClick={() =>
                            handleStatusUpdate(claim.id, "APPROVED")
                          }
                        >
                          {isUpdating ? "Updating..." : "Approve"}
                        </button>
                      </>
                    )}

                    {isApproved && (
                      <span className="rounded-md bg-signal-teal/10 px-3 py-1.5 text-xs font-medium text-signal-teal">
                        Approved
                      </span>
                    )}

                    {String(claim.status).toUpperCase() === "REJECTED" && (
                      <span className="rounded-md bg-signal-rose/10 px-3 py-1.5 text-xs font-medium text-signal-rose">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
