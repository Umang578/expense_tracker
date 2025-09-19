import { GiReceiveMoney } from "react-icons/gi";
import useUserStore from "../app/userStore";
import { Link, useNavigate } from "react-router";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, token } = useUserStore();
  const navigate = useNavigate();

  const handleOnClick = async () => {
    useUserStore.getState().setUser(null);
    useUserStore.getState().setToken(null);
    try {
      await axiosInstance.post('/user/logout');
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
    navigate('/login');
  }

  return (
    <nav className='flex justify-between items-center p-2 md:p-4 bg-primary text-white w-full'>
      <Link to="/"><div className='font-bold text-sm md:text-xl flex gap-x-2 items-center'><p>Expense Tracker</p> <GiReceiveMoney /></div></Link>
      {(user && token) ? (<div className="flex items-center text-sm md:text-base"><div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-secondary rounded-field">Welcome, {user.name} <i className="ri-menu-line"></i></div>
        <ul
          tabIndex={0}
          className="menu dropdown-content bg-base-200 rounded-box z-1 mt-0 w-52 p-2 shadow-sm">
          <li><button onClick={handleOnClick} className="btn btn-soft btn-warning w-full flex justify-between">Logout <i className="ri-logout-circle-r-line"></i></button></li>
        </ul>
      </div></div>) : (
        <div className='flex gap-x-2'>
          <button onClick={() => navigate('/login')} className='btn btn-soft btn-active'>Login</button>
          <button onClick={() => navigate('/register')} className='btn btn-soft btn-secondary btn-active'>Register</button>
        </div>
      )}
    </nav>
  )
}

export default Navbar