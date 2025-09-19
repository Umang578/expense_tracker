import { CATEGORIES } from "../constants.js";

export const emptyBudgets = () =>
    CATEGORIES.reduce((acc, c) => ((acc[c] = 0), acc), {});