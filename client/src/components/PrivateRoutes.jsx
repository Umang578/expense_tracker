import { Navigate } from "react-router";
import useUserStore from "../app/userStore";

const PrivateRoutes = ({children}) => {
  const { user, token } = useUserStore();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default PrivateRoutes