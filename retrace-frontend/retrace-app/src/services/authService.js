const API_URL = "http://localhost:8080/api/auth";

export async function registerUser(userData) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    return data;
}

export async function loginUser(credentials) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    return data;
}

export function getToken() {
    return localStorage.getItem("token");
}

export function getCurrentUser() {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
}

export function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}