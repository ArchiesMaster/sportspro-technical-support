const techniciansTable = document.getElementById("techniciansTable");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const addTechnicianButton = document.getElementById("addTechnicianButton");
const technicianMessage = document.getElementById("technicianMessage");

// Load all technicians from the server and display them in the table
async function loadTechnicians() {

    try {

        // Request the list of technicians from the Express server
        const response = await apiFetch("/api/technicians");

        // Convert the JSON response into a JavaScript array
        const technicians = await response.json();

        // Store the HTML for each table row
        let tableRows = "";

        // Create a table row for every technician returned by the server
        for (const technician of technicians) {

            tableRows += `
                <tr>
                    <td>${technician.firstname}</td>
                    <td>${technician.lastname}</td>
                    <td>${technician.email}</td>
                    <td>${technician.phone}</td>
                    <td class="action-column">
                        <button class="btn btn-danger" data-tech-id="${technician.techid}">Delete</button>
                    </td>
                </tr>
            `;

        }

        // Display all generated rows in the table body
        techniciansTable.innerHTML = tableRows;

    }
    catch (error) {

        console.error("Error loading technicians:", error);

        technicianMessage.textContent = "Unable to contact the server.";
        technicianMessage.className = "success-message error";

    }

}

// Load the technicians when the page first opens
loadTechnicians();


// Add a new technician when the button is clicked
addTechnicianButton.addEventListener("click", async () => {

    // Read the values entered into the form
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;

    // Ensure all required fields have been provided
    if (!firstName || !lastName || !email || !phone || !password) {

        technicianMessage.textContent = "Please complete all fields.";
        technicianMessage.className = "success-message error";

        return;

    }

    // Clear any previous message
    technicianMessage.textContent = "";

    // Disable the Add Technician button while the request is being processed
    addTechnicianButton.disabled = true;
    addTechnicianButton.textContent = "Adding Technician...";

    try {

        // Send the new technician details to the server
        const response = await apiFetch("/api/technicians", {
            method: "POST",
            headers: {"Content-Type": "application/json"},

            // Convert JavaScript object into JSON
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                phone,
                password
            })
        });

        // Read the server's response message
        const result = await response.json();

        if (response.ok) {

            // Display a success message on page
            technicianMessage.textContent = result.message;
            technicianMessage.className = "success-message success";

            // Reload the table to display the new technician
            await loadTechnicians();

            // Clear the form ready for another technician
            firstNameInput.value = "";
            lastNameInput.value = "";
            emailInput.value = "";
            phoneInput.value = "";
            passwordInput.value = "";

            // Return the cursor to the first field
            firstNameInput.focus();

        }
        else {

            // Display any validation or server errors
            technicianMessage.textContent = result.message;
            technicianMessage.className = "success-message error";

        }

    }
    catch (error) {

        console.error("Error adding technician:", error);

        // Display an error if the server cannot be reached
        technicianMessage.textContent = "Unable to contact the server.";
        technicianMessage.className = "success-message error";

    }
    finally {

        // Re-enable the Add Technician button
        addTechnicianButton.disabled = false;
        addTechnicianButton.textContent = "Add Technician";

    }

});

// Listen for clicks anywhere inside the technicians table
techniciansTable.addEventListener("click", async (event) => {

    // Ignore clicks that are not on a Delete button
    if (!event.target.classList.contains("btn-danger")) {
        return;
    }

    // Get the technician ID stored in the button's data attribute
    const techID = event.target.dataset.techId;

    // Store the clicked Delete button
    const deleteButton = event.target;

    // Disable the button while the request is being processed
    deleteButton.disabled = true;
    deleteButton.textContent = "Deleting...";

    try {

        // Send a request to delete the selected technician
        const response = await apiFetch(`/api/technicians/${techID}`, {
            method: "DELETE"
        });

        // Read the server's response message
        const result = await response.json();

        if (response.ok) {

            // Display a success message and refresh the table
            technicianMessage.textContent = result.message;
            technicianMessage.className = "success-message success";

            await loadTechnicians();

        }
        else {

            // Display any errors returned by the server
            technicianMessage.textContent = result.message;
            technicianMessage.className = "success-message error";

        }

    }
    catch (error) {

        console.error("Error deleting technician:", error);

        // Display an error if the server cannot be reached
        technicianMessage.textContent = "Unable to contact the server.";
        technicianMessage.className = "success-message error";

    }
    finally {

        // Re-enable the Delete button
        deleteButton.disabled = false;
        deleteButton.textContent = "Delete";

    }

});