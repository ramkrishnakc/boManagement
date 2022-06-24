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

/* Protect routes on basis of allowed role */
const ProtectedRoute = ({ ChildComponent, role }) => {
  const info = LocalStore.decodeToken();
  
  if (info && role === info.role && Date.now() < info.expiredAt) {
    return <ChildComponent />;
  }

  const redirect = role === "user" ? "/" : "/login";
  /* Remove old tokens and go to login */
  LocalStore.clear();
  LocalStore.clear("reduxState");
  return <Navigate to={`${redirect}`} />;
};

const AllRoutes = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/dashboard"
            element={<ProtectedRoute ChildComponent={Dashboard} role="admin" />}
          />
          <Route
            path="/books"
            element={<ProtectedRoute ChildComponent={Book} role="admin" />}
          />
          <Route
            path="/institutions"
            element={<ProtectedRoute ChildComponent={Institution} role="admin" />}
          />
          <Route
            path="/categories"
            element={<ProtectedRoute ChildComponent={Category} role="admin" />}
          />
           <Route
            path="/orders"
            element={<ProtectedRoute ChildComponent={Order} role="admin" />}
          />
          <Route
            path="/users"
            element={<ProtectedRoute ChildComponent={User} role="admin" />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute ChildComponent={Profile} role="admin" />}
          />
          <Route
            path="/user-profile"
            element={<ProtectedRoute ChildComponent={UserProfile} role="user" />}
          />
          <Route
            path="/user-orders"
            element={<ProtectedRoute ChildComponent={UserOrder} role="user" />}
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
