const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorise = require("../middleware/authorise");
const { body } = require("express-validator");
const { registerProduct } = require("../controllers/registrations_controller");

// Register a product for a customer
router.post(
    "/",
    authenticate,
    authorise(["customer"]),

    [
        // Ensure a product has been selected
        body("productCode").trim().notEmpty().withMessage("Please select a product.")

    ],

    registerProduct
);
module.exports = router;