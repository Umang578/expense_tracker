import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB !!");
        console.log(`Connection Host :: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB connection error ::", error);
    }
}