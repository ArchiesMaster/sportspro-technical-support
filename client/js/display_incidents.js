const incidentsTable = document.getElementById("incidentsTable");
const incidentDetailsPanel = document.getElementById("incidentDetailsPanel");
const incidentHeading = document.getElementById("incidentHeading");
const incidentCustomer = document.getElementById("incidentCustomer");
const incidentProduct = document.getElementById("incidentProduct");
const incidentTechnician = document.getElementById("incidentTechnician");
const incidentDateOpened = document.getElementById("incidentDateOpened");
const incidentDateClosed = document.getElementById("incidentDateClosed");
const incidentTitle = document.getElementById("incidentTitle");
const incidentDescription = document.getElementById("incidentDescription");

// Load all incidents when the page opens
loadIncidents();


// Retrieve every incident
async function loadIncidents() {

    try {

        const response = await apiFetch("/api/incidents");

        if (!response.ok) {

            console.error("Unable to retrieve incidents.");
            return;

        }

        const incidents = await response.json();

        displayIncidents(incidents);

    }
    catch (error) {

        console.error("Unable to contact the server.", error);

    }

}


// Populate the incidents table
function displayIncidents(incidents) {

    // Clear the existing table
    incidentsTable.innerHTML = "";
    incidentDetailsPanel.classList.add("hidden");

    incidents.forEach(incident => {

        const row = document.createElement("tr");

        row.classList.add("clickable-row");
        row.dataset.incidentId = incident.incidentid;

        row.innerHTML = `
            <td>${incident.incidentid}</td>
            <td>${incident.customer}</td>
            <td>${incident.productcode}</td>
            <td>${incident.technician ?? "Unassigned"}</td>
            <td>${formatDate(incident.dateopened)}</td>
            <td>${incident.dateclosed ? formatDate(incident.dateclosed) : "-"}</td>
            <td>${incident.title}</td>
        `;

        incidentsTable.appendChild(row);

    });

}


// Retrieve a single incident
async function loadIncident(incidentID) {

    try {

        const response = await apiFetch(`/api/incidents/${incidentID}`);

        if (!response.ok) {

            console.error("Unable to retrieve incident.");

            return;

        }

        const incident = await response.json();

        displayIncident(incident);

    }
    catch (error) {

        console.error("Unable to contact the server.", error);

    }

}


// Display the selected incident
function displayIncident(incident) {

    incidentHeading.textContent = `Incident #${incident.incidentid} Details`;

    incidentCustomer.textContent = `${incident.customer} (${incident.email})`;

    incidentProduct.textContent = `${incident.productcode} (${incident.productname} ${incident.version})`;

    incidentTechnician.textContent = incident.technician ?? "Unassigned";

    incidentDateOpened.textContent = formatDate(incident.dateopened);

    incidentDateClosed.textContent = incident.dateclosed ? formatDate(incident.dateclosed) : "-";

    incidentTitle.textContent = incident.title;

    incidentDescription.textContent = incident.description;

    // Display the incident details panel
    incidentDetailsPanel.classList.remove("hidden");

}


// Format database date for display
function formatDate(date) {

    if (!date) {
        return "-";
    }

    return new Date(date).toLocaleDateString();

}


// Handle clicks on incident rows
incidentsTable.addEventListener("click", function (event) {

        const row = event.target.closest("tr");

        if (!row) {
            return;
        }

        // Remove the previous selection
        document.querySelectorAll(".selected-row").forEach(row => row.classList.remove("selected-row"));

        // Highlight the selected row
        row.classList.add("selected-row");

        // Retrieve the selected incident
        loadIncident(row.dataset.incidentId);

    }
);