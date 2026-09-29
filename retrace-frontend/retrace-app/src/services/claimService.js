const API_URL = `${import.meta.env.VITE_API_URL}/api/claims`;

function getAuthHeaders(includeContentType = true) {
    const token = localStorage.getItem("token");
    return {
        ...(includeContentType ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function parseResponse(response) {
    let data = {};
    try { data = await response.json(); } catch {}
    if (!response.ok) throw new Error(data.message || `Request failed: ${response.status}`);
    return data;
}

export async function submitClaim(matchId, answers) {
    const parts = String(matchId).split("-");
    if (parts.length !== 2) throw new Error("Invalid match id");

    const userString = localStorage.getItem("user");
    let user = null;
    try { user = userString ? JSON.parse(userString) : null; } catch { user = null; }

    if (!user?.name || !user?.email) throw new Error("Please login before submitting a claim.");

    const message = answers
        .filter((answer) => answer?.value)
        .map((answer) => `${answer.question || "Verification"}: ${answer.value}`)
        .join("\n");

    const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            lostItemId: Number(parts[0]),
            foundItemId: Number(parts[1]),
            claimantName: user.name,
            claimantEmail: user.email,
            message,
        }),
    });

    return parseResponse(response);
}

export async function getClaim(claimId) {
    return parseResponse(await fetch(`${API_URL}/${claimId}`, { headers: getAuthHeaders() }));
}

export async function getAllClaims() {
    return parseResponse(await fetch(API_URL, { headers: getAuthHeaders() }));
}

export async function getMyClaims() {
    return parseResponse(await fetch(`${API_URL}/my`, { headers: getAuthHeaders() }));
}

export async function getMyActiveClaims() {
    return parseResponse(await fetch(`${API_URL}/my/active`, { headers: getAuthHeaders() }));
}

export async function getMyHandoverClaims() {
    return parseResponse(await fetch(`${API_URL}/my/handover`, { headers: getAuthHeaders() }));
}

export async function updateClaimStatus(claimId, status) {
    const response = await fetch(`${API_URL}/${claimId}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    return parseResponse(response);
}

export async function uploadHandoverPhoto(claimId, file) {
    if (!file) throw new Error("Please select exactly one photo.");

    const formData = new FormData();
    formData.append("photo", file, file.name);

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/${claimId}/handover`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    });

    return parseResponse(response);
}

export function getHandoverPhotoUrl(claimId) {
    return `${API_URL}/${claimId}/handover-photo`;
}