const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const { getCountries } = require("../controllers/countries_controller");

// Retrieve all countries
router.get(
    "/",
    authenticate, // Any authenticated user can access the list of countries
    getCountries
);

module.exports = router;