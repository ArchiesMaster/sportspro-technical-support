// Send an authenticated request to the API
async function apiFetch(url, options = {}) {

    const token = getToken();

    // Copy any existing headers and add the Authorization header
    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`
    };

    // Specify the content type if the request has a body
    if (options.body) {
        headers["Content-Type"] = "application/json";
    }

    options.headers = headers;

    return fetch(url, options);
}