import "antd/dist/antd.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LocalStore from "./localStore";
import { Header, HomeLayout, DefaultLayout } from "../components";
import {
  Book,
  BookList,
  BookPublished,
  Cart,
  Category,
  CategoryList,
  Dashboard,
  WriterDashboard,
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
  InstHome,
  Order,
  Profile,
  Register,
  User,
  UserOrder,
  UserPurchase,
  UserProfile,
  ReadComponent,
} from "../pages";

/* Protect routes on basis of allowed role */
const ProtectedRoute = ({ ChildComponent, displayFooter, role, title }) => {
  const info = LocalStore.decodeToken();
  
  if (info && role === info.role && Date.now() < info.expiredAt) {
    if (info.role === "user") {
      return (
        <HomeLayout displayFooter={displayFooter}>
          <ChildComponent />
        </HomeLayout>
      );
    }

    return (
      <DefaultLayout>
        <Header title={title} />
        <ChildComponent />
      </ DefaultLayout>
    );
  }

  if (info && Date.now() < info.expiredAt) {
    if (info.role === "admin") {
      return <Navigate to="/dashboard" />;
    }
    if (info.role === "institution") {
      return <Navigate to="/inst-about" />;
    }
    if (info.role === "writer") {
      return <Navigate to="/writer-dashboard" />;
    }
  }

  const redirect = role === "user" ? "/" : "/login";
  /* Remove old tokens and go to login */
  LocalStore.clear();
  LocalStore.clear("reduxState");
  return <Navigate to={`${redirect}`} />;
};

/* Redirect to logged-in pages */
const RenderPage = ({ ChildComponent, hideHeader, displayFooter }) => {
  const info = LocalStore.decodeToken();

  if (info && info.role) {
    const isActive = Date.now() < info.expiredAt;

    if (!isActive) {
      /* Remove old tokens if any */
      LocalStore.clear();
      LocalStore.clear("reduxState");
    }

    if (info.role === "admin") {
      return <Navigate to="/dashboard" />;
    }
    if (info.role === "institution") {
      return <Navigate to="/inst-about" />;
    }
    if (info.role === "writer") {
      return <Navigate to="/writer-dashboard" />;
    }
  }

  if (hideHeader) {
    return (<ChildComponent />);
  }

  return (
    <HomeLayout displayFooter={displayFooter} >
      <ChildComponent />
    </HomeLayout>
  );
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
            element={<ProtectedRoute title="Dashboard" ChildComponent={Dashboard} role="admin" />}
          />
          <Route
            path="/books"
            element={<ProtectedRoute title="Books" ChildComponent={Book} role="admin" />}
          />
          <Route
            path="/institutions"
            element={<ProtectedRoute title="Institutions" ChildComponent={Institution} role="admin" />}
          />
          <Route
            path="/categories"
            element={<ProtectedRoute title="Categories" ChildComponent={Category} role="admin" />}
          />
           <Route
            path="/orders"
            element={<ProtectedRoute title="Orders" ChildComponent={Order} role="admin" />}
          />
          <Route
            path="/users"
            element={<ProtectedRoute title="Users" ChildComponent={User} role="admin" />}
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
          <Route
            path="/user-purchases"
            element={<ProtectedRoute ChildComponent={UserPurchase} role="user" />}
          />
          <Route
            path="/read-book/:pid/:pname"
            element={<ProtectedRoute ChildComponent={ReadComponent} role="user" />}
          />
          {/* Routes that require "WRITER" role */}
          <Route
            path="/writer-profile"
            element={<ProtectedRoute title="Profile" ChildComponent={Profile} role="writer" />}
          />
          <Route
            exact
            path="/writer-dashboard"
            element={<ProtectedRoute title="Dashboard" ChildComponent={WriterDashboard} role="writer" />}
          />
          <Route
            exact
            path="/writer-books"
            element={<ProtectedRoute title="Books" ChildComponent={BookPublished} role="writer" />}
          />
          {/* Routes that require "INSTITUTION" role */}
          <Route
            path="/inst-home"
            element={<ProtectedRoute title="Home" ChildComponent={InstHome} role="institution" />}
          />
          <Route
            path="/inst-about"
            element={<ProtectedRoute title="About Us" ChildComponent={InstAbout} role="institution" />}
          />
          <Route
            path="/inst-team"
            element={<ProtectedRoute title="Our Team" ChildComponent={InstTeam} role="institution" />}
          />
          <Route
            path="/inst-departments"
            element={<ProtectedRoute title="Departments" ChildComponent={InstDepartment} role="institution" />}
          />
          <Route
            path="/inst-events"
            element={<ProtectedRoute title="Events" ChildComponent={InstEvent} role="institution" />}
          />
          <Route
            path="/inst-notices"
            element={<ProtectedRoute title="Notices" ChildComponent={InstNotice} role="institution" />}
          />
          <Route
            path="/inst-contact"
            element={<ProtectedRoute title="Contact Us" ChildComponent={InstContact} role="institution" />}
          />
          <Route
            path="/inst-user-profile"
            element={<ProtectedRoute title="Profile" ChildComponent={Profile} role="institution" />}
          />
          <Route
            path="/inst-users"
            element={<ProtectedRoute title="Users" ChildComponent={InstUser} role="institution" />}
          />
          {/* Routes that don't require any role */}
          <Route
            path="/register"
            element={<RenderPage hideHeader={true} ChildComponent={Register} />}
          />
          <Route
            path="/login"
            element={<RenderPage hideHeader={true} ChildComponent={Login} />}
          />
          <Route
            path="/"
            element={<RenderPage displayFooter={true} ChildComponent={Home} />}
          />
          <Route
            path="/book-store/:bType"
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
