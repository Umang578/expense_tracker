import { CATEGORIES } from "../constants.js";
import Expense from "../models/expense.model.js";

// Get all expenses for logged-in user
export const getExpenses = async(req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.userId }).sort({ _id: -1 });
        res.json(expenses);
    } catch (error) {
        console.error("Error fetching expenses ::", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Add expense
export const addExpense = async(req, res) => {
    try {
        const { description, amount, category, date } = req.body;
    
        const safeCategory = CATEGORIES.includes(category) ? category : "Other";
    
        const expense = await Expense.create({
            description,
            amount,
            category: safeCategory,
            date,
            userId: req.userId,
        });

        if (!expense) {
            return res.status(400).json({ message: "Error adding expense" });
        }

        res.json(expense);
    } catch (error) {
        console.error("Error adding expense ::", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Delete expense
export const deleteExpense = async(req, res) => {
    try {
        const deleted = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });
        if (!deleted) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Deleted", id: req.params.id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update expense
export const updateExpense = async(req, res) => {
    try {
        const { description, amount, category, date } = req.body;
        const safeCategory = CATEGORIES.includes(category) ? category : "Other";

        const updated = await Expense.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { description, amount, category: safeCategory, date }, { new: true });
        if (!updated) return res.status(404).json({ message: "Not found" });
        res.json(updated);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};