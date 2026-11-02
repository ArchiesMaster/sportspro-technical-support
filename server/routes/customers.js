const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorise = require("../middleware/authorise");
const { body } = require("express-validator");

const {
    getCustomers,
    getCustomerByEmail,
    searchCustomers,
    getCustomer,
    updateCustomer
} = require("../controllers/customers_controller");

// Retrieve all customers
router.get(
    "/",
    authenticate,
    authorise(["admin"]),
    getCustomers
);

// Retrieve a customer by email
router.get(
    "/login",
    authenticate,
    authorise(["admin"]),
    getCustomerByEmail
);

// Search for customers by last name
router.get(
    "/search",
    authenticate,
    authorise(["admin"]),
    searchCustomers
);

// Retrieve a single customer
router.get(
    "/:id",
    authenticate,
    authorise(["admin"]),
    getCustomer
);

// Update an existing customer
router.put(
    "/:id",
    authenticate,
    authorise(["admin"]),

    [
        // Ensure a first name has been entered
        body("firstName").trim().notEmpty().withMessage("Please enter a first name."),

        // Ensure a last name has been entered
        body("lastName").trim().notEmpty().withMessage("Please enter a last name."),

        // Ensure an address has been entered
        body("address").trim().notEmpty().withMessage("Please enter an address."),

        // Ensure a city has been entered
        body("city").trim().notEmpty().withMessage("Please enter a city."),

        // Ensure a state has been entered
        body("state").trim().notEmpty().withMessage("Please enter a state."),

        // Ensure a postal code has been entered
        body("postalCode").trim().notEmpty().withMessage("Please enter a postal code."),

        // Ensure a country has been selected
        body("countryCode").trim().notEmpty().withMessage("Please select a country."),

        // Ensure a phone number has been entered
        body("phone").trim().notEmpty().withMessage("Please enter a phone number."),

        // Ensure a valid email address has been entered
        body("email").trim().isEmail().withMessage("Please enter a valid email address."),

        // Ensure a password has been entered
        body("password").trim().notEmpty().withMessage("Please enter a password.")
    ],

    updateCustomer
);

module.exports = router;