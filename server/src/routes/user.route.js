import { Router } from "express";
import { getBudgets, getBudgetSummary, login, logout, register, updateBudgets } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router
    .post("/register", register)
    .post("/login", login)
    .post("/logout", logout)
    .get("/budgets", authMiddleware, getBudgets)
    .post("/budgets", authMiddleware, updateBudgets)
    .get("/budget-summary", authMiddleware, getBudgetSummary);

export default router;