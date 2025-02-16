import dotenv from "dotenv";
import mongoose from "mongoose";
import chalk from "chalk";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    console.log("Connecting to MongoDB database...");
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI ?? "");
    console.log(chalk.green("Connected to MongoDB database."));
  } catch (error) {
    console.error(chalk.red("Error connection to database", error));
    process.exit(1);
  }
};
export default connectDB;
