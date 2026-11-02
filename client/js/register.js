// Form fields
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const role = document.getElementById("role");
const address = document.getElementById("address");
const city = document.getElementById("city");
const state = document.getElementById("state");
const postalCode = document.getElementById("postalCode");
const countryCode = document.getElementById("countryCode");
const phone = document.getElementById("phone");

const technicianPhone =
    document.getElementById("technicianPhone");

const customerFields =
    document.getElementById("customerFields");

const technicianFields =
    document.getElementById("technicianFields");

const registerButton = document.getElementById("registerButton");
const registerMessage = document.getElementById("registerMessage");


// Toggle fields depending on the selected role
toggleRoleFields();

role.addEventListener(
    "change",
    toggleRoleFields
);

function toggleRoleFields() {

    customerFields.classList.add("hidden");
    technicianFields.classList.add("hidden");

    if (role.value === "customer") {

        customerFields.classList.remove("hidden");

    }

    else if (role.value === "technician") {

        technicianFields.classList.remove("hidden");

    }

}

// Register a new user
async function register() {

    // Clear previous message
    registerMessage.textContent = "";
    registerMessage.className = "success-message";

    // Client-side validation
    if (!firstName.value.trim()) {

        registerMessage.textContent = "Please enter your first name.";
        registerMessage.className = "success-message error";
        return;

    }

    if (!lastName.value.trim()) {

        registerMessage.textContent = "Please enter your last name.";
        registerMessage.className = "success-message error";
        return;

    }

    if (!email.value.trim()) {

        registerMessage.textContent = "Please enter your email address.";
        registerMessage.className = "success-message error";
        return;

    }

    if (!password.value) {

        registerMessage.textContent = "Please enter a password.";
        registerMessage.className = "success-message error";
        return;

    }

    if (password.value.length < 8) {

        registerMessage.textContent = "Password must be at least 8 characters.";
        registerMessage.className = "success-message error";
        return;

    }

    if (password.value !== confirmPassword.value) {

        registerMessage.textContent = "Passwords do not match.";
        registerMessage.className = "success-message error";
        return;

    }

    if (!role.value) {

        registerMessage.textContent = "Please select a role.";
        registerMessage.className = "success-message error";
        return;

    }

    if (role.value === "customer") {

        if (
            !address.value.trim() ||
            !city.value.trim() ||
            !state.value.trim() ||
            !postalCode.value.trim() ||
            !phone.value.trim()
        ) {

            registerMessage.textContent = "Please complete all customer details.";
            registerMessage.className = "success-message error";
            return;

        }

    }

    if (role.value === "technician") {

        if (!technicianPhone.value.trim()) {

            registerMessage.textContent = "Please enter a phone number.";
            registerMessage.className = "success-message error";

            return;

        }

    }

    // Display loading state
    registerButton.disabled = true;
    registerButton.textContent = "Registering...";

    try {

        const response = await fetch(

            "/api/auth/register",

            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    firstName: firstName.value.trim(),
                    lastName: lastName.value.trim(),
                    email: email.value.trim(),
                    password: password.value,
                    confirmPassword: confirmPassword.value,
                    role: role.value,

                    address: address.value.trim(),
                    city: city.value.trim(),
                    state: state.value.trim(),
                    postalCode: postalCode.value.trim(),
                    countryCode: countryCode.value,

                    phone:
                        role.value === "customer"
                            ? phone.value.trim()
                            : technicianPhone.value.trim()

                })

            }

        );

        const data = await response.json();

        if (!response.ok) {

            registerMessage.textContent = data.message;
            registerMessage.className = "success-message error";
            return;

        }


        registerMessage.textContent = data.message;
        registerMessage.className = "success-message success";

        // Redirect to the login page after a short delay
        setTimeout(() => {

            window.location.href = "login.html";

        }, 1500);

    }
    catch (error) {

        console.error(error);

        registerMessage.textContent = "Unable to contact the server.";
        registerMessage.className = "success-message error";

    }
    finally {

        registerButton.disabled = false;
        registerButton.textContent = "Register";

    }

}

// Event listener
registerButton.addEventListener(
    "click",
    register
);