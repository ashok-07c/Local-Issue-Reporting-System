const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not set in your .env file");
    }
    await mongoose.connect(uri, {
      // Production-friendly pooling/timeout defaults; safe to tune per environment.
      maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE) || 10,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected:", mongoose.connection.host);

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err.message);
    });
    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error(
      "Make sure MongoDB is running locally, or set MONGODB_URI to your MongoDB Atlas connection string in backend/.env"
    );
    process.exit(1);
  }
};

module.exports = connectDB;
