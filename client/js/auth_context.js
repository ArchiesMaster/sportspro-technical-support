// Store the authentication details after a successful login
function login(token, role) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
}

// Retrieve the stored JWT
function getToken() {
    return localStorage.getItem("token");
}

// Retrieve the logged in user's role
function getRole() {
    return localStorage.getItem("role");
}

// Check whether the user is currently logged in
function isLoggedIn() {
    return getToken() !== null;
}

// Remove the user's authentication details on logout and redirect to the login page
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
}

// Attach the logout event if a logout button exists on the page
document.addEventListener("DOMContentLoaded", () => {

    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
});