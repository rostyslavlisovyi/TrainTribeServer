import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import sequelize from "./config/sequelize.js";
import syncMock from "./config/syncMock.js";
import router from "./routes/index.js";
import { setupSwagger } from "./config/swagger.js";
import chalk from "chalk";

dotenv.config();

// Environment Variables Validation
const REQUIRED_ENV_VARS: string[] = [
  "SERVER_PORT",
  "DB_TYPE"
] as const;
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

//Middlewares
appServer.use(express.json());

const corsOptions = {
  origin: process.env.APP_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
};

appServer.use(cors(corsOptions));

appServer.options("*", cors(corsOptions));

appServer.use(express.urlencoded({ extended: true }));

// Routes
appServer.get("/", (_req, res) => {
  res.send("TrainTribe API");
});

appServer.use("/api", router);

// Swagger
setupSwagger(appServer);

// Graceful Shutdown
async function gracefulShutdown(signal: string): Promise<void> {
  console.info(`Received ${signal}. Gracefully shutting down...`);
  try {
    await sequelize.close();
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

    // Sync mock data
    await syncMock();
    console.info(chalk.green("Mock data synced successfully."));

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
