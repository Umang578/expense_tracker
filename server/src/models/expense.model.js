import mongoose from "mongoose";
import { CATEGORIES } from "../constants.js";

const expenseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, default: "Other", enum: CATEGORIES },
    date: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;