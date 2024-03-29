import React from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { Layout, message } from "antd";
import { get } from "lodash";
import { ShoppingCartOutlined, LoginOutlined } from "@ant-design/icons";

import LocalStore from "../library/localStore";
import { ALL_BOOKS, LOG_OUT } from "../constants";
import Footer from "./Footer";
import Logo from "../resources/logo.png";
import "../resources/layout.css";

const { Header, Content } = Layout;

const HomeLayout = props => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payload = LocalStore.decodeToken();
  const isLoggedIn = get(payload, "role") === "user" && Date.now() < payload.expiredAt;
  const { common: { loading }, cart: { cartItems } } = useSelector(state => state);

  const getClass = (arr = []) => {
    const p = location.pathname.split("/")[1];

    if (!p) {
      return arr.includes("home") ? "m-10 m-10-selected" : "m-10";
    }
    return arr.includes(p) ? "m-10 m-10-selected" : "m-10";
  };

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
          <Link to="/" className={getClass(["home"])}>
            Home
          </Link>
          <Link to={`/book-store/${ALL_BOOKS}`} className={getClass(["book-store"])}>
            Books
          </Link>
          <Link to="/category-store" className={getClass(["category-store"])}>
            Categories
          </Link>
          <Link to="/institution-list" className={getClass(["institution-list", "institution-info"])}>
            Institutions
          </Link>
          { isLoggedIn && (
            <>
              <Link to="/user-purchases" className={getClass(["user-purchases", "read-book"])}>
                Purchases
              </Link>
              <Link to="/user-orders" className={getClass(["user-orders"])}>
                Orders
              </Link>
              <Link to="/user-profile" className={getClass(["user-profile"])}>
                Profile
              </Link>
            </>
          )}
          {!isLoggedIn && (
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
              {(cartItems || []).length}
            </span>
          </div>
          {isLoggedIn && (
            <div
              className="d-flex align-items-center cart-div"
              onClick={() => {
                message.info("Logged out successfully!!");
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
          )}
        </div>
      </Header>
      <Content
        className="site-layout-background"
        style={{
          backgroundColor: "#eff0f3",
          scroll: "none",
          ...props.contentStyle,
        }}
      >
        {props.children}
        {props.displayFooter && <Footer />}
      </Content>
    </Layout>
  );
};

export default HomeLayout;
