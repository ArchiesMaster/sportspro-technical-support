// Selected incident
let selectedIncident = null;

const incidentsTable = document.getElementById("incidentsTable");
const updatePanel = document.getElementById("updatePanel");
const incidentID = document.getElementById("incidentID");
const incidentCustomer = document.getElementById("incidentCustomer");
const incidentProduct = document.getElementById("incidentProduct");
const incidentDateOpened = document.getElementById("incidentDateOpened");
const incidentDateClosed = document.getElementById("incidentDateClosed");
const incidentTitle = document.getElementById("incidentTitle");
const descriptionInput = document.getElementById("description");
const closeIncidentCheckbox = document.getElementById("closeIncident");
const updateButton = document.getElementById("updateButton");
const cancelButton = document.getElementById("cancelButton");
const successPanel = document.getElementById("successPanel");
const successMessage = document.getElementById("successMessage");

// Load the page
loadIncidents();

// Retrieve the logged-in technician's incidents
async function loadIncidents() {

    try {

        const response = await apiFetch("/api/incidents/assigned");

        if (!response.ok) {

            console.error("Unable to retrieve assigned incidents.");

            return;

        }

        const incidents = await response.json();

        incidentsTable.innerHTML = "";

        updatePanel.classList.add("hidden");

        selectedIncident = null;

        if (incidents.length === 0) {

            incidentsTable.innerHTML = `
                <tr>
                    <td colspan="6">
                        No assigned incidents.
                    </td>
                </tr>
            `;

            return;

        }

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

    selectedIncident = incident;

    incidentID.textContent = incident.incidentid;

    incidentCustomer.textContent = `${incident.customer} (${incident.email})`;

    incidentProduct.textContent = `${incident.productcode} (${incident.productname} ${incident.version})`;

    incidentDateOpened.textContent = new Date(incident.dateopened).toLocaleDateString();

    incidentDateClosed.textContent = incident.dateclosed ? new Date(incident.dateclosed).toLocaleDateString() : "-";    

    incidentTitle.textContent = incident.title;

    descriptionInput.value = incident.description;

    closeIncidentCheckbox.checked = incident.dateclosed !== null;

    successPanel.classList.add("hidden");

    updatePanel.classList.remove("hidden");

}

// Update the incident
async function updateIncident() {

    if (!selectedIncident) {
        console.error("No incident selected.");
        return;

    }

    updateButton.disabled = true;
    updateButton.textContent = "Updating...";

    try {

        const response = await apiFetch(

            `/api/incidents/${selectedIncident.incidentid}`,
            {
                method: "PUT",
                body: JSON.stringify({
                    description: descriptionInput.value.trim(),
                    closeIncident: closeIncidentCheckbox.checked
                })

            }

        );

        const data = await response.json();

        if (!response.ok) {

            console.error(data.message);

            return;

        }

        successMessage.textContent = `Incident #${selectedIncident.incidentid} was updated successfully.`;
        successPanel.classList.remove("hidden");

        await loadIncidents();

    }
    catch (error) {
        console.error("Unable to contact the server.", error);
    }
    finally {
        updateButton.disabled = false;
        updateButton.textContent = "Update Incident";
    }

}


// Cancel the update
function cancelUpdate() {

    selectedIncident = null;
    updatePanel.classList.add("hidden");
    successPanel.classList.add("hidden");

}


// Event listeners
updateButton.addEventListener("click", updateIncident);

cancelButton.addEventListener("click", cancelUpdate);