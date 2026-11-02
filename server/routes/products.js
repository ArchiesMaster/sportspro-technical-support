const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorise = require("../middleware/authorise");
const { body } = require("express-validator");

const {
    getProducts,
    addProduct,
    deleteProduct
} = require("../controllers/products_controller");

// Retrieve all products
router.get(
    "/",
    authenticate,
    authorise(["admin", "technician", "customer"]),
    getProducts
);

// Add a new product
router.post(
    "/",
    authenticate,
    authorise(["admin"]),

    [

        // Ensure a product code has been entered
        body("productCode").trim().notEmpty().withMessage("Please enter a product code."),

        // Ensure a product name has been entered
        body("productName").trim().notEmpty().withMessage("Please enter a product name."),

        // Ensure a product version has been entered
        body("productVersion").trim().notEmpty().withMessage("Please enter a product version."),

        // Ensure a valid release date has been entered
        body("releaseDate").isISO8601().withMessage("Please enter a valid release date.")

    ],

    addProduct
);

// Delete an existing product
router.delete(
    "/:code",
    authenticate,
    authorise(["admin"]),
    deleteProduct
);

module.exports = router;