// src/PublicRoute.js
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const storedUser = JSON.parse(localStorage.getItem("user"));

  return !user && !storedUser ? children : <Navigate to="/" replace />;
};

export default PublicRoute;
