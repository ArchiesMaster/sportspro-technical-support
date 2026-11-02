const jwt = require("jsonwebtoken");

// Verify that the request contains a valid JWT
function authenticate(req, res, next) {

    // Retrieve the Authorization header
    const authHeader = req.headers.authorization;

    // Check whether the Authorization header exists
    if (!authHeader) {

        return res.status(401).json({
            message: "Authentication required."
        });

    }

    // Retrieve the token from the Bearer header
    const token = authHeader.split(" ")[1];

    try {

        // Verify the JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store the decoded user information
        req.user = decoded;

        next();

    }
    catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token."
        });

    }

}

module.exports = authenticate;