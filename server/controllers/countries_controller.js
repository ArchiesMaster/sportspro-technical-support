const database = require("../db/database");

// Retrieve all countries
async function getCountries(req, res) {

    try {

        // Retrieve all countries sorted alphabetically
        const result = await database.query(
            `SELECT
                countryCode,
                countryName
             FROM countries
             ORDER BY countryName`
        );

        // Return the countries to the client
        res.json(result.rows);

    }
    catch (error) {

        console.error("Error retrieving countries:", error);

        res.status(500).json({
            message: "Unable to retrieve countries."
        });

    }

}

module.exports = {
    getCountries
};