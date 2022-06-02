// import React from "react";
import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { ShoppingCartOutlined, LoginOutlined } from "@ant-design/icons";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../resources/logo.png";

import { LOG_OUT } from "../constants";
import Footer from "./Footer";
import "../resources/layout.css";

const { Header, Content } = Layout;

// const UserRoute = ({ children }) => {
//   const info = LocalStore.decodeToken();
  
//   if (info && info.role === "user" && Date.now() < info.expiredAt) {
//     return children;
//   }
//   return <Navigate to="/" />;
// };

const Heading = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggedIn, ] = useState();
  // const { cartItems } = useSelector((state) => state.rootReducer);
  const cartItems = [];

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout>
      <Header className="sticky-header" style={{ padding: 0 }}>
        <div className="logobar">
          <img src={Logo} alt="" height="44px" width="44px" />
        </div>
        <div className="d-flex align-items-center menu-items">
          <Link to="/home" className="m-10">
            Home
          </Link>
          <Link to="/about-us" className="m-10">
            About Us
          </Link>
          <Link to="/contact-us" className="m-10">
            Contact Us
          </Link>
          <Link to="/user-profile" className="m-10">
            Profile
          </Link>
          <Link to="/login" className="loginbutton ">
            Login
          </Link>
          <Link to="/register" className="loginbutton">
            Register
          </Link>
        </div>

        <div className="d-flex header-icons-right">
          <div
            className="d-flex align-items-center cart-div"
            onClick={() => {
              navigate("/cart");
            }}
          >
            <ShoppingCartOutlined />
            <span
              title="Navigate to user profile page"
              className="d-flex cart-span"
            >
              {cartItems.length}
            </span>
          </div>
          <div
            className="d-flex align-items-center cart-div"
            onClick={() => {
              dispatch({ type: LOG_OUT });
              navigate("/");
            }}
          >
            <LoginOutlined />
            <span
              title="Log out from application"
              className="d-flex cart-span"
            >
              Log Out
            </span>
          </div>
        </div>
      </Header>
      <Content
        className="site-layout-background"
        style={{
          minHeight: "100vh",
          backgroundColor: "#eff0f3",
          scroll: "none",
        }}
      >
        {props.children}
        <Footer />
      </Content>
    </Layout>
  );
};

export default Heading;
