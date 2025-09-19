import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addExpense, deleteExpense, getExpenses, updateExpense } from "../controllers/expense.controller.js";

const router = Router();

router.use(authMiddleware);

router
    .get("/", getExpenses)
    .post("/", addExpense)
    .delete("/:id", deleteExpense)
    .put("/:id", updateExpense);

export default router;