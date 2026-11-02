const express = require("express");
const database = require("./db/database");
const path = require("path");

// Swagger setup
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

const app = express();

// Trust the Nginx proxy in front of the server
app.set("trust proxy", 1); 

const productsRouter = require("./routes/products");
const techniciansRouter = require("./routes/technicians");
const customersRouter = require("./routes/customers");
const registrationsRouter = require("./routes/registrations");
const countriesRouter = require("./routes/countries");
const authRouter = require("./routes/auth");
const incidentRouter = require("./routes/incidents");
const dashboardRouter = require("./routes/dashboard");

app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/technicians", techniciansRouter);
app.use("/api/customers", customersRouter);
app.use("/api/registrations", registrationsRouter);
app.use("/api/countries", countriesRouter);
app.use("/api/auth", authRouter);
app.use("/api/incidents", incidentRouter);
app.use("/api/dashboard", dashboardRouter);

// Serve the frontend files from the client folder
app.use(express.static(path.join(__dirname, "../client")));

// Serve the Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve the application home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Start Express server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});



