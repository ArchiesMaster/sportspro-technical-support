// Get references to the page elements
const productsTable = document.getElementById("productsTable");
const codeInput = document.getElementById("code");
const nameInput = document.getElementById("name");
const versionInput = document.getElementById("version");
const releaseDateInput = document.getElementById("releaseDate");
const addProductButton = document.getElementById("addProductButton");
const productMessage = document.getElementById("productMessage");

// Load all products from the server and display them in the table
async function loadProducts() {

    try {

        // Request the list of products from the Express server
        const response = await apiFetch("/api/products");

        // Convert the JSON response into a JavaScript array
        const products = await response.json();

        // Store the HTML for each table row
        let tableRows = "";

        // Create a table row for every product returned by the server
        for (const product of products) {

            tableRows += `
                <tr>
                    <td>${product.productcode}</td>
                    <td>${product.name}</td>
                    <td>${product.version}</td>
                    <td>${product.releasedate.split("T")[0]}</td>
                    <td class="action-column">
                        <button class="btn btn-danger" data-product-code="${product.productcode}">Delete</button>
                    </td>
                </tr>
            `;

        }

        // Display all generated rows in the table body
        productsTable.innerHTML = tableRows;

    }
    catch (error) {

        console.error("Error loading products:", error);

        productMessage.textContent = "Unable to contact the server.";
        productMessage.className = "success-message error";

    }

}

// Load the products when the page first opens
loadProducts();

// Add a new product when the button is clicked
addProductButton.addEventListener("click", async () => {

    // Read the values entered into the form
    const productCode = codeInput.value.trim();
    const productName = nameInput.value.trim();
    const productVersion = versionInput.value;
    const releaseDate = releaseDateInput.value;

    // Ensure all required fields have been provided
    if (!productCode || !productName || !productVersion || !releaseDate) {

        productMessage.textContent = "Please complete all fields.";
        productMessage.className = "success-message error";

        return;

    }

    // Disable the Add Product button while the request is being processed
    addProductButton.disabled = true;
    addProductButton.textContent = "Adding Product...";

    try {

        // Send the new product details to the server
        const response = await apiFetch("/api/products", {
            method: "POST",
            headers: {"Content-Type": "application/json"},

            // Convert JavaScript object into JSON
            body: JSON.stringify({
                productCode,
                productName,
                productVersion,
                releaseDate
            })
        });

        // Read the server's response message
        const result = await response.json();

        if (response.ok) {

            // Display a success message on page
            productMessage.textContent = result.message;
            productMessage.className = "success-message success";

            // Reload the table to display the new product
            await loadProducts();

            // Clear the form ready for another product
            codeInput.value = "";
            nameInput.value = "";
            versionInput.value = "";
            releaseDateInput.value = "";

            // Return the cursor to the first field
            codeInput.focus();

        }
        else {

            // Display any validation or server errors
            productMessage.textContent = result.message;
            productMessage.className = "success-message error";

        }

    }
    catch (error) {

        console.error("Error adding product:", error);

        // Display an error if the server cannot be reached
        productMessage.textContent = "Unable to contact the server.";
        productMessage.className = "success-message error";

    }
    finally {

        // Re-enable the Add Product button
        addProductButton.disabled = false;
        addProductButton.textContent = "Add Product";

    }

});

// Listen for clicks anywhere inside the products table
productsTable.addEventListener("click", async (event) => {

    // Ignore clicks that are not on a Delete button
    if (!event.target.classList.contains("btn-danger")) {
        return;
    }

    // Get the product code stored in the button's data attribute
    const productCode = event.target.dataset.productCode;

    // Store the clicked Delete button
    const deleteButton = event.target;

    // Disable the button while the request is being processed
    deleteButton.disabled = true;
    deleteButton.textContent = "Deleting...";

    try {

        // Send a request to delete the selected product
        const response = await apiFetch(`/api/products/${productCode}`, {
            method: "DELETE"
        });

        // Read the server's response message
        const result = await response.json();

        if (response.ok) {

            // Display a success message and refresh the table
            productMessage.textContent = result.message;
            productMessage.className = "success-message success";

            await loadProducts();

        }
        else {

            // Display any errors returned by the server
            productMessage.textContent = result.message;
            productMessage.className = "success-message error";

        }

    }
    catch (error) {

        console.error("Error deleting product:", error);

        // Display an error if the server cannot be reached
        productMessage.textContent = "Unable to contact the server.";
        productMessage.className = "success-message error";

    }
    finally {

        // Re-enable the Delete button
        deleteButton.disabled = false;
        deleteButton.textContent = "Delete";

    }

});