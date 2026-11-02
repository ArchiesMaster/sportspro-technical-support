const database = require("../db/database");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

// Retrieve all technicians
async function getTechnicians(req, res) {

    try {

        // Retrieve all technicians from the database
        const result = await database.query(
            `SELECT *
             FROM technicians
             ORDER BY lastName, firstName`
        );

        // Send the technicians back to the client
        res.json(result.rows);

    }
    catch (error) {

        console.error("Error retrieving technicians:", error);

        // Return an error if the technicians cannot be retrieved
        res.status(500).json({
            message: "Failed to retrieve technicians."
        });

    }

}

// Add a new technician
async function addTechnician(req, res) {

    // Retrieve any validation errors
    const errors = validationResult(req);

    // Return the first validation error, if any exist
    if (!errors.isEmpty()) {

        return res.status(400).json({
            message: errors.array()[0].msg
        });

    }

    // Retrieve the technician details from the request body
    const {
        firstName,
        lastName,
        email,
        phone,
        password
    } = req.body;

    try {

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert the new technician and retrieve the generated technician ID
        const technicianResult = await database.query(
            `INSERT INTO technicians
                (firstName, lastName, email, phone, password)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING techID`,
            [
                firstName,
                lastName,
                email,
                phone,
                hashedPassword
            ]
        );

        // Retrieve the generated technician ID so that we can create the matching user account
        const techID = technicianResult.rows[0].techid;

        // Create the matching user account
        await database.query(
            `INSERT INTO users
                (email, password, role, techID)
             VALUES ($1, $2, $3, $4)`,
            [
                email,
                hashedPassword,
                "technician",
                techID
            ]
        );

        // Send a success message back to the client
        res.json({
            message: "Technician added successfully."
        });

    }
    catch (error) {

        console.error("Error adding technician:", error);

        // Error code 23505 indicates a duplicate email
        if (error.code === "23505") {

            return res.status(409).json({
                message: "A technician with that email already exists."
            });

        }

        // Return an error if the technician could not be added
        res.status(500).json({
            message: "Failed to add technician."
        });

    }

}

// Delete an existing technician
async function deleteTechnician(req, res) {

    // Retrieve the technician ID from the URL parameter
    const { id } = req.params;

    try {

        // Delete the matching user account first
        await database.query(
            `DELETE
             FROM users
             WHERE techID = $1`,
            [id]
        );

        // Delete the matching technician
        const result = await database.query(
            `DELETE
             FROM technicians
             WHERE techID = $1`,
            [id]
        );

        // If no rows were deleted, the technician does not exist
        if (result.rowCount === 0) {

            return res.status(404).json({
                message: "Technician not found."
            });

        }

        // Send a success message back to the client
        res.json({
            message: "Technician successfully deleted."
        });

    }
    catch (error) {

        console.error("Error deleting technician:", error);

        // Return an error if the delete operation fails
        res.status(500).json({
            message: "Failed to delete technician."
        });

    }

}

module.exports = {
    getTechnicians,
    addTechnician,
    deleteTechnician
};