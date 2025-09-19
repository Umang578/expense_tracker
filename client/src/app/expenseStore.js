import { create } from "zustand";
import { persist } from "zustand/middleware";

const useExpenseStore = create(persist((set, get) => ({
    expenses: [],
    loading: false,
    error: null,

    // Set all expenses
    setExpenses: (expenses) => set(() => ({
        expenses,
        error: null
    })),

    // Add a new expense
    addExpense: (expense) => set((state) => ({
        expenses: [expense, ...state.expenses],
        error: null
    })),

    // Update an existing expense
    updateExpense: (updatedExpense) => set((state) => ({
        expenses: state.expenses.map(expense => 
            expense._id === updatedExpense._id ? updatedExpense : expense
        ),
        error: null
    })),

    // Delete an expense
    deleteExpense: (expenseId) => set((state) => ({
        expenses: state.expenses.filter(expense => expense._id !== expenseId),
        error: null
    })),

    // Set loading state
    setLoading: (loading) => set(() => ({ loading })),

    // Set error state
    setError: (error) => set(() => ({ error })),

    // Clear error
    clearError: () => set(() => ({ error: null })),

    // Get expense by ID
    getExpenseById: (id) => {
        const state = get();
        return state.expenses.find(expense => expense._id === id);
    },

    // Get expenses by category
    getExpensesByCategory: (category) => {
        const state = get();
        return state.expenses.filter(expense => expense.category === category);
    },

    // Get total expenses
    getTotalExpenses: () => {
        const state = get();
        return state.expenses.reduce((total, expense) => total + expense.amount, 0);
    },

    // Get expenses by date range
    getExpensesByDateRange: (startDate, endDate) => {
        const state = get();
        return state.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate && expenseDate <= endDate;
        });
    }
}), {
    name: "expense-storage",
}));

export default useExpenseStore;