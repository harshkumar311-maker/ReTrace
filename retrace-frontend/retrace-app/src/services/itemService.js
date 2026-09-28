const API_URL = "http://localhost:8080/api";

function getAuthHeaders(includeContentType = false) {
    const token = localStorage.getItem("token");

    return {
        ...(includeContentType
            ? { "Content-Type": "application/json" }
            : {}),
        ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
    };
}

export async function fetchLostItems() {
    const response = await fetch(`${API_URL}/items/lost`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch lost items: ${response.status}`
        );
    }

    return await response.json();
}

export async function fetchFoundItems(filters = {}) {
    const response = await fetch(`${API_URL}/items/found`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch found items: ${response.status}`
        );
    }

    let items = await response.json();

    if (filters.category) {
        items = items.filter(
            item =>
                item.category?.toLowerCase() ===
                filters.category.toLowerCase()
        );
    }

    if (filters.subcategory) {
        items = items.filter(
            item =>
                item.subcategory?.toLowerCase() ===
                filters.subcategory.toLowerCase()
        );
    }

    if (filters.brand) {
        items = items.filter(
            item =>
                item.brand?.toLowerCase() ===
                filters.brand.toLowerCase()
        );
    }

    if (filters.color) {
        items = items.filter(
            item =>
                item.color?.toLowerCase() ===
                filters.color.toLowerCase()
        );
    }

    if (filters.location) {
        items = items.filter(
            item =>
                item.location?.toLowerCase() ===
                filters.location.toLowerCase()
        );
    }

    return items;
}

export async function fetchMyLostItems() {
    const response = await fetch(
        `${API_URL}/items/my/lost`,
        {
            method: "GET",
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch my lost items: ${response.status}`
        );
    }

    return await response.json();
}

export async function fetchMyFoundItems() {
    const response = await fetch(
        `${API_URL}/items/my/found`,
        {
            method: "GET",
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch my found items: ${response.status}`
        );
    }

    return await response.json();
}

export async function submitReport(reportType, payload, photos = []) {
    const type = reportType?.toLowerCase();

    if (type !== "lost" && type !== "found") {
        throw new Error(
            "Invalid report type. Use 'lost' or 'found'."
        );
    }

    const formData = new FormData();

    formData.append(
        "data",
        new Blob(
            [JSON.stringify(payload)],
            { type: "application/json" }
        )
    );

    photos.forEach((photo) => {
        if (photo?.file) {
            formData.append(
                "photos",
                photo.file,
                photo.file.name
            );
        }
    });

    const token = localStorage.getItem("token");

    const headers = {
        ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
    };

    const response = await fetch(
        `${API_URL}/items/${type}`,
        {
            method: "POST",
            headers,
            body: formData,
        }
    );

    if (!response.ok) {
        let errorMessage =
            `Request failed with status ${response.status}`;

        try {
            const errorData = await response.json();

            if (errorData.message) {
                errorMessage = errorData.message;
            }
        } catch {
            // Ignore JSON parsing error
        }

        throw new Error(errorMessage);
    }

    return await response.json();
}

export async function fetchItem(id) {
    const response = await fetch(
        `${API_URL}/items/${id}`,
        {
            method: "GET",
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch item: ${response.status}`
        );
    }

    return await response.json();
}