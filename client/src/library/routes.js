import "antd/dist/antd.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LocalStore from "./localStore";
import {
  Book,
  BookList,
  Cart,
  Category,
  CategoryList,
  Dashboard,
  Home,
  Login,
  Institution,
  InstAbout,
  InstContact,
  InstDepartment,
  InstEvent,
  InstInfo,
  InstList,
  InstNotice,
  InstTeam,
  InstUser,
  Order,
  Profile,
  Register,
  User,
  UserOrder,
  UserProfile,
} from "../pages";

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
const AppRoutes = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Routes that require "ADMIN" role */}
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
          {/* Routes that require "USER" role */}
          <Route
            path="/user-profile"
            element={<ProtectedRoute ChildComponent={UserProfile} role="user" />}
          />
          <Route
            path="/user-orders"
            element={<ProtectedRoute ChildComponent={UserOrder} role="user" />}
          />
          {/* Routes that require "INSTITUTION" role */}
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
          <Route
            path="/inst-user-profile"
            element={<ProtectedRoute ChildComponent={Profile} role="institution" />}
          />
          <Route
            path="/inst-users"
            element={<ProtectedRoute ChildComponent={InstUser} role="institution" />}
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
            element={<RenderPage ChildComponent={BookList} />}
          />
          <Route
            path="/category-store"
            element={<RenderPage ChildComponent={CategoryList} />}
          />
          <Route
            path="/cart"
            element={<RenderPage ChildComponent={Cart} />}
          />
          <Route
            path="/institution-list"
            element={<RenderPage ChildComponent={InstList} />}
          />
          <Route
            path="/institution-info/:id"
            element={<RenderPage ChildComponent={InstInfo} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default AppRoutes;
