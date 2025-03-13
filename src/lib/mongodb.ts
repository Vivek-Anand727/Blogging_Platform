import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

let cached = (globalThis as any).mongoose || { conn: null, promise: null };

export async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB Connected!");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB Connection Failed!", error);
    throw error;
  }
}

(globalThis as any).mongoose = cached;
