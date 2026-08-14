import mongoose from "mongoose";

export async function connectDb() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set. Add it to the .env file.");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected to MongoDB`);
}

export function disconnectDb() {
  return mongoose.disconnect();
}
