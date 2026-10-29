import mongoose from "mongoose";
import { ConfigurationError } from "./errors";

let connection: Promise<typeof mongoose> | undefined;

export async function connectDatabase(): Promise<typeof mongoose> {
  const uri = process.env["MONGODB_URI"];
  if (!uri) {
    throw new ConfigurationError(
      "MONGODB_URI is required for admin and CMS operations. Copy .env.example to .env and configure MongoDB.",
    );
  }
  if (mongoose.connection.readyState === 1) return mongoose;
  connection ??= mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
  try {
    return await connection;
  } catch (error) {
    connection = undefined;
    throw error;
  }
}
