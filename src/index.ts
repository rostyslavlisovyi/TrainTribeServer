import cors from "cors";
import dotenv from "dotenv";
import type { Express, Request, Response } from "express";
import express from "express";
import "../instrument.js";

import connectDB from "./config/database.js";
import { setupSwagger } from "./config/swagger.js";
import {
  authenticate,
  cronJobMiddleware,
  requestContextMiddleware
} from "./middlewares/index.js";
import { apiRouter, cronJobRouter } from "./routes/index.js";
import { CityService } from "./services/index.js";
import { registerSentryHandlers } from "./utils/sentry.js";
import {
  createTimer,
  logInitializationMetrics
} from "./utils/performance.js";

dotenv.config();

/* -------------------------------------------------------------------------- */
/*                              ENV VALIDATION                                 */
/* -------------------------------------------------------------------------- */

const REQUIRED_ENV_VARS: string[] = ["MONGODB_URI"];
const isProduction = process.env.NODE_ENV === "production";
const isVercel = !!process.env.VERCEL;

if (!isVercel) {
  REQUIRED_ENV_VARS.push("SERVER_PORT");
}

REQUIRED_ENV_VARS.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Environment variable ${varName} is not defined.`);
    if (!isProduction) process.exit(1);
  }
});

/* -------------------------------------------------------------------------- */
/*                           APP SINGLETON LOGIC                               */
/* -------------------------------------------------------------------------- */

let appPromise: Promise<Express> | null = null;

function getApp(): Promise<Express> {
  if (!appPromise) {
    console.time("getApp");
    appPromise = initializeApp()
      .then((app) => {
        console.timeEnd("getApp");
        return app;
      })
      .catch((error) => {
        console.timeEnd("getApp");
        throw error;
      });
  }
  return appPromise;
}

/* -------------------------------------------------------------------------- */
/*                            APP INITIALIZATION                               */
/* -------------------------------------------------------------------------- */

async function initializeApp(): Promise<Express> {
  console.time("App Initialization");
  const appInitializationTimer = createTimer();
  console.time("Module Setup");
  const moduleSetupTimer = createTimer();

  const app = express();

  const moduleSetupMs = moduleSetupTimer();
  console.timeEnd("Module Setup");

  /* ------------------------------- MIDDLEWARES ------------------------------ */

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const allowedOrigins =
    process.env.APP_URL?.split(",").map((url) => url.trim()) || [];

  const corsOptions: cors.CorsOptions = {
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  };

  app.use("/api", cors(corsOptions));
  app.options("/api/*", cors(corsOptions));

  /* ---------------------------------- ROUTES -------------------------------- */

  app.get("/", (_req, res) => {
    res.status(200).json({ status: "ok", service: "TrainTribeAPI" });
  });

  /* ----------------------------- DB CONNECTION ------------------------------ */
  // Protected internally with promise cache
  console.time("Database Connection");
  const dbConnectionTimer = createTimer();
  await connectDB();
  const dbConnectionMs = dbConnectionTimer();
  console.timeEnd("Database Connection");

  /* ---------------------------- OPTIONAL SERVICES ---------------------------- */

  // Firebase → lazy + non-blocking
  import("./config/firebase.js").catch(() =>
    console.warn("Firebase initialization skipped")
  );

  /* --------------------------------- API ----------------------------------- */

  app.use("/api", authenticate);
  app.use("/api", requestContextMiddleware);
  app.use("/api", apiRouter);

  app.use("/cron-job", cronJobMiddleware);
  app.use("/cron-job", requestContextMiddleware);
  app.use("/cron-job", cronJobRouter);

  registerSentryHandlers(app);

  /* -------------------------------- SWAGGER -------------------------------- */

  if (!isProduction || process.env.ENABLE_SWAGGER === "true") {
    console.time("Swagger Setup");
    setupSwagger(app);
    console.timeEnd("Swagger Setup");
  }

  const totalMs = appInitializationTimer();
  console.timeEnd("App Initialization");

  logInitializationMetrics({
    totalMs,
    moduleSetupMs,
    dbConnectionMs
  });
  return app;
}

/* -------------------------------------------------------------------------- */
/*                          VERCEL DEFAULT EXPORT                              */
/* -------------------------------------------------------------------------- */

export default async function app(req: Request, res: Response) {
  const expressApp = await getApp();
  return expressApp(req, res);
}

/* -------------------------------------------------------------------------- */
/*                          LOCAL DEVELOPMENT SERVER                           */
/* -------------------------------------------------------------------------- */

async function startServer(): Promise<void> {
  if (isVercel) return;

  console.time("Server Startup");
  const SERVER_PORT = parseInt(process.env.SERVER_PORT ?? "3000", 10);

  const app = await getApp();

  if (process.env.FETCH_CITY_ON_STARTUP === "true") {
    console.time("City Service Initialization");
    const cityService = new CityService();
    await cityService.inizialize();
    console.timeEnd("City Service Initialization");
  }

  const server = app.listen(SERVER_PORT, () => {
    console.timeEnd("Server Startup");
    console.info(`🚀 Server running on http://localhost:${SERVER_PORT}`);
  });

  const shutdown = () => {
    console.info("🛑 Shutting down server...");
    server.close(() => process.exit(0));
  };

  ["SIGINT", "SIGTERM"].forEach((signal) => process.on(signal, shutdown));
}

if (!isVercel) {
  startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}
