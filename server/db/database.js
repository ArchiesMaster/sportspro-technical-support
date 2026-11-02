const { Pool } = require("pg");
const path = require("path");
// Load config from .env file
require("dotenv").config({path: path.resolve(__dirname, "../../.env")});

// Create pool to handle PostgreSQL connections
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = pool;