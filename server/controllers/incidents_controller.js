const database = require("../db/database");
const { validationResult } = require("express-validator");

// Retrieve all incidents
async function getIncidents(req, res) {

    try {

        // Retrieve every incident together with the customer,
        // product and assigned technician details
        const result = await database.query(

            `SELECT
                i.incidentID,
                c.firstName || ' ' || c.lastName AS customer,
                p.productCode,
                p.name AS productName,
                p.version,
                t.firstName || ' ' || t.lastName AS technician,
                i.dateOpened,
                i.dateClosed,
                i.title,
                i.description
            FROM incidents i
            INNER JOIN customers c ON i.customerID = c.customerID
            INNER JOIN products p ON i.productCode = p.productCode
            LEFT JOIN technicians t ON i.techID = t.techID
            ORDER BY i.incidentID`
        );

        // Return the incidents
        res.json(result.rows);

    }
    catch (error) {

        console.error("Error retrieving incidents:", error);

        res.status(500).json({
            message: "Unable to retrieve incidents."
        });

    }

}

// Retrieve a single incident
async function getIncident(req, res) {

    // Retrieve the incident ID from the URL
    const { id } = req.params;

    try {

        // Retrieve the selected incident together with the related
        // customer, product and technician details
        const result = await database.query(

            `SELECT
                i.incidentID,
                i.customerID,
                i.productCode,
                i.techID,
                i.dateOpened,
                i.dateClosed,
                i.title,
                i.description,
                c.firstName || ' ' || c.lastName AS customer,
                c.email,
                p.name AS productName,
                p.version,
                t.firstName || ' ' || t.lastName AS technician
            FROM incidents i
            INNER JOIN customers c ON i.customerID = c.customerID
            INNER JOIN products p ON i.productCode = p.productCode
            LEFT JOIN technicians t ON i.techID = t.techID
            WHERE i.incidentID = $1`, [id]
        );

        // Ensure the incident exists
        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Incident not found."
            });

        }

        // Return the incident
        res.json(result.rows[0]);

    }
    catch (error) {

        console.error("Error retrieving incident:", error);

        res.status(500).json({
            message: "Unable to retrieve incident."
        });

    }

}

// Create a new incident
async function createIncident(req, res) {

    // Retrieve any validation errors
    const errors = validationResult(req);

    // Return the first validation error, if any exist
    if (!errors.isEmpty()) {

        return res.status(400).json({
            message: errors.array()[0].msg
        });

    }

    // Retrieve the incident details
    const {
        customerID,
        productCode,
        title,
        description
    } = req.body;

    try {

        // Create the incident
        const result = await database.query(

            `INSERT INTO incidents
            (
                customerID,
                productCode,
                title,
                description
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING incidentID`,

            [
                customerID,
                productCode,
                title,
                description
            ]

        );

        // Return the new incident ID
        res.status(201).json({

            message: "Incident created successfully.",
            incidentID: result.rows[0].incidentid

        });

    }
    catch (error) {

        console.error("Error creating incident:", error);

        res.status(500).json({
            message: "Unable to create incident."
        });

    }

}

// Retrieve all unassigned incidents
async function getUnassignedIncidents(req, res) {

    try {

        // Retrieve all incidents that have not yet been assigned
        const result = await database.query(

            `SELECT
                i.incidentID,
                i.customerID,
                c.firstName || ' ' || c.lastName AS customer,
                i.productCode,
                p.name AS productName,
                p.version,
                i.dateOpened,
                i.title,
                i.description
             FROM incidents i
             INNER JOIN customers c
                ON i.customerID = c.customerID
             INNER JOIN products p
                ON i.productCode = p.productCode
             WHERE i.techID IS NULL
             ORDER BY i.dateOpened`

        );

        // Return the unassigned incidents
        res.json(result.rows);

    }
    catch (error) {

        console.error("Error retrieving unassigned incidents:", error);

        res.status(500).json({
            message: "Unable to retrieve unassigned incidents."
        });

    }

}

// Retrieve all incidents assigned to the logged-in technician
async function getAssignedIncidents(req, res) {

    // Retrieve the logged-in technician ID
    const techID = req.user.techID;

    try {

        // Retrieve the technician's assigned incidents
        const result = await database.query(

            `SELECT
                i.incidentID,
                c.firstName || ' ' || c.lastName AS customer,
                c.email,
                p.productCode,
                p.name AS productName,
                p.version,
                i.dateOpened,
                i.dateClosed,
                i.title,
                i.description
             FROM incidents i
             INNER JOIN customers c
                ON i.customerID = c.customerID
             INNER JOIN products p
                ON i.productCode = p.productCode
             WHERE i.techID = $1
             ORDER BY i.dateOpened`,

            [techID]

        );

        // Return the incidents
        res.json(result.rows);

    }
    catch (error) {

        console.error("Error retrieving assigned incidents:", error);

        res.status(500).json({
            message: "Unable to retrieve assigned incidents."
        });

    }

}

// Assign an incident to a technician
async function assignIncident(req, res) {

    // Retrieve any validation errors
    const errors = validationResult(req);

    // Return the first validation error, if any exist
    if (!errors.isEmpty()) {

        return res.status(400).json({
            message: errors.array()[0].msg
        });

    }

    // Retrieve the incident ID
    const { id } = req.params;

    // Retrieve the selected technician
    const { techID } = req.body;

    try {

        // Assign the technician to the incident
        const result = await database.query(

            `UPDATE incidents
             SET techID = $1
             WHERE incidentID = $2`,

            [
                techID,
                id
            ]

        );

        // Ensure the incident exists
        if (result.rowCount === 0) {

            return res.status(404).json({
                message: "Incident not found."
            });

        }

        // Return a success message
        res.json({
            message: "Incident assigned successfully."
        });

    }
    catch (error) {

        console.error("Error assigning incident:", error);

        res.status(500).json({
            message: "Unable to assign incident."
        });

    }

}

// Update an assigned incident
async function updateIncident(req, res) {

    // Retrieve any validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({
            message: errors.array()[0].msg
        });

    }

    // Retrieve the incident ID
    const { id } = req.params;

    // Retrieve the updated details
    const {
        description,
        closeIncident
    } = req.body;

    try {

        // Update the incident
        const result = await database.query(

            `UPDATE incidents
             SET
                description = $1,
                dateClosed =
                    CASE
                        WHEN $2 THEN CURRENT_TIMESTAMP
                        ELSE NULL
                    END
             WHERE incidentID = $3
             AND techID = $4`,

            [
                description,
                closeIncident,
                id,
                req.user.techID
            ]

        );

        // Ensure the incident exists
        if (result.rowCount === 0) {

            return res.status(404).json({
                message: "Incident not found."
            });

        }

        // Return success
        res.json({
            message: "Incident updated successfully."
        });

    }
    catch (error) {

        console.error("Error updating incident:", error);

        res.status(500).json({
            message: "Unable to update incident."
        });

    }

}

module.exports = {
    getIncidents,
    getIncident,
    getUnassignedIncidents,
    getAssignedIncidents,
    createIncident,
    assignIncident,
    updateIncident
};