import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

let cachedConnection: typeof mongoose | null = null;

const connectDB = async (): Promise<void> => {
  // Return cached connection if already connected
  if (cachedConnection && cachedConnection.connection.readyState === 1) {
    console.log("Using cached MongoDB connection");
    return;
  }

  try {
    console.log("Connecting to MongoDB database...");
    console.time("MongoDB Connection Time");
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    // Connection pool settings optimized for serverless
    const options = {
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      retryReads: true,
      // Use connection pooling
      family: 4
    };

    await mongoose.connect(mongoURI, options);
    cachedConnection = mongoose;

    console.timeEnd("MongoDB Connection Time");
    console.log("Connected to MongoDB database");

    // Handle connection events
    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB connection disconnected");
      cachedConnection = null;
    });

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
      cachedConnection = null;
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
    cachedConnection = null;
    throw error;
  }
};

export default connectDB;
