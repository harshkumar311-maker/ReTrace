const API_URL = `${import.meta.env.VITE_API_URL}/api`;

function getAuthHeaders() {
    const token = localStorage.getItem("token");

    return {
        ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
    };
}

export async function fetchAdminUsers() {
    const response = await fetch(
        `${API_URL}/admin/users`,
        {
            method: "GET",
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch users: ${response.status}`
        );
    }

    return await response.json();
}