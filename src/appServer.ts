import express, { Express } from "express";
import dotenv from "dotenv";
import { sequelize } from "./config/sequelize.js";
import { connectDB } from "./config/database.js";
import router from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHendler.js";
import { syncMock } from "./config/syncMock.js";

dotenv.config();

const REQUIRED_ENV_VARS: string[] = ["SERVER_PORT", "DB_TYPE", "JWT_SECRET"];

for (const varName of REQUIRED_ENV_VARS) {
  if (!process.env[varName]) {
    console.error(`Environment variable ${varName} is not defined.`);
    process.exit(1);
  }
}

const appServer: Express = express();
const SERVER_PORT: number = parseInt(process.env.SERVER_PORT ?? "666", 10);

appServer.use(express.json());
appServer.use(express.urlencoded({ extended: true }));
appServer.use("/api", router);

appServer.use(errorHandler);

async function start(): Promise<void> {
  try {
    await connectDB();
    console.log("Connected to database");
    await syncMock();
    appServer.listen(SERVER_PORT, () => {
      console.log(`Server is running on http://localhost:${SERVER_PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
}

process.on("SIGINT", async (): Promise<void> => {
  console.log("Gracefully shutting down...");
  await sequelize.close();
  process.exit(0);
});

process.on("SIGTERM", async (): Promise<void> => {
  console.log("Terminating application...");
  await sequelize.close();
  process.exit(0);
});

start();
