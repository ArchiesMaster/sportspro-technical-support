const database = require("../db/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Generate a JSON Web Token for the authenticated user
function generateToken(user) {

    return jwt.sign(
        {
            userID: user.userID,
            customerID: user.customerID,
            techID: user.techID,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

}

// Authenticate a user
async function login(req, res) {

    // Retrieve any validation errors
    const errors = validationResult(req);

    // Return the first validation error if any exist
    if (!errors.isEmpty()) {

        return res.status(400).json({
            message: errors.array()[0].msg
        });

    }

    // Retrieve the email and password from the request
    const {
        email,
        password
    } = req.body;

    try {

        // Find the user by email
        const result = await database.query(
            `SELECT *
             FROM users
             WHERE email = $1`,
            [email]
        );

        // Check whether a matching user exists and return an error if not
        if (result.rowCount === 0) {

            return res.status(401).json({
                message: "Invalid email or password."
            });

        }

        const user = result.rows[0];

        // Check whether the password is correct by comparing the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password."
            });

        }

        // Build a user object for the JWT
        const tokenUser = {
            userID: user.userid,
            customerID: user.customerid,
            techID: user.techid,
            role: user.role
        };

        // Generate a JSON Web Token for the authenticated user
        const token = generateToken(tokenUser);

        // Return a successful login response
        res.json({
            message: "Login successful.",
            role: user.role,
            token
        });

    }
    catch (error) {

        console.error("Error logging in:", error);

        res.status(500).json({
            message: "Unable to log in."
        });

    }

}

// Register a new user
async function register(req, res) {

    // Retrieve any validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({
            message: errors.array()[0].msg
        });

    }

    const {
        firstName,
        lastName,
        email,
        password,
        role,
        address,
        city,
        state,
        postalCode,
        countryCode,
        phone
    } = req.body;

    const client = await database.connect();

    try {

        await client.query("BEGIN");

        // Check whether the email already exists
        const existingUser = await client.query(
            `SELECT *
             FROM users
             WHERE email = $1`,
            [email]
        );

        if (existingUser.rowCount > 0) {

            // Restore the database state to before the transaction began
            await client.query("ROLLBACK");

            return res.status(400).json({
                message: "An account with this email address already exists."
            });

        }

        let customerID = null;
        let techID = null;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create customer
        if (role === "customer") {

            const customerResult = await client.query(

                `INSERT INTO customers
                (
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
                )
                VALUES
                ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                RETURNING customerID`,

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
                    hashedPassword
                ]
            );

            customerID = customerResult.rows[0].customerid;

        }

        // Create technician
        else if (role === "technician") {

            const technicianResult = await client.query(

                `INSERT INTO technicians
                (
                    firstName,
                    lastName,
                    email,
                    phone,
                    password
                )
                VALUES
                ($1,$2,$3,$4,$5)
                RETURNING techID`,

                [
                    firstName,
                    lastName,
                    email,
                    phone,
                    hashedPassword
                ]

            );

            techID = technicianResult.rows[0].techid;

        }


        // Create the user account
        await client.query(

            `INSERT INTO users
            (
                email,
                password,
                role,
                customerID,
                techID
            )
            VALUES
            ($1, $2, $3, $4, $5)`,

            [
                email,
                hashedPassword,
                role,
                customerID,
                techID
            ]

        );

        await client.query("COMMIT");

        res.status(201).json({
            message: "Registration successful."
        });

    }
    catch (error) {

        await client.query("ROLLBACK");

        console.error("Error registering user:", error);

        res.status(500).json({
            message: "Unable to register user."
        });

    }
    finally {

        client.release();

    }

}

// Refresh a JWT
async function refresh(req, res) {

    try {

        // Generate a new JWT using the authenticated user
        const token = generateToken(req.user);

        res.json({
            message: "Token refreshed.",
            token
        });

    }
    catch (error) {

        console.error("Error refreshing token:", error);

        res.status(500).json({
            message: "Unable to refresh token."
        });

    }

}

module.exports = {
    login,
    register,
    refresh
};