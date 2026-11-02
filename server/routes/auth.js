const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authenticate = require("../middleware/authenticate");
const loginLimiter = require("../middleware/login_limiter");
    
const {
    login,
    register,
    refresh
} = require("../controllers/auth_controller");

// Authenticate a user
router.post(
    "/login",
    loginLimiter,
    [
        // Ensure a valid email address is supplied
        body("email").trim().isEmail().withMessage("Please enter a valid email address."),

        // Ensure a password has been entered
        body("password").notEmpty().withMessage("Please enter your password.")
    ],
    login
);

// Register a new user
router.post(
    "/register",
    [
        // Ensure a first name has been entered
        body("firstName").trim().notEmpty().withMessage("Please enter your first name."),

        // Ensure a last name has been entered
        body("lastName").trim().notEmpty().withMessage("Please enter your last name."),

        // Ensure a valid email address is supplied
        body("email").trim().isEmail().withMessage("Please enter a valid email address."),

        // Ensure the password is at least 8 characters
        body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),

        // Ensure the passwords match
        body("confirmPassword").custom((value, { req }) => value === req.body.password).withMessage("Passwords do not match."),

        // Ensure a valid role has been selected
        body("role").isIn(["admin", "technician", "customer"]).withMessage("Please select a valid role."),

        // Ensure a phone number has been entered for customers and technicians
        body("phone").trim().if(body("role").isIn(["customer", "technician"])).notEmpty().withMessage("Please enter a phone number.")           

    ],

    register

);

// Refresh an authenticated user's JWT
router.post(
    "/refresh",
    authenticate,
    refresh
);

module.exports = router;