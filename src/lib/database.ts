import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI must be defined");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const options = {
      dbName: "streamX",
      bufferCommands: true,
      maxPoolSize: 5,
    };

    cached.promise = mongoose.connect(MONGODB_URI, options).then((conn) => {
      console.log("MongoDB connected to database:", conn.connection.name);
      return conn.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
