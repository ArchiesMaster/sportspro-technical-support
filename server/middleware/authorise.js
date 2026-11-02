// Check whether the authenticated user has permission
function authorise(allowedRoles) {

    return (req, res, next) => {

        // Check whether the user's role is permitted
        if (!allowedRoles.includes(req.user.role)) {

            return res.status(403).json({
                message: "Access denied."
            });

        }

        next();

    };

}

module.exports = authorise;