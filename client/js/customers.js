// Get references to the page elements
const searchButton = document.getElementById("searchButton");
const lastNameInput = document.getElementById("lastName");
const customersTable = document.getElementById("customersTable");
const customerMessage = document.getElementById("customerMessage");
const customerForm = document.getElementById("customerForm");
const updateCustomerButton = document.getElementById("updateCustomerButton");
const cancelButton = document.getElementById("cancelButton");
const firstNameInput = document.getElementById("firstName");
const editLastNameInput = document.getElementById("editLastName");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const stateInput = document.getElementById("state");
const postalCodeInput = document.getElementById("postalCode");
const countryInput = document.getElementById("country");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Store the customer currently being edited
let currentCustomerID = null;

// Search for customers when the Search button is clicked
searchButton.addEventListener("click", searchCustomers);

// Search for customers matching the entered last name
async function searchCustomers() {

    // Clear any previous messages
    customerMessage.textContent = "";
    customerMessage.className = "success-message";
    
    // Read the last name entered into the form
    const lastName = lastNameInput.value.trim();

    // Ensure a last name has been entered
    if (!lastName) {
        customerMessage.textContent = "Please enter a last name.";
        customerMessage.className = "success-message error";
        return;
    }

    // Disable the Search button while the request is being processed
    searchButton.disabled = true;
    searchButton.textContent = "Searching...";

    try {

        // Request matching customers from the Express server
        const response = await apiFetch(`/api/customers/search?lastName=${encodeURIComponent(lastName)}`);

        // Check if the server returned an error
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        // Convert the JSON response into a JavaScript array
        const customers = await response.json();

        // Store the HTML for each table row
        let tableRows = "";

        // Create a table row for every matching customer
        for (const customer of customers) {
            tableRows += `
                <tr>
                    <td>${customer.firstname} ${customer.lastname}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone}</td>
                    <td class="action-column">
                        <button
                            class="btn btn-primary btn-view"
                            data-customer-id="${customer.customerid}">
                            View/Edit
                        </button>
                    </td>
                </tr>
            `;
        }

        // Display the matching customers
        customersTable.innerHTML = tableRows;

        // Display a message if no customers were found
        if (customers.length === 0) {

            customerMessage.textContent = "No matching customers found.";
            customerMessage.className = "success-message error";
        }

    }
    catch (error) {
        console.error("Error searching customers:", error);
        customerMessage.textContent = "Unable to contact the server.";
        customerMessage.className = "success-message error";
    }
    finally {
        // Re-enable the Search button
        searchButton.disabled = false;
        searchButton.textContent = "Search";
    }
}

// Display a customer's details when the View/Edit button is clicked
customersTable.addEventListener("click", (event) => {

    // Ignore clicks that are not on a View/Edit button
    if (!event.target.classList.contains("btn-view")) {
        return;
    }

    // Retrieve the selected customer ID
    const customerID = event.target.dataset.customerId;

    showCustomer(customerID);

});

// Retrieve a customer's details and display them in the edit form
async function showCustomer(customerID) {

    try {

        // Request the customer details from the server
        const response = await apiFetch(`/api/customers/${customerID}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        // Convert the JSON response into a JavaScript object
        const customer = await response.json();

        // Store the customer being edited
        currentCustomerID = customer.customerid;

        // Display the customer details
        firstNameInput.value = customer.firstname;
        editLastNameInput.value = customer.lastname;
        addressInput.value = customer.address;
        cityInput.value = customer.city;
        stateInput.value = customer.state;
        postalCodeInput.value = customer.postalcode;
        countryInput.value = customer.countrycode;
        phoneInput.value = customer.phone;
        emailInput.value = customer.email;
        passwordInput.value = customer.password;

        // Display the edit form
        customerForm.classList.remove("hidden");

    }
    catch (error) {
        console.error("Error retrieving customer:", error);
        customerMessage.textContent = error.message;
        customerMessage.className = "success-message error";
    }

}

// Retrieve the countries and populate the dropdown menu
async function loadCountries() {

    try {
        // Request the countries from the server
        const response = await apiFetch("/api/countries");

        if (!response.ok) {

            const error = await response.json();
            throw new Error(error.message);
        }

        // Convert the JSON response into a JavaScript array
        const countries = await response.json();

        // Remove any existing options
        countryInput.innerHTML = "";

        // Add each country to the dropdown
        for (const country of countries) {

            const option = document.createElement("option");

            option.value = country.countrycode;
            option.textContent = country.countryname;

            countryInput.appendChild(option);

        }

    }
    catch (error) {
        console.error("Error retrieving countries:", error);
        customerMessage.textContent = error.message;
        customerMessage.className = "success-message error";
    }

}

// Load the list of countries when the page opens
loadCountries();

// Update the customer when the Update button is clicked
updateCustomerButton.addEventListener("click", updateCustomer);

// Hide the edit form when Cancel is clicked
cancelButton.addEventListener("click", () => {
    
    customerForm.classList.add("hidden");
    currentCustomerID = null;

    // Clear any previous message
    customerMessage.textContent = "";
    customerMessage.className = "success-message";
});

// Update the selected customer's details
async function updateCustomer() {

    // Read the updated customer details
    const firstName = firstNameInput.value.trim();
    const lastName = editLastNameInput.value.trim();
    const address = addressInput.value.trim();
    const city = cityInput.value.trim();
    const state = stateInput.value.trim();
    const postalCode = postalCodeInput.value.trim();
    const countryCode = countryInput.value;
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Ensure all fields have been completed
    if (
        !firstName ||
        !lastName ||
        !address ||
        !city ||
        !state ||
        !postalCode ||
        !countryCode ||
        !phone ||
        !email ||
        !password
    ) {

        customerMessage.textContent = "Please complete all fields.";
        customerMessage.className = "success-message error";
        return;

    }

    // Clear any previous message
    customerMessage.textContent = "";

    // Disable the Update button while the request is being processed
    updateCustomerButton.disabled = true;
    updateCustomerButton.textContent = "Updating...";

    try {

        // Send the updated customer details to the server
        const response = await apiFetch(`/api/customers/${currentCustomerID}`, {

            method: "PUT",

            headers: {"Content-Type": "application/json"},

            body: JSON.stringify({
                firstName,
                lastName,
                address,
                city,
                state,
                postalCode,
                countryCode,
                phone,
                email,
                password
            })

        });

        if (!response.ok) {

            const error = await response.json();
            throw new Error(error.message);

        }

        // Get response message
        const result = await response.json();

        // Hide the edit form
        customerForm.classList.add("hidden");

        currentCustomerID = null;

        // Refresh the search results
        await searchCustomers();

        // Display a success message
        customerMessage.textContent = result.message;
        customerMessage.className = "success-message success";

    }
    catch (error) {

        console.error("Error updating customer:", error);
        customerMessage.textContent = error.message;
        customerMessage.className = "success-message error";
    }
    finally {

        // Re-enable the Update button
        updateCustomerButton.disabled = false;
        updateCustomerButton.textContent = "Update Customer";

    }
}