import express, {Express} from "express";
import dotenv from "dotenv";
import { sequelize } from "./config/database.js";
import router from "./routes/index.js";

dotenv.config();

const REQUIRED_ENV_VARS: string[] = [
    "SERVER_PORT",
    "MYSQL_DB_HOST",
    "MYSQL_DB_USER",
    "MYSQL_DB_PASSWORD",
    "MYSQL_DB_NAME"
];

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

appServer.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

async function start(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");
    appServer.listen(SERVER_PORT, () => {
      console.log(`Server is running on http://localhost:${SERVER_PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
}

process.on("SIGINT", async (): Promise<void>  => {
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
