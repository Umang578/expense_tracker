import axios from "axios";
import useUserStore from "../app/userStore";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URI,
    headers: {
        Authorization: `Bearer ${useUserStore.getState().token}`
    }
});