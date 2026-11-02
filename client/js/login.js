const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

// Prevent authenticated users from returning to the login page
if (isLoggedIn()) {
    window.location.href = "index.html";
}

// Log the user in on button click
loginButton.addEventListener("click", loginUser);

async function loginUser() {

    // Prevent duplicate login requests
    if (loginButton.disabled) {
        return;
    }

    // retrieve login credentials from the form
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // clear any previous login messages
    loginMessage.textContent = "";

    // Disable the login button while loading
    loginButton.disabled = true;
    loginButton.textContent = "Signing In...";

    try {

        // Send the login request to the server
        const response = await fetch(
            "/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        // Get the server response
        const data = await response.json();

        // Display any log in errors
        if (!response.ok) {
            loginMessage.textContent = data.message;
            loginMessage.className = "success-message error";
            return;
        }

        // Store the authentication details
        login(data.token, data.role);

        // Redirect to the dashboard
        window.location.href = "index.html";

    }
    catch (error) {
        // Display an error if the server cannot be reached
        console.error(error);
        loginMessage.textContent = "Unable to contact the server.";
        loginMessage.className = "success-message error";
    }
    finally {

        // Re-enable the login button
        loginButton.disabled = false;
        loginButton.textContent = "Sign In";

    }

}

// Login when the Enter key is pressed
document.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            loginUser();
        }
    }

);