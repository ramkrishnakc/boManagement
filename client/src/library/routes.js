import "antd/dist/antd.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LocalStore from "./localStore";
import Login from "../pages/login";
import Register from "../pages/register";
import Book from "../pages/book";
import BookStore from "../pages/book/book-store";
import Category from "../pages/category";
import CategoryStore from "../pages/category/category-store";
import Order from "../pages/order";
import UserOrder from "../pages/order/user-order";
import User from "../pages/user";
import Dashboard from "../pages/dashboard";
import Profile from "../pages/profile";
import UserProfile from "../pages/profile/user-profile";
import Home from "../pages/home";
import Cart from "../pages/cart";
import Institution from "../pages/institutions";
import InstitutionList from "../pages/institutions/institution-list";
import InstitutionInfo from "../pages/institutions/institution-info";

/* validate admin user */
const AdminRoute = ({ children }) => {
  const info = LocalStore.decodeToken();
  
  if (info && info.role === "admin" && Date.now() < info.expiredAt) {
    return children;
  }
  /* Remove old tokens and go to login */
  LocalStore.clear();
  LocalStore.clear("reduxState");
  return <Navigate to="/login" />;
};

/* validate normal user */
const UserRoute = ({ children }) => {
  const info = LocalStore.decodeToken();
  
  if (info && info.role === "user" && Date.now() < info.expiredAt) {
    return children;
  }
  /* Remove old tokens and go to home */
  LocalStore.clear();
  LocalStore.clear("reduxState");
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
            path="/institutions"
            element={
              <AdminRoute>
                <Institution />
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
          <Route
            path="/user-profile"
            element={
              <UserRoute>
                <UserProfile />
              </UserRoute>
            }
          />
          <Route
            path="/user-orders"
            element={
              <UserRoute>
                <UserOrder />
              </UserRoute>
            }
          />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/book-store" element={<BookStore />} />
          <Route path="/category-store" element={<CategoryStore />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/institution-list" element={<InstitutionList />} />
          <Route path="/institution-info/:id" element={<InstitutionInfo />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default AllRoutes;
