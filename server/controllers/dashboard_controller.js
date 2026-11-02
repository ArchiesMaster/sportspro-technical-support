const database = require("../db/database");

// Retrieve dashboard data for the logged-in user
async function getDashboard(req, res) {

    try {

        // Determine the user's role
        const role = req.user.role;

        // Administrator Dashboard
        if (role === "admin") {

            // Retrieve system statistics
            const result = await database.query(

                `SELECT
                    (SELECT COUNT(*) FROM customers) AS customers,
                    (SELECT COUNT(*) FROM technicians) AS technicians,
                    (SELECT COUNT(*) FROM products) AS products,
                    (SELECT COUNT(*) FROM registrations) AS registrations,
                    (SELECT COUNT(*) FROM incidents WHERE dateClosed IS NULL) AS openIncidents,
                    (SELECT COUNT(*) FROM incidents WHERE dateClosed IS NOT NULL) AS closedIncidents,
                    (SELECT COUNT(*) FROM incidents WHERE techID IS NULL) AS unassignedIncidents`

            );
            
            // Return the statistics
            return res.json({
                role,
                stats: result.rows[0]
            });

        }

        // Technician Dashboard
        if (role === "technician") {

            // Retrieve the technician's statistics
            const result = await database.query(

                `SELECT
                    COUNT(*) AS assignedIncidents,
                    COUNT(*) FILTER (WHERE dateClosed IS NULL) AS openIncidents,
                    COUNT(*) FILTER (WHERE dateClosed IS NOT NULL) AS closedIncidents
                 FROM incidents
                 WHERE techID = $1`,
                [req.user.techID]

            );

            // Return the statistics
            return res.json({
                role,
                stats: result.rows[0]
            });

        }

        // Customer Dashboard
        if (role === "customer") {

            // Retrieve the customer's statistics
            const statsResult = await database.query(

                `SELECT
                    (SELECT COUNT(*)
                    FROM registrations
                    WHERE customerID = $1) AS registeredProducts,

                    (SELECT COUNT(*)
                    FROM incidents
                    WHERE customerID = $1
                    AND dateClosed IS NULL) AS openIncidents`,
                [req.user.customerID]

            );

            // Retrieve the customer's registered products
            const productsResult = await database.query(

                `SELECT
                    p.productCode,
                    p.name,
                    p.version
                FROM registrations r

                INNER JOIN products p
                    ON r.productCode = p.productCode

                WHERE r.customerID = $1

                ORDER BY p.name`,

                [req.user.customerID]

            );

            // Retrieve the customer's open incidents
            const incidentsResult = await database.query(

                `SELECT
                    title
                FROM incidents
                WHERE customerID = $1
                AND dateClosed IS NULL
                ORDER BY dateOpened`,
                [req.user.customerID]

            );

            // Return the dashboard data
            return res.json({

                role,
                stats: statsResult.rows[0],
                products: productsResult.rows,
                incidents: incidentsResult.rows

            });

        }

        // Reject requests with an unsupported role
        res.status(403).json({
            message: "Invalid user role."
        });

    }
    catch (error) {

        console.error("Error retrieving dashboard:", error);
        res.status(500).json({
            message: "Unable to retrieve dashboard."
        });

    }

}

module.exports = {
    getDashboard
};