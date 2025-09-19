import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBudgetStore = create(persist((set) => ({
    state : {
        Food: 0,
        Rent: 0,
        Transport: 0,
        Shopping: 0,
        Bills: 0,
        Other: 0
    },
    setBudget: (category, amount) => set((state) => ({
        state: {
            ...state.state,
            [category]: Number(amount)
        }
    })),
    setBudgets: (budgets) => set(() => ({
        state: { ...budgets }
    }))
}), {
    name: "budget-storage",
}))

export default useBudgetStore;