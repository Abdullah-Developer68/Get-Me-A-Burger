import mongoose from "mongoose";

let isConnected = false;

const dbConnect = async () => {
  if (isConnected) return;
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Get-Me-A-Coke";
  try {
    const conn = await mongoose.connect(mongoUri);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error", err);
    throw err;
  }
};

export default dbConnect;
