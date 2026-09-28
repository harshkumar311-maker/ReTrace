// Mock data standing in for GET /api/matches and GET /api/matches/{id}.
// The real scoring engine will live in the Spring Boot service; this shape
// (overall score + per-signal breakdown) is what the UI is built around.

export const MATCHES = [
  {
    id: "match-1",
    score: 92,
    lostItemId: "lost-1",
    foundItemId: "found-1",
    breakdown: [
      { signal: "Category", strength: "Strong", note: "Both are Electronics → Earbuds" },
      { signal: "Brand", strength: "Strong", note: "Both listed as boAt" },
      { signal: "Color", strength: "Strong", note: "Both described as black" },
      { signal: "Location", strength: "Strong", note: "Both reported at College Library" },
      { signal: "Time", strength: "Strong", note: "20-minute difference" },
      { signal: "Description", strength: "Moderate", note: "Similar wording, not identical" },
    ],
    status: "pending",
  },
  {
    id: "match-2",
    score: 68,
    lostItemId: "lost-3",
    foundItemId: "found-5",
    breakdown: [
      { signal: "Category", strength: "Strong", note: "Both are Keys → Keychain" },
      { signal: "Brand", strength: "Not applicable", note: "No brand for this category" },
      { signal: "Color", strength: "Strong", note: "Both silver" },
      { signal: "Location", strength: "Strong", note: "Same food court" },
      { signal: "Time", strength: "Strong", note: "22-minute difference" },
      { signal: "Description", strength: "Moderate", note: "Star keychain mentioned in both" },
    ],
    status: "verified",
  },
  {
    id: "match-3",
    score: 41,
    lostItemId: "lost-2",
    foundItemId: "found-4",
    breakdown: [
      { signal: "Category", strength: "Strong", note: "Both are Documents → ID Card" },
      { signal: "Brand", strength: "Not applicable", note: "No brand for this category" },
      { signal: "Color", strength: "Not applicable", note: "Not specified" },
      { signal: "Location", strength: "Weak", note: "Different metro stations" },
      { signal: "Time", strength: "Moderate", note: "Reported 3 days apart" },
      { signal: "Description", strength: "Weak", note: "Limited overlap in details" },
    ],
    status: "pending",
  },
];

export const getMatchById = (id) => MATCHES.find((m) => m.id === id);
export const getMatchesForItem = (itemId) =>
  MATCHES.filter((m) => m.lostItemId === itemId || m.foundItemId === itemId);
