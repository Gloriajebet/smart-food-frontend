export const getAccessToken = () => {
    return localStorage.getItem("access") || "";
};

export const authHeaders = () => {
    const token = getAccessToken();

    return {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
    };
};

export const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
        localStorage.clear();
        window.location.href = "/";
        return null;
    }

    const response = await fetch(
        "https://smart-food-dyp3.onrender.com/api/token/refresh/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh }),
        }
    );

    if (!response.ok) {
        localStorage.clear();
        window.location.href = "/";
        return null;
    }

    const data = await response.json();
    localStorage.setItem("access", data.access);
    return data.access;
};

export const fetchWithAuth = async (url, options = {}) => {
    const token = getAccessToken();
    if (!token) {
        window.location.href = "/";
        throw new Error("No authentication token found.");
    }

    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${token}`);

    if (!(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    let response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        const newToken = await refreshToken();
        if (!newToken) return response;

        headers.set("Authorization", `Bearer ${newToken}`);
        response = await fetch(url, {
            ...options,
            headers,
        });
    }

    return response;
};