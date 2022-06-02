import "antd/dist/antd.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LocalStore from "./localStore";
import Login from "../pages/login";
import Register from "../pages/register";
import Book from "../pages/book";
import Category from "../pages/category";
import Order from "../pages/order";
import User from "../pages/user";
import Dashboard from "../pages/dashboard";
import Profile from "../pages/profile";
import Home from "../pages/home";

/* validate admin user */
const AdminRoute = ({ children }) => {
  const info = LocalStore.decodeToken();
  
  if (info && info.role === "admin" && Date.now() < info.expiredAt) {
    return children;
  }
  return <Navigate to="/login" />;
};

/* validate normal user */
const UserRoute = ({ children }) => {
  const info = LocalStore.decodeToken();
  
  if (info && info.role === "user" && Date.now() < info.expiredAt) {
    return children;
  }
  return <Navigate to="/" />;
};

const AllRoutes = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/books"
            element={
              <AdminRoute>
                <Book />
              </AdminRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <AdminRoute>
                <Category />
              </AdminRoute>
            }
          />
           <Route
            path="/orders"
            element={
              <AdminRoute>
                <Order />
              </AdminRoute>
            }
          />
          <Route
            path="/users"
            element={
              <AdminRoute>
                <User />
              </AdminRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <AdminRoute>
                <Profile />
              </AdminRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<Home />} />
          <Route path="/contact-us" element={<Home />} />
          <Route path="/cart" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default AllRoutes;
