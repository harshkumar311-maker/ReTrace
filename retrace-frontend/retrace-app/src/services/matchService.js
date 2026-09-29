const API_URL = `${import.meta.env.VITE_API_URL}/api`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function createBreakdown(match) {
  const matchedFields = match.matchedFields || [];
  const found = match.foundItem || {};

  const isMatched = (field) => matchedFields.includes(field);

  return [
    {
      signal: "Category",
      strength: isMatched("category") ? "Strong" : "Weak",
      note: isMatched("category")
        ? `Both are ${found.category || "same category"}`
        : "Category does not match",
    },
    {
      signal: "Subcategory",
      strength: isMatched("subcategory") ? "Strong" : "Weak",
      note: isMatched("subcategory")
        ? `Both are ${found.subcategory || "same subcategory"}`
        : "Subcategory does not match",
    },
    {
      signal: "Brand",
      strength: isMatched("brand") ? "Strong" : "Not applicable",
      note: isMatched("brand")
        ? `Both listed as ${found.brand || "same brand"}`
        : "Brand does not match or was not provided",
    },
    {
      signal: "Model",
      strength: isMatched("model") ? "Strong" : "Not applicable",
      note: isMatched("model")
        ? `Both listed as ${found.model || "same model"}`
        : "Model does not match or was not provided",
    },
    {
      signal: "Color",
      strength: isMatched("color") ? "Strong" : "Not applicable",
      note: isMatched("color")
        ? `Both described as ${found.color || "same color"}`
        : "Color does not match or was not provided",
    },
    {
      signal: "Location",
      strength: isMatched("location") ? "Strong" : "Weak",
      note: isMatched("location")
        ? `Both reported at ${found.location || "same location"}`
        : "Reported locations are different",
    },
  ];
}

function normalizeMatch(match, lostItem) {
  return {
    id: `${match.lostItemId}-${match.foundItemId}`,
    score: match.score,
    lostItemId: match.lostItemId,
    foundItemId: match.foundItemId,
    lostItem: lostItem,
    foundItem: match.foundItem,
    matchedFields: match.matchedFields || [],
    breakdown: createBreakdown(match),
    status: "matched",
  };
}

export async function fetchMatches() {
  const lostResponse = await fetch(`${API_URL}/items/my/lost`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!lostResponse.ok) {
    throw new Error(
      `Failed to fetch my lost items: ${lostResponse.status}`
    );
  }

  const lostItems = await lostResponse.json();

  const matchLists = await Promise.all(
    lostItems.map(async (lostItem) => {
      const response = await fetch(
        `${API_URL}/items/matches/${lostItem.id}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch matches for item ${lostItem.id}: ${response.status}`
        );
      }

      const matches = await response.json();

      return matches.map((match) =>
        normalizeMatch(match, lostItem)
      );
    })
  );

  return matchLists
    .flat()
    .sort((a, b) => b.score - a.score);
}

export async function fetchMatch(id) {
  const parts = String(id).split("-");

  if (parts.length !== 2) {
    throw new Error("Invalid match id");
  }

  const lostItemId = parts[0];
  const foundItemId = parts[1];

  const response = await fetch(
    `${API_URL}/items/matches/${lostItemId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch match: ${response.status}`
    );
  }

  const matches = await response.json();

  const match = matches.find(
    (item) => String(item.foundItemId) === String(foundItemId)
  );

  if (!match) {
    throw new Error("Match not found");
  }

  const lostResponse = await fetch(
    `${API_URL}/items/${lostItemId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!lostResponse.ok) {
    throw new Error(
      `Failed to fetch lost item: ${lostResponse.status}`
    );
  }

  const lostItem = await lostResponse.json();

  return normalizeMatch(match, lostItem);
}

export async function fetchMatchesForItem(itemId) {
  const response = await fetch(
    `${API_URL}/items/matches/${itemId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch matches: ${response.status}`
    );
  }

  const matches = await response.json();

  const lostResponse = await fetch(
    `${API_URL}/items/${itemId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!lostResponse.ok) {
    throw new Error(
      `Failed to fetch lost item: ${lostResponse.status}`
    );
  }

  const lostItem = await lostResponse.json();

  return matches.map((match) =>
    normalizeMatch(match, lostItem)
  );
}