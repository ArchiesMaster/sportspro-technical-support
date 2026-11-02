// Get references to the page elements
const registerMessage = document.getElementById("registerMessage");
const registrationPanel = document.getElementById("registrationPanel");
const successPanel = document.getElementById("successPanel");
const successMessage = document.getElementById("successMessage");
const productInput = document.getElementById("product");
const registerButton = document.getElementById("registerButton");
const registerAnotherButton = document.getElementById("registerAnotherButton");

// Display the registration panel immediately
registrationPanel.classList.remove("hidden");

// Load the available products
loadProductsList();

// Register a product when the button is clicked
registerButton.addEventListener("click", registerProduct);

// Register another product when the button is clicked
registerAnotherButton.addEventListener("click", registerAnotherProduct);

// Retrieve the products and populate the dropdown
async function loadProductsList() {

    try {

        // Request the products from the server
        const response = await apiFetch("/api/products");

        if (!response.ok) {

            const error = await response.json();
            throw new Error(error.message);

        }

        // Convert the JSON response into a JavaScript array
        const products = await response.json();

        // Remove any existing options
        productInput.innerHTML = "";

        // Add the default option
        const defaultOption = document.createElement("option");

        defaultOption.value = "";
        defaultOption.textContent = "-- Select a Product --";

        productInput.appendChild(defaultOption);

        // Add each product to the dropdown
        for (const product of products) {

            const option = document.createElement("option");

            option.value = product.productcode;
            option.textContent = `${product.name} ${product.version}`;

            productInput.appendChild(option);

        }

    }
    catch (error) {

        console.error("Error retrieving products:", error);

        registerMessage.textContent = error.message;
        registerMessage.className = "success-message error";

    }

}

// Register the selected product
async function registerProduct() {

    // Clear any previous message
    registerMessage.textContent = "";
    registerMessage.className = "success-message";

    // Ensure a product has been selected
    if (!productInput.value) {

        registerMessage.textContent = "Please select a product.";
        registerMessage.className = "success-message error";

        return;

    }

    // Get the selected product name for the success message
    const productName = productInput.options[productInput.selectedIndex].text;

    // Disable the Register button while the request is being processed
    registerButton.disabled = true;
    registerButton.textContent = "Registering Product...";

    try {

        const response = await apiFetch("/api/registrations",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productCode: productInput.value
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {

            throw new Error(result.message);

        }

        // Hide the registration panel
        registrationPanel.classList.add("hidden");

        // Display the success message
        successMessage.textContent = `${productName} was registered successfully.`;

        successPanel.classList.remove("hidden");

    }
    catch (error) {

        console.error("Error registering product:", error);

        registerMessage.textContent = error.message;
        registerMessage.className = "success-message error";

    }
    finally {

        // Re-enable the Register button
        registerButton.disabled = false;
        registerButton.textContent = "Register Product";

    }

}

// Reset the page ready to register another product
function registerAnotherProduct() {

    successPanel.classList.add("hidden");

    productInput.selectedIndex = 0;

    registerMessage.textContent = "";

    registrationPanel.classList.remove("hidden");

}