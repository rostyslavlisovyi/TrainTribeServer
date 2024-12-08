import dotenv from "dotenv";
import sequelize from "./sequelize.js";
import mongoose from "mongoose";

dotenv.config();

type DBType = "mysql" | "mongodb";

const connectDB = async (): Promise<void> => {
  const dbType: DBType = process.env.DB_TYPE as DBType;
  try {
    if (dbType === "mysql") {
      console.log("Connecting to MySQL database...");
      await sequelize.authenticate();
      console.log("Connected to MySQL database.");
    } else if (dbType === "mongodb") {
      console.log("Connecting to MongoDB database...");
      const mongoURI = process.env.MONGO_DB_URI;
      await mongoose.connect(mongoURI ?? "");
      console.log("Connected to MongoDB database.");
    } else {
      console.error(`Unsupported DB_TYPE: ${dbType}`);
    }
  } catch (error) {
    console.error(`Error connection to ${dbType} database`, error);
    process.exit(1);
  }
};
export default connectDB;
