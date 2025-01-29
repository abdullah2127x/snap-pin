import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return; // Already connected
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export default connectDB;
