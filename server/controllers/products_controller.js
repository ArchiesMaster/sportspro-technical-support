const database = require("../db/database");
const { validationResult } = require("express-validator");

// Retrieve all products from the database
async function getProducts(req, res) {

    try {

        // Query the products table and sort the results by product code
        const result = await database.query(
            `SELECT *
             FROM products
             ORDER BY productCode`
        );

        // Return the products to the client as JSON
        res.json(result.rows);

    }
    catch (error) {

        console.error("Error fetching products:", error);

        // Return an error if the query fails
        res.status(500).json({
            message: "Failed to retrieve products."
        });

    }

}

// Handle requests to add a new product
async function addProduct(req, res) {

    // Retrieve any validation errors
    const errors = validationResult(req);

    // Return the first validation error, if any exist
    if (!errors.isEmpty()) {

        return res.status(400).json({
            message: errors.array()[0].msg
        });

    }    

    // Retrieve the product details sent from the client
    const {
        productCode,
        productName,
        productVersion,
        releaseDate
    } = req.body;

    try {

        // Insert the new product into the database
        await database.query(
            `INSERT INTO products
                (productCode, name, version, releaseDate)
             VALUES ($1, $2, $3, $4)`,
            [
                productCode,
                productName,
                productVersion,
                releaseDate
            ]
        );

        // Send a success message back to the client
        res.json({
            message: "Product added successfully."
        });

    }
    catch (error) {

        console.error("Error adding product:", error);

        // Error code 23505 indicates a duplicate product code
        if (error.code === "23505") {

            return res.status(409).json({
                message: "A product with that code already exists."
            });

        }

        // Return a general server error for any other problem
        res.status(500).json({
            message: "Failed to add product."
        });

    }

}

// Handle requests to delete a product
async function deleteProduct(req, res) {

    // Retrieve the product code from the URL parameter
    const productCode = req.params.code;

    try {

        // Delete the matching product from the database
        const result = await database.query(
            `DELETE
             FROM products
             WHERE productCode = $1`,
            [productCode]
        );

        // If no rows were deleted, the product does not exist
        if (result.rowCount === 0) {

            return res.status(404).json({
                message: "Product not found."
            });

        }

        // Send a success message back to the client
        res.json({
            message: "Product successfully deleted."
        });

    }
    catch (error) {

        console.error("Error deleting product:", error);

        // Return an error if the delete operation fails
        res.status(500).json({
            message: "Failed to delete product."
        });

    }

}

module.exports = {
    getProducts,
    addProduct,
    deleteProduct
};