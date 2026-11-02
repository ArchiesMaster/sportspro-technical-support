const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authenticate = require("../middleware/authenticate");
const authorise = require("../middleware/authorise");

const {
    getIncidents,
    getIncident,
    getUnassignedIncidents,
    getAssignedIncidents,
    createIncident,
    assignIncident,
    updateIncident
} = require("../controllers/incidents_controller");



// Retrieve all incidents
router.get(
    "/",
    authenticate,
    authorise(["admin", "technician"]),
    getIncidents
);

// Retrieve all unassigned incidents
router.get(
    "/unassigned",
    authenticate,
    authorise(["admin"]),
    getUnassignedIncidents
);

// Retrieve incidents assigned to the logged-in technician
router.get(
    "/assigned",
    authenticate,
    authorise(["technician"]),
    getAssignedIncidents
);

// Retrieve a single incident
router.get(
    "/:id",
    authenticate,
    authorise(["admin", "technician"]),
    getIncident
);

// Create a new incident
router.post(
    "/",
    authenticate,
    authorise(["admin"]),

    [
        // Validate the customer
        body("customerID").isInt({ min: 1 }).withMessage("Please select a customer."),

        // Validate the product
        body("productCode").trim().notEmpty().withMessage("Please select a product."),

        // Validate the incident title
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Please enter an incident title.")
            .isLength({ max: 50 })
            .withMessage("Title must not exceed 50 characters."),

        // Validate the incident description
        body("description").trim().notEmpty().withMessage("Please enter an incident description.")
    ],

    createIncident
);

// Assign an incident to a technician
router.put(
    "/:id/assign",
    authenticate,
    authorise(["admin"]),
    [

        // Validate the technician
        body("techID").isInt({ min: 1 }).withMessage("Please select a technician.")
    ],

    assignIncident

);

// Update an incident
router.put(
    "/:id",
    authenticate,
    authorise(["technician"]),

    [
        // Validate the description
        body("description").trim().notEmpty().withMessage("Please enter an incident description."),

        // Validate the closed flag
        body("closeIncident").isBoolean().withMessage("Invalid incident status.")

    ],
    updateIncident

);

module.exports = router;