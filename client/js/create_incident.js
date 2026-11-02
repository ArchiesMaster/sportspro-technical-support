const customerSelect = document.getElementById("customer");
const productSelect = document.getElementById("product");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const createIncidentButton = document.getElementById("createIncidentButton");
const successPanel = document.getElementById("successPanel");
const successMessage = document.getElementById("successMessage");

// Load the page data
loadCustomers();
loadProducts();

// Retrieve all customers
async function loadCustomers() {

    try {

        const response = await apiFetch("/api/customers");

        if (!response.ok) {

            console.error("Unable to retrieve customers.");

            return;

        }

        const customers = await response.json();

        // Add each customer to the drop-down list
        customers.forEach(customer => {

            const option = document.createElement("option");

            option.value = customer.customerid;

            option.textContent =
                `${customer.firstname} ${customer.lastname} (${customer.email})`;

            customerSelect.appendChild(option);

        });

    }
    catch (error) {

        console.error("Unable to contact the server.", error);

    }

}


// Retrieve all products
async function loadProducts() {

    try {

        const response = await apiFetch("/api/products");

        if (!response.ok) {
            console.error("Unable to retrieve products.");
            return;
        }

        // Convert the response to JSON
        const products = await response.json();

        // Add each product to the drop-down list
        products.forEach(product => {

            const option = document.createElement("option");
            option.value = product.productcode;
            option.textContent = `${product.name} ${product.version}`;
            productSelect.appendChild(option);
        });
    }
    catch (error) {
        console.error("Unable to contact the server.", error);
    }
}


// Create a new incident
async function createIncident(event) {

    // Prevent the form from submitting normally
    event.preventDefault();

    // Hide any previous success message
    successPanel.classList.add("hidden");

    // Display the loading state
    createIncidentButton.disabled = true;
    createIncidentButton.textContent = "Creating...";

    try {

        const response = await apiFetch("/api/incidents", {
            method: "POST",
            body: JSON.stringify({
                customerID: customerSelect.value,
                productCode: productSelect.value,
                title: titleInput.value.trim(),
                description: descriptionInput.value.trim()
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data.message);
            return;
        }

        // Display the confirmation message
        successMessage.textContent = `Incident was successfully created and assigned Incident ID #${data.incidentID}.`;
        successPanel.classList.remove("hidden");

        // Clear the form
        customerSelect.selectedIndex = 0;
        productSelect.selectedIndex = 0;
        titleInput.value = "";
        descriptionInput.value = "";
    }
    catch (error) {
        console.error("Unable to contact the server.", error);
    }
    finally {
        // Restore the button
        createIncidentButton.disabled = false;
        createIncidentButton.textContent = "Create Incident";
    }
}

// Handle the Create Incident button
createIncidentButton.addEventListener("click", createIncident);