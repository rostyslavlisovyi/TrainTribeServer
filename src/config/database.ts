import mongoose from "mongoose";
import { sequelize } from "./sequelize.js";

type DBType = "mysql" | "mongodb";
export const connectDB = async (): Promise<void> => {
  const dbType: DBType = process.env.DB_TYPE;

  if (dbType === "mysql") {
    console.log("Connecting to MySQL database...");
    await sequelize.authenticate();
    console.log("Connected to MySQL database");
  } else if (dbType === "mongodb") {
    console.log("Connecting to MongoDB database...");
    await mongoose.connect(process.env.MONGO_DB_URI ?? "");
    console.log("Connected to MongoDB database");
  } else {
    throw new Error(`Unsupported DB_TYPE: ${dbType}`);
  }
};
