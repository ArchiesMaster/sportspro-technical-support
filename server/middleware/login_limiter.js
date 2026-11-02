const rateLimit = require("express-rate-limit");

// Limit login attempts
const loginLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 10,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        message:
            "Too many login attempts. Please try again in 15 minutes."
    }

});

module.exports = loginLimiter;