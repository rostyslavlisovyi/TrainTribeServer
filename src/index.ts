// index.ts - CORRETTO

import { scopePerRequest } from "awilix-express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import connectDB from "./config/database.js";
import "./config/firebase.js";
import { setupSwagger } from "./config/swagger.js";
import container from "./container.js";
import {
  authContainerMiddleware,
  authenticate,
  cronJobMiddleware
} from "./middlewares/index.js";
import { apiRouter, cronJobRouter } from "./routes/index.js";
import { CityService } from "./services/index.js";
dotenv.config();

// Environment Variables Validation
const REQUIRED_ENV_VARS: string[] = ["SERVER_PORT", "MONGODB_URI"] as const;
REQUIRED_ENV_VARS.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(chalk.red(`Environment variable ${varName} is not defined.`));
    process.exit(1);
  }
});

// Constants
const SERVER_PORT: number = parseInt(process.env.SERVER_PORT ?? "666", 10);

// Initialize Express App
const appServer: Express = express();
appServer.use(scopePerRequest(container));

//Middlewares
appServer.use(express.json());

const allowedOrigins =
  process.env.APP_URL?.split(",")?.map((url) => url.trim()) || [];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
};

appServer.use("/api", cors(corsOptions));
appServer.options("/api/*", cors(corsOptions));

appServer.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
appServer.use(express.static("public"));

// Routes
appServer.get("/", (_req, res) => {
  res.sendFile("index.html", { root: "./public" });
});
appServer.use("/api", authenticate);
appServer.use("/api", authContainerMiddleware);
appServer.use("/api", apiRouter);
appServer.use("/cron-job", cronJobMiddleware);
appServer.use("/cron-job", cronJobRouter);

// Swagger
setupSwagger(appServer);

// Graceful Shutdown
async function gracefulShutdown(signal: string): Promise<void> {
  console.info(`Received ${signal}. Gracefully shutting down...`);
  try {
    console.info("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error(chalk.red("Error during shutdown: ", error));
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

    const shouldFetchCityOnStartup =
      process.env.FETCH_CITY_ON_STARTUP === "true";

    if (shouldFetchCityOnStartup) {
      const cityService = new CityService();
      await cityService.inizialize();
    }

    // Start listening
    appServer.listen(SERVER_PORT, () => {
      console.info(
        chalk.green(`Server is running on http://localhost:${SERVER_PORT}`)
      );
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
