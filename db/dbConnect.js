import mongoose from "mongoose";

let isConnected = false;

const dbConnect = async () => {
  if (isConnected) return;
  const mongoUri =
    "mongodb+srv://abdullahdeveloper843:rQ2RTLa2XzPxtOs9@cluster0.oibzxzv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
