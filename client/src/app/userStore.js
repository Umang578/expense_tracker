import { create } from "zustand"
import { persist } from "zustand/middleware"

const useUserStore = create(persist((set) => ({
    user: null,
    token: null,
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    clearUser: () => set({ user: null, token: null }),
}), {
    name: "user-storage",
}));

export default useUserStore;