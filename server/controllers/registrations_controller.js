const database = require("../db/database");
const { validationResult } = require("express-validator");

// Register a product for the logged in customer
async function registerProduct(req, res) {

    // Retrieve any validation errors
    const errors = validationResult(req);

    // Return the first validation error, if any exist
    if (!errors.isEmpty()) {

        return res.status(400).json({
            message: errors.array()[0].msg
        });

    }

    try {

        // Retrieve the selected product
        const { productCode } = req.body;

        // Retrieve the logged in customer's ID
        const userResult = await database.query(
            `SELECT customerID
             FROM users
             WHERE userID = $1`,
            [req.user.userID]
        );

        // Ensure the logged in user is linked to a customer
        if (userResult.rowCount === 0 || !userResult.rows[0].customerid) {

            return res.status(403).json({
                message: "No customer account is associated with this user."
            });

        }

        // Retrieve the customer ID
        const customerID = userResult.rows[0].customerid;

        // Insert the registration into the database
        await database.query(
            `INSERT INTO registrations
                (customerID, productCode)
             VALUES ($1, $2)`,
            [
                customerID,
                productCode
            ]
        );

        // Return a success response
        res.status(201).json({
            message: "Product registered successfully."
        });

    }
    catch (error) {

        console.error("Error registering product:", error);

        // Error code 23505 indicates a duplicate registration
        if (error.code === "23505") {

            return res.status(409).json({
                message: "This product has already been registered."
            });

        }

        // Return an error if the registration fails
        res.status(500).json({
            message: "Unable to register product."
        });

    }

}

module.exports = {
    registerProduct
};