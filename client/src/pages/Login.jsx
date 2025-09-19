import { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axios";
import { useNavigate } from "react-router";
import useUserStore from "../app/userStore";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);

    const { setUser, setToken } = useUserStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post('/user/login', formData);
            toast.success("Login successful!");
            setToken(response.data.token);
            setUser(response.data.user);
            setLoading(false);
            navigate('/');
        } catch (error) {
            console.error("Login failed:", error);
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='flex-grow flex justify-center items-center'>
            <form onSubmit={handleSubmit}>
                <div className="card bg-base-300 text-neutral-content w-96 card-lg">
                    <div className="card-body">
                        <h2 className="card-title text-3xl">Login</h2>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Email:</legend>
                            <label className="input validator">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </g>
                                </svg>
                                <input 
                                    type="email" 
                                    placeholder="email@example.com" 
                                    required 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                />
                            </label>
                            <p className="validator-hint hidden">
                                Enter valid email address
                            </p>
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Password:</legend>
                            <label className="input validator">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                        ></path>
                                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                    </g>
                                </svg>
                                <input
                                    type="password"
                                    required
                                    placeholder="Password"
                                    title="Enter your account password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </label>
                            <p className="validator-hint hidden">
                                Password is required
                            </p>
                        </fieldset>
                        <div className='card-actions justify-end'>
                            <button type="submit" className="btn btn-info">
                                Login
                                {loading && <span className='loading loading-spinner'></span>}
                            </button>
                        </div>
                        <div className="card-actions justify-center text-sm text-center">
                            <p>Don't have an account? <a href="/register" className="link link-secondary">Register</a></p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login