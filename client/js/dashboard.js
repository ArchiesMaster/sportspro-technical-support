// Redirect unauthenticated users to the login page
if (!isLoggedIn()) {
    window.location.href = "login.html";
}

// Dashboard elements
const adminSection = document.getElementById("adminSection");
const technicianSection = document.getElementById("technicianSection");
const customerSection = document.getElementById("customerSection");
const dashboardStats = document.getElementById("dashboardStats");

// Display loading state
dashboardStats.innerHTML = `<p>Loading dashboard...</p>`;

// Load the dashboard
loadDashboard();

// Retrieve the dashboard information
async function loadDashboard() {

    // Determine the logged-in user's role
    const role = getRole();

    // Hide all menu sections
    adminSection.classList.add("hidden");
    technicianSection.classList.add("hidden");
    customerSection.classList.add("hidden");

    // Show the correct menu section based on the user's role
    switch (role) {

        case "admin":
            adminSection.classList.remove("hidden");
            break;

        case "technician":
            technicianSection.classList.remove("hidden");
            break;

        case "customer":
            customerSection.classList.remove("hidden");
            break;

    }

    try {
        // Retrieve the dashboard data from the API
        const response = await apiFetch("/api/dashboard");

        // Convert the response to JSON
        const data = await response.json();

        if (!response.ok) {

            dashboardStats.innerHTML = `<p>${data.message}</p>`;

            return;

        }

        // Display the dashboard contents
        displayDashboard(data);

    }
    catch (error) {

        console.error(error);
        dashboardStats.innerHTML = `<p>Unable to load dashboard.</p>`;

    }

}

// Display the dashboard statistics
function displayDashboard(data) {

    const stats = data.stats;

    // Display administrator dashboard statistics
    if (data.role === "admin") {

        dashboardStats.innerHTML = `

            <div class="detail-row">
                <div class="detail-label">Customers</div>
                <div class="detail-value">${stats.customers}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Technicians</div>
                <div class="detail-value">${stats.technicians}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Products</div>
                <div class="detail-value">${stats.products}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Registrations</div>
                <div class="detail-value">${stats.registrations}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Open Incidents</div>
                <div class="detail-value">${stats.openincidents}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Closed Incidents</div>
                <div class="detail-value">${stats.closedincidents}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Unassigned Incidents</div>
                <div class="detail-value">${stats.unassignedincidents}</div>
            </div>

        `;

    }

    // Display technician dashboard statistics
    else if (data.role === "technician") {

        dashboardStats.innerHTML = `

            <div class="detail-row">
                <div class="detail-label">Assigned Incidents</div>
                <div class="detail-value">${stats.assignedincidents}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Open Incidents</div>
                <div class="detail-value">${stats.openincidents}</div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Closed Incidents</div>
                <div class="detail-value">${stats.closedincidents}</div>
            </div>

        `;

    }

    // Display customer dashboard statistics
    else if (data.role === "customer") {

        // Build the registered products list
        let productsHTML = "";

        // Display a message if there are no registered products
        if (data.products.length === 0) {

            productsHTML = "<li>No registered products.</li>";

        }
        // Display the list of registered products
        else {

            data.products.forEach(product => {

                productsHTML += `
                    <li>
                        ${product.name} (Version ${product.version})    
                    </li>
                `;

            });

        }

        // Build the open incidents list
        let incidentsHTML = "";

        // Display a message if there are no open incidents
        if (data.incidents.length === 0) {
            incidentsHTML = "<li>No open incidents.</li>";
        }

        // Display the list of open incidents
        else {

            data.incidents.forEach(incident => {

                incidentsHTML += `
                    <li>${incident.title}</li>
                `;

            });

        }

        dashboardStats.innerHTML = `

            <div class="detail-row">
                <div class="detail-label">Registered Products</div>
                <div class="detail-value">${stats.registeredproducts}</div>
            </div>

            <ul class="menu-list">
                ${productsHTML}
            </ul>

            <div class="detail-row">
                <div class="detail-label">Open Incidents</div>
                <div class="detail-value">${stats.openincidents}</div>
            </div>

            <ul class="menu-list">
                ${incidentsHTML}
            </ul>

        `;
    }
}