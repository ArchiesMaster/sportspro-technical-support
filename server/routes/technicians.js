const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorise = require("../middleware/authorise");
const { body } = require("express-validator");

const {
    getTechnicians,
    addTechnician,
    deleteTechnician
} = require("../controllers/technicians_controller");

// Retrieve all technicians
router.get(
    "/",
    authenticate,
    authorise(["admin"]),
    getTechnicians
);

// Add a new technician
router.post(
    "/",
    authenticate,
    authorise(["admin"]),

    [
        // Ensure a first name has been entered
        body("firstName").trim().notEmpty().withMessage("Please enter a first name."),

        // Ensure a last name has been entered
        body("lastName").trim().notEmpty().withMessage("Please enter a last name."),

        // Ensure a valid email address has been entered
        body("email").trim().isEmail().withMessage("Please enter a valid email address."),

        // Ensure a phone number has been entered
        body("phone").trim().notEmpty().withMessage("Please enter a phone number."),

        // Ensure a password has been entered
        body("password").trim().notEmpty().withMessage("Please enter a password.")
    ],

    addTechnician
);

// Delete an existing technician
router.delete(
    "/:id",
    authenticate,
    authorise(["admin"]),
    deleteTechnician
);

module.exports = router;