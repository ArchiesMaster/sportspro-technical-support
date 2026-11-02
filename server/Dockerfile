# Use Node.js Apline image
FROM node:22-alpine

# Create application directory
WORKDIR /app

# Copy package files and install depencencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci

# Copy the rest of the application
WORKDIR /app
COPY . .

# Start Express server
WORKDIR /app/server

EXPOSE 3000

CMD ["node", "server.js"]