const express = require("express");
const dotenv = require("dotenv");
const { sequelize } = require("./config/sequelize");
const { connectDB } = require("./config/database");
const router = require("./routes");
const syncMock = require("./config/syncMock");
const cors = require("cors");

import { Express } from "express";


dotenv.config();

// Environment Variables Validation
const REQUIRED_ENV_VARS: string[] = ["SERVER_PORT", "DB_TYPE", "JWT_SECRET"] as const;
REQUIRED_ENV_VARS.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Environment variable ${varName} is not defined.`);
    process.exit(1);
  }
});

// Constants
const SERVER_PORT: number = parseInt(process.env.SERVER_PORT ?? "666", 10);

// Initialize Express App
const appServer: Express = express();

//Middlewares
appServer.use(express.json());
appServer.use(cors());
appServer.use(express.urlencoded({ extended: true }));

// Routes
appServer.use("/api", router);

// Graceful Shutdown
async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`Received ${signal}. Gracefully shutting down...`);
  try {
    await sequelize.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown: ", error);
    process.exit(1);
  }
}

// Register Shutdown Hooks
["SIGINT", "SIGTERM"].forEach((signal) =>
    process.on(signal, () => gracefulShutdown(signal))
);

// Start Server
async function startServer(): Promise<void> {
  try {
    // Connect to database
    await connectDB();

    // Sync mock data
    await syncMock();
    console.log("Mock data synced successfully.");

    // Start listening
    appServer.listen(SERVER_PORT, () => {
      console.log(`Server is running on http://localhost:${SERVER_PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error("Failed to start the server:", error);
  process.exit(1);
});
