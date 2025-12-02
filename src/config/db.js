// Changed require → import
import mongoose from "mongoose";
import dotenv from "dotenv";

// Configure dotenv
dotenv.config();

// Export as ESM function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed", error);
    process.exit(1);
  }
};

export default connectDB; // Changed module.exports → export default
