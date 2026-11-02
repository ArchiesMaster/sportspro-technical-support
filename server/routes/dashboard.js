const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/dashboard_controller");
const authenticate = require("../middleware/authenticate");

// Retrieve dashboard statistics
router.get(
    "/",
    authenticate,
    getDashboard
);

module.exports = router;