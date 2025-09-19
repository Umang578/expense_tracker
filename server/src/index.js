import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./db/config.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

// routes
import userRoutes from "./routes/user.route.js";
import expenseRoutes from "./routes/expense.route.js";
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/expense", expenseRoutes);

connectDB()
.then(() => {
    app.listen(PORT, () =>
        console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
});