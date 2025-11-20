import "../instrument.js";
import { scopePerRequest } from "awilix-express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import * as Sentry from "@sentry/node";
import { CityService } from "services/city.service.js";
import connectDB from "./config/database.js";
import { setupSwagger } from "./config/swagger.js";
import container from "./container.js";
import router from "./routes/index.js";

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

const corsOptions = {
  origin: process.env.APP_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
};

appServer.use(cors(corsOptions));

appServer.options("*", cors(corsOptions));

appServer.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
appServer.use(express.static("public"));

// Routes
appServer.get("/", (_req, res) => {
  res.sendFile("index.html", { root: "./public" });
});

// Debug helper for Sentry manual testing:
// appServer.get("/debug-sentry", () => {
//   throw new Error("Manual Sentry test");
// });

appServer.use("/api", router);

type MiddlewareError = {
  output?: { statusCode?: number | string };
  status?: number | string;
  statusCode?: number | string;
  status_code?: number | string;
};

const shouldCaptureError = (error: MiddlewareError): boolean => {
  const statusCandidate =
    error?.status ??
    error?.statusCode ??
    error?.status_code ??
    error?.output?.statusCode;

  if (statusCandidate === undefined) {
    return true;
  }

  const statusNumber =
    typeof statusCandidate === "number"
      ? statusCandidate
      : Number(statusCandidate);

  if (Number.isNaN(statusNumber)) {
    return true;
  }

  return statusNumber >= 500;
};

Sentry.setupExpressErrorHandler(appServer, {
  shouldHandleError: shouldCaptureError
});

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
      const cityService = container.resolve<CityService>("cityService");
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
