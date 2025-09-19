import { Navigate } from "react-router";
import useUserStore from "../app/userStore";

const PublicRoutes = ({children}) => {
  const { user, token } = useUserStore();

  if (user && token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default PublicRoutes