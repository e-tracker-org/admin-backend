// components/PrivateRoute.js or components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const user = localStorage.getItem("user");

  // Redirect to signin if not logged in
  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
