import React, { useEffect, useState } from "react";
import { Layout, message } from "antd";
import { ShoppingCartOutlined, LoginOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../resources/logo.png";

import LocalStore from "../library/localStore";
import { LOG_OUT } from "../constants";
import Footer from "./Footer";
import "../resources/layout.css";

const { Header, Content } = Layout;

const Heading = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { loading } = useSelector(state => state.common); 
  const cartItems = [];

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const payload = LocalStore.decodeToken();

    if (payload && payload.role === "user") {
      setLoggedIn(true);
    }
  }, []);

  return (
    <Layout>
      {loading && (
        <div className="spinner">
          <div class="spinner-border" role="status"></div>
        </div>
      )}
      <Header className="sticky-header" style={{ padding: 0 }}>
        <div className="logobar">
          <img src={Logo} alt="" height="44px" width="44px" />
        </div>
        <div className="d-flex align-items-center menu-items">
          <Link to="/" className="m-10">
            Home
          </Link>
          <Link to="/book-store" className="m-10">
            Books
          </Link>
          <Link to="/category-store" className="m-10">
            Categories
          </Link>
          { isLoggedIn && (
            <Link to="/user-profile" className="m-10">
              Profile
            </Link>
          )}
          { !isLoggedIn && (
            <>
              <Link to="/login" className="loginbutton ">
                Login
              </Link>
              <Link to="/register" className="loginbutton">
                Register
              </Link>
            </>
          )}
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
          {isLoggedIn && (
            <div
              className="d-flex align-items-center cart-div"
              onClick={() => {
                dispatch({ type: LOG_OUT });
                navigate("/");
                message.info("Logged out successfully!!");
                setLoggedIn(false);
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
          )}
        </div>
      </Header>
      <Content
        className="site-layout-background"
        style={{
          minHeight: "100vh",
          backgroundColor: "#eff0f3",
          scroll: "none",
          ...props.contentStyle,
        }}
      >
        {props.children}
        {!props.hideFooter && <Footer />}
      </Content>
    </Layout>
  );
};

export default Heading;
