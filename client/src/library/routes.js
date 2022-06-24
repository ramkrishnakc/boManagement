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
import InstAbout from "../pages/institutions/inst-about";
import InstContact from "../pages/institutions/inst-contact";
import InstTeam from "../pages/institutions/inst-team";
import InstDepartment from "../pages/institutions/inst-department";
import InstNotice from "../pages/institutions/inst-notice";
import InstEvent from "../pages/institutions/inst-event";

/* Protect routes on basis of allowed role */
const ProtectedRoute = ({ ChildComponent, role }) => {
  const info = LocalStore.decodeToken();
  
  if (info && role === info.role && Date.now() < info.expiredAt) {
    return <ChildComponent />;
  }

  if (info && Date.now() < info.expiredAt) {
    if (info.role === "admin") {
      return <Navigate to="/dashboard" />;
    }
    if (info.role === "institution") {
      return <Navigate to="/inst-about" />;
    }
  }

  const redirect = role === "user" ? "/" : "/login";
  /* Remove old tokens and go to login */
  LocalStore.clear();
  LocalStore.clear("reduxState");
  return <Navigate to={`${redirect}`} />;
};

/* Redirect to logged-in pages */
const RenderPage = ({ ChildComponent }) => {
  const info = LocalStore.decodeToken();

  if (info && info.role && Date.now() < info.expiredAt) {
    if (info.role === "admin") {
      return <Navigate to="/dashboard" />;
    }
    if (info.role === "institution") {
      return <Navigate to="/inst-about" />;
    }
  }

  /* Remove old tokens if any */
  LocalStore.clear();
  return <ChildComponent />;
};

/* All routes used in the application front-end */
const AllRoutes = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Routes that require ADMIN role */}
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
          {/* Routes that require USER role */}
          <Route
            path="/user-profile"
            element={<ProtectedRoute ChildComponent={UserProfile} role="user" />}
          />
          <Route
            path="/user-orders"
            element={<ProtectedRoute ChildComponent={UserOrder} role="user" />}
          />
          {/* Routes that require INSTITUTION role */}
          <Route
            path="/inst-about"
            element={<ProtectedRoute ChildComponent={InstAbout} role="institution" />}
          />
          <Route
            path="/inst-team"
            element={<ProtectedRoute ChildComponent={InstTeam} role="institution" />}
          />
          <Route
            path="/inst-departments"
            element={<ProtectedRoute ChildComponent={InstDepartment} role="institution" />}
          />
          <Route
            path="/inst-events"
            element={<ProtectedRoute ChildComponent={InstEvent} role="institution" />}
          />
          <Route
            path="/inst-notices"
            element={<ProtectedRoute ChildComponent={InstNotice} role="institution" />}
          />
          <Route
            path="/inst-contact"
            element={<ProtectedRoute ChildComponent={InstContact} role="institution" />}
          />

          {/* Routes that don't require any role */}
          <Route
            path="/register"
            element={<RenderPage ChildComponent={Register} />}
          />
          <Route
            path="/login"
            element={<RenderPage ChildComponent={Login} />}
          />
          <Route
            path="/"
            element={<RenderPage ChildComponent={Home} />}
          />
          <Route
            path="/book-store"
            element={<RenderPage ChildComponent={BookStore} />}
          />
          <Route
            path="/category-store"
            element={<RenderPage ChildComponent={CategoryStore} />}
          />
          <Route
            path="/cart"
            element={<RenderPage ChildComponent={Cart} />}
          />
          <Route
            path="/institution-list"
            element={<RenderPage ChildComponent={InstitutionList} />}
          />
          <Route
            path="/institution-info/:id"
            element={<RenderPage ChildComponent={InstitutionInfo} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default AllRoutes;
