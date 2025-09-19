import User from "../models/user.model.js";
import Expense from "../models/expense.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { emptyBudgets } from "../utils/emptyBudgets.js";
import { CATEGORIES } from "../constants.js";

export const register = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            budgets: emptyBudgets(),
        });
        if (!user) {
            return res.status(500).json({ message: "Error creating user" });
        }
        res.json({ message: "User registered successfully" });
    } catch (err) {
        console.log("Error registering user ::", err);
        res
            .status(400)
            .json({ message: "Error registering user", error: err.message });
    }
}

export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user._id },
            process.env.JWT_SECRET, { expiresIn: "1d" }
        );
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error("Error logging in user ::", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const logout = (_, res) => {
    res.clearCookie("token");
    res.json({ message: "User logged out successfully" });
}

export const getBudgets = async(req, res) => {
    try {
        const user = await User.findById(req.userId).lean();
        if (!user) return res.status(404).json({ message: "User not found" });
        // Ensure all categories are present (covers older users with no budgets)
        const merged = {...emptyBudgets(), ...(user.budgets || {}) };
        res.json(merged);
    } catch (error) {
        console.error("Error fetching user budgets ::", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

// TODO: update only required field not all are to be sent
export const updateBudgets = async(req, res) => {
    try {
        const { budgets } = req.body;
        if (!budgets || typeof budgets !== "object") {
            return res.status(400).json({ message: "budgets object is required" });
        }

        // Sanitize & normalize numbers, only allow known categories
        const $set = {};
        CATEGORIES.forEach((cat) => {
            const val = budgets[cat];
            const num = Number(val);
            $set[`budgets.${cat}`] = isNaN(num) ? 0 : num;
        });

        const updated = await User.findByIdAndUpdate(
            req.userId, { $set }, { new: true }
        ).lean();

        if (!updated) return res.status(404).json({ message: "User not found" });

        const merged = {...emptyBudgets(), ...(updated.budgets || {}) };
        res.json(merged);
    } catch (error) {
        console.error("Error updating user budgets ::", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getBudgetSummary = async(req, res) => {
    try {
        // Get user's budgets
        const user = await User.findById(req.userId).lean();
        if (!user) return res.status(404).json({ message: "User not found" });

        // Ensure all categories are present with default values
        const userBudgets = {...emptyBudgets(), ...(user.budgets || {}) };

        // Get all expenses for the user grouped by category
        const expenseAggregation = await Expense.aggregate([
            { $match: { userId: user._id } },
            {
                $group: {
                    _id: "$category",
                    totalExpenses: { $sum: "$amount" }
                }
            }
        ]);

        // Create expense summary object
        const expensesByCategory = {};
        expenseAggregation.forEach(item => {
            expensesByCategory[item._id] = item.totalExpenses;
        });

        // Calculate remaining budget for each category
        const budgetSummary = {};
        CATEGORIES.forEach(category => {
            const budget = userBudgets[category] || 0;
            const expenses = expensesByCategory[category] || 0;
            budgetSummary[category] = budget - expenses;
        });

        res.json(budgetSummary);
    } catch (error) {
        console.error("Error fetching budget summary ::", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}