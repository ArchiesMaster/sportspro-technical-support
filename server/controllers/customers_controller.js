const database = require("../db/database");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

// Retrieve all customers
async function getCustomers(req, res) {

    try {

        // Retrieve every customer
        const result = await database.query(

            `SELECT
                customerID,
                firstName,
                lastName,
                email
             FROM customers
             ORDER BY lastName, firstName`

        );

        // Return the customers
        res.json(result.rows);

    }
    catch (error) {

        console.error("Error retrieving customers:", error);

        res.status(500).json({
            message: "Unable to retrieve customers."
        });

    }

}

// Retrieve a customer by email
async function getCustomerByEmail(req, res) {

    // Retrieve the email entered by the customer
    const { email } = req.query;

    try {

        // Search for the customer
        const result = await database.query(
            `SELECT customerID,
                    firstName,
                    lastName
             FROM customers
             WHERE email = $1`,
            [email]
        );

        // If the customer was not found
        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Customer not found."
            });

        }

        // Return the customer
        res.json(result.rows[0]);

    }
    catch (error) {

        console.error("Error retrieving customer:", error);

        res.status(500).json({
            message: "Unable to retrieve customer."
        });

    }

}

// Search for customers by last name
async function searchCustomers(req, res) {

    // Read the last name entered by the user
    const { lastName } = req.query;

    try {

        // Search for customers whose last name matches the search text
        const result = await database.query(
            `SELECT customerID,
                    firstName,
                    lastName,
                    email,
                    phone
             FROM customers
             WHERE lastName ILIKE $1
             ORDER BY lastName, firstName`,
            [`%${lastName}%`]
        );

        // Return the matching customers
        res.json(result.rows);

    }
    catch (error) {

        console.error("Error searching customers:", error);

        res.status(500).json({
            message: "Unable to retrieve customers."
        });

    }

}

// Retrieve a single customer by their ID
async function getCustomer(req, res) {

    // Retrieve the customer ID from the URL
    const { id } = req.params;

    try {

        // Retrieve the matching customer
        const result = await database.query(
            `SELECT *
             FROM customers
             WHERE customerID = $1`,
            [id]
        );

        // If no customer was found, return an error
        if (result.rowCount === 0) {

            return res.status(404).json({
                message: "Customer not found."
            });

        }

        // Return the customer details
        res.json(result.rows[0]);

    }
    catch (error) {

        console.error("Error retrieving customer:", error);

        res.status(500).json({
            message: "Unable to retrieve customer."
        });

    }

}

// Update an existing customer
async function updateCustomer(req, res) {

    // Retrieve any validation errors
    const errors = validationResult(req);

    // Return the first validation error if any exist
    if (!errors.isEmpty()) {

        return res.status(400).json({
            message: errors.array()[0].msg
        });

    }

    // Retrieve the customer ID from the URL
    const { id } = req.params;

    // Retrieve the updated customer details
    const {
        firstName,
        lastName,
        address,
        city,
        state,
        postalCode,
        countryCode,
        phone,
        email,
        password
    } = req.body;

    try {

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the matching customer
        const result = await database.query(
            `UPDATE customers
             SET firstName = $1,
                 lastName = $2,
                 address = $3,
                 city = $4,
                 state = $5,
                 postalCode = $6,
                 countryCode = $7,
                 phone = $8,
                 email = $9,
                 password = $10
             WHERE customerID = $11`,
            [
                firstName,
                lastName,
                address,
                city,
                state,
                postalCode,
                countryCode,
                phone,
                email,
                hashedPassword,
                id
            ]
        );

        // If no customer exists with that ID
        if (result.rowCount === 0) {

            return res.status(404).json({
                message: "Customer not found."
            });

        }

        // Update the matching user account
        await database.query(
            `UPDATE users
             SET email = $1,
                 password = $2
             WHERE customerID = $3`,
            [
                email,
                hashedPassword,
                id
            ]
        );

        // Send a success message
        res.json({
            message: "Customer updated successfully."
        });

    }
    catch (error) {

        console.error("Error updating customer:", error);

        // Error code 23505 indicates a duplicate email
        if (error.code === "23505") {

            return res.status(409).json({
                message: "A customer with that email already exists."
            });

        }

        res.status(500).json({
            message: "Unable to update customer."
        });

    }

}

module.exports = {
    getCustomers,
    getCustomerByEmail,
    searchCustomers,
    getCustomer,
    updateCustomer
};