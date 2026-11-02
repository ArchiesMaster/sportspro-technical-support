// Selected incident
let selectedIncident = null;

const incidentsTable = document.getElementById("incidentsTable");
const assignmentPanel = document.getElementById("assignmentPanel");
const incidentID = document.getElementById("incidentID");
const incidentCustomer = document.getElementById("incidentCustomer");
const incidentProduct = document.getElementById("incidentProduct");
const incidentDateOpened = document.getElementById("incidentDateOpened");
const incidentTitle = document.getElementById("incidentTitle");
const incidentDescription = document.getElementById("incidentDescription");
const technicianSelect = document.getElementById("technician");
const assignButton = document.getElementById("assignButton");
const cancelButton = document.getElementById("cancelButton");

// Load the page data
loadIncidents();
loadTechnicians();

// Retrieve all unassigned incidents
async function loadIncidents() {

    try {

        const response = await apiFetch("/api/incidents/unassigned");

        if (!response.ok) {
            console.error("Unable to retrieve incidents.");
            return;
        }

        const incidents = await response.json();

        // Clear the table
        incidentsTable.innerHTML = "";

        // Hide the assignment panel until an incident is selected
        assignmentPanel.classList.add("hidden");

        selectedIncident = null;

        // Display a message if there are no unassigned incidents
        if (incidents.length === 0) {

            incidentsTable.innerHTML = `
                <tr>
                    <td colspan="6">
                        No unassigned incidents.
                    </td>
                </tr>
            `;

            return;

        }

        // Display each incident
        incidents.forEach(incident => {

            const row = document.createElement("tr");

            row.classList.add("clickable-row");

            row.innerHTML = `
                <td>${incident.incidentid}</td>
                <td>${incident.customer}</td>
                <td>${incident.productcode}</td>
                <td>${new Date(incident.dateopened).toLocaleDateString()}</td>
                <td>${incident.title}</td>
                <td>
                    <button class="btn btn-primary">
                        Select
                    </button>
                </td>
            `;

            // Select this incident
            row.querySelector("button").addEventListener("click", () => {
                loadIncident(incident);
            });

            incidentsTable.appendChild(row);

        });

    }
    catch (error) {
        console.error("Unable to contact the server.", error);
    }
}

// Display the selected incident
function loadIncident(incident) {

    // Store the selected incident for assignment
    selectedIncident = incident;

    // Populate the incident details panel
    incidentID.textContent = incident.incidentid;
    incidentCustomer.textContent = incident.customer;

    incidentProduct.textContent = `${incident.productcode} (${incident.productname} ${incident.version})`;

    incidentDateOpened.textContent = new Date(incident.dateopened).toLocaleDateString();

    incidentTitle.textContent = incident.title;
    incidentDescription.textContent = incident.description;

    // Display the assignment panel
    assignmentPanel.classList.remove("hidden");
}

// Retrieve all technicians
async function loadTechnicians() {

    try {
        // Request the list of technicians from the API
        const response = await apiFetch("/api/technicians");

        // Stop if the technicians could not be retrieved
        if (!response.ok) {
            console.error("Unable to retrieve technicians.");
            return;
        }

        // Convert the response to JSON
        const technicians = await response.json();

        // Populate the technician dropdown from the retrieved technicians
        technicians.forEach(technician => {
            const option = document.createElement("option");
            option.value = technician.techid;
            option.textContent = `${technician.firstname} ${technician.lastname} (${technician.email})`;
            technicianSelect.appendChild(option);
        });
    }
    catch (error) {
        console.error("Unable to contact the server.", error);
    }
}

// Assign the selected incident
async function assignIncident() {

    // Ensure an incident has been selected
    if (!selectedIncident) {
        console.error("No incident selected.");
        return;
    }

    // Ensure a technician has been selected
    if (!technicianSelect.value) {
        console.error("No technician selected.");
        return;
    }

    // Display the loading state
    assignButton.disabled = true;
    assignButton.textContent = "Assigning...";

    try {

        const response = await apiFetch(
            `/api/incidents/${selectedIncident.incidentid}/assign`,
            {
                method: "PUT",
                body: JSON.stringify({
                    techID: technicianSelect.value
                })
            }
        );

        if (!response.ok) {
            const data = await response.json();
            console.error(data.message);
            return;
        }

        // Reset the technician selection
        technicianSelect.selectedIndex = 0;

        // Reload the incident list
        await loadIncidents();

    }
    catch (error) {
        console.error("Unable to contact the server.", error);
    }
    finally {
        // Restore the button
        assignButton.disabled = false;
        assignButton.textContent = "Assign Incident";
    }
}

// Hide the assignment panel if the user cancels the selection
function cancelSelection() {
    selectedIncident = null;
    technicianSelect.selectedIndex = 0;
    assignmentPanel.classList.add("hidden");
}

// Event listeners
assignButton.addEventListener("click", assignIncident);
cancelButton.addEventListener("click",cancelSelection);