# SportsPro Technical Support

A full-stack technical support application for managing customers, software products, product registrations and support incidents. Administrators manage records and assign incidents, technicians update their assigned work and customers view their registrations and open incidents.

Developed by **Nathan Romeo** for **CSC3480 – Web Technology** at the University of Southern Queensland. The project extends an earlier CRUD application with authentication, role-based dashboards and protected API endpoints.

## Features

- Registration and login with bcrypt password hashing
- JWT authentication and role-based API authorisation
- Separate Administrator, Technician and Customer dashboards
- Product and technician management
- Customer searching and updating
- Customer product registration
- Incident creation, assignment, updating and closure
- Client-side validation and server-side validation using express-validator
- Asynchronous frontend requests with loading and error feedback
- Login rate limiting
- Swagger/OpenAPI documentation
- Docker Compose setup with PostgreSQL, two Express instances and Nginx

## Demonstration scope

This application was developed as university coursework using fictional customer and technician data.

**Registration allows users to select Administrator, Technician or Customer so each role and its permissions can be demonstrated locally.** A production system would restrict the creation of privileged accounts. The supplied accounts and passwords are for demonstration only.

## Technology

| Area               | Technology                 |
| ------------------ | -------------------------- |
| Frontend           | HTML, CSS and JavaScript   |
| Backend            | Node.js and Express        |
| Database           | PostgreSQL                 |
| Authentication     | JSON Web Tokens and bcrypt |
| Request validation | express-validator          |
| Login throttling   | express-rate-limit         |
| API documentation  | Swagger UI and OpenAPI     |
| Deployment         | Docker Compose and Nginx   |

## Roles and workflows

| Role          | Main workflow                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------------- |
| Administrator | Manage products, technicians and customers; create, view and assign incidents; view system totals  |
| Technician    | View assigned incidents, update descriptions and close incidents; view assigned/open/closed totals |
| Customer      | Register products and view registered products and open incidents on a personal dashboard          |

Role checks are applied on the server, rather than relying only on which controls are visible in the browser. Technician incident updates also check the incident's assigned technician ID.

## Architecture

The frontend communicates with an Express JSON API. Routes apply authentication, authorisation and validation middleware before calling controllers, which query PostgreSQL using parameterised SQL.

Nginx acts as a reverse proxy and distributes requests between two Express containers using round-robin load balancing. Both instances serve the same frontend and API and connect to the same database.

| Service    | Purpose                               |
| ---------- | ------------------------------------- |
| `postgres` | Persistent application data           |
| `app1`     | First Express application instance    |
| `app2`     | Second Express application instance   |
| `nginx`    | Browser entry point and reverse proxy |

## Run locally

### Requirements

- Docker Desktop with Docker Compose available
- Ports 80, 3000, 3001 and 5433 available for the supplied Compose configuration

A separate local Node.js or PostgreSQL installation is not required when using Docker.

### 1. Configure the environment

Open a terminal in the folder containing `docker-compose.yml`.

If an `.env.example` is included, copy it to `.env`. On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Otherwise, create `.env` beside `docker-compose.yml` with the following settings:

```dotenv
POSTGRES_DB=sportspro
POSTGRES_USER=postgres
POSTGRES_PASSWORD=local-demo-password
DB_HOST=postgres
DB_PORT=5432
JWT_SECRET=replace-with-a-long-random-secret
```

Replace the JWT placeholder with a long random value. These settings are shared by the two application containers. Keep your local `.env` out of version control; commit only an example configuration.

### 2. Build and start

```sh
docker compose up --build
```

Wait for PostgreSQL to finish initialising and the application containers to start. The schema and seed scripts run when PostgreSQL initialises a new, empty data volume.

### 3. Open the application

- Application: [http://localhost](http://localhost)
- API documentation: [http://localhost/docs](http://localhost/docs)

### 4. Sign in with a demo account

| Role          | Email                         | Password      |
| ------------- | ----------------------------- | ------------- |
| Administrator | admin@sportspro.com           | admin123      |
| Technician    | david.blackburn@sportspro.com | technician123 |
| Customer      | michael.jackson@email.com     | customer123   |

These accounts are created by `server/db/seed.sql` on first database initialisation. You can also register additional demonstration accounts through the interface.

### Stop the application

```sh
docker compose down
```

The named database volume is retained, so records remain available on the next start. Updating the seed SQL or `.env` database credentials does not automatically update an already initialised database.

## Project structure

| Path                              | Contents                                           |
| --------------------------------- | -------------------------------------------------- |
| `client/`                         | HTML pages, CSS and frontend JavaScript            |
| `server/controllers/`             | Request handling and database operations           |
| `server/routes/`                  | API routes and middleware configuration            |
| `server/middleware/`              | JWT verification, role checks and login throttling |
| `server/db/schema.sql`            | Database table definitions                         |
| `server/db/seed.sql`              | Fictional demonstration data and accounts          |
| `server/db/database.js`           | PostgreSQL connection pool                         |
| `server/scripts/hash_password.js` | Development helper for generating bcrypt hashes    |
| `server/swagger.yaml`             | OpenAPI specification                              |
| `server/server.js`                | Express application entry point                    |
| `nginx/`                          | Reverse proxy configuration and Dockerfile         |
| `docker-compose.yml`              | Container configuration and database volume        |

## Authentication behaviour

Passwords are hashed with bcrypt. A successful login returns a JWT containing the user's identifiers and role, with a one-hour expiry. The frontend stores the token in local storage and attaches it to API requests as a Bearer token.

Protected routes verify the token, then apply role checks where configured.

### Token renewal

`POST /api/auth/refresh` issues a new access token when called with a **currently valid access token**. It does not use a separate refresh token and cannot renew an expired token. After expiry, the user must log in again.

### Logout

Logout removes the token and role from browser storage and returns the user to the login page. It does not revoke an already issued token on the server; a retained copy remains valid until expiry.

### Login rate limiting

Login attempts are limited to 10 requests per 15-minute window per client IP on each application instance. The counters are held separately by the two Express processes, rather than shared across the deployment.

## Manual verification

The project includes a manual testing workflow rather than an automated test suite. The default `npm test` script is a placeholder.

Suggested checks:

1. Log in as each demo role and check its dashboard and available actions.
2. Register a new account and try invalid registration and login inputs.
3. As an administrator, create an incident and assign it to a technician.
4. As that technician, update and close the incident.
5. Check that a different technician cannot update the assigned incident through the API.
6. As a customer, register a product and check the dashboard.
7. Call a protected endpoint without a token and check the unauthorised response.
8. Try an endpoint restricted to another role and check the forbidden response.
9. Use Swagger UI to inspect the API and test token renewal before expiry.

## Local database access

For tools such as pgAdmin, connect using:

| Setting  | Value                           |
| -------- | ------------------------------- |
| Host     | `localhost`                     |
| Port     | `5433`                          |
| Database | `POSTGRES_DB` from `.env`       |
| Username | `POSTGRES_USER` from `.env`     |
| Password | `POSTGRES_PASSWORD` from `.env` |

Containers connect to `postgres:5432`; the host mapping uses port 5433.

## Coursework limitations

The project demonstrates full-stack workflows and deployment concepts rather than a production-ready support service. In addition to the demonstration role selection and token behaviour described above:

- Tokens are stored in browser local storage.
- Login throttling is not shared between application instances.
- The local configuration uses HTTP and exposes application and database ports for development.

## Author

**Nathan Romeo**
