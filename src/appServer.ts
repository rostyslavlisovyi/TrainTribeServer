import express from "express";
import dotenv from "dotenv";
import {sequelize} from "./config/database.js";
import router from "./routes/index.js";

dotenv.config();

const appServer = express();
const SERVER_PORT: number = parseInt(process.env.SERVER_PORT ?? "666", 10);

appServer.use(express.json());
appServer.use(express.urlencoded({extended: true}));
appServer.use("/api", router);

async function start(): Promise<void> {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({alter: true});
    console.log("Connected to database");
    appServer.listen(SERVER_PORT, () => {
      console.log(`Server is running on http://localhost:${SERVER_PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
}

start();
