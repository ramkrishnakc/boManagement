import React from "react";
import { Layout, Menu, message } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  CopyOutlined,
  LoginOutlined,
  UserSwitchOutlined,
  AppstoreAddOutlined,
  UserAddOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { LOG_OUT, TOGGLE_SIDEBAR } from "../constants";
import "../resources/layout.css";

const { Header, Sider, Content } = Layout;

const DefaultLayout = (props) => {
  const { loading, sidbarCollapse } = useSelector(state => state.common);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggle = () => {dispatch({ type: TOGGLE_SIDEBAR, payload: !sidbarCollapse })};

  return (
    <Layout>
      {loading && (
        <div className="spinner">
          <div class="spinner-border" role="status"></div>
        </div>
      )}
      <Sider trigger={null} collapsible collapsed={sidbarCollapse}>
        <div className="logo">
          <h3>{sidbarCollapse ? "LN" : "LEARN NEPAL"}</h3>
        </div>
        <div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={window.location.pathname}
          >
            <Menu.Item key="/dashboard" icon={<HomeOutlined />}>
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="/categories" icon={<AppstoreAddOutlined />}>
              <Link to="/categories">Categories</Link>
            </Menu.Item>
            <Menu.Item key="/books" icon={<ReadOutlined />}>
              <Link to="/books">Books</Link>
            </Menu.Item>
            <Menu.Item key="/orders" icon={<CopyOutlined />}>
              <Link to="/orders">Orders</Link>
            </Menu.Item>
            <Menu.Item key="/users" icon={<UserAddOutlined />}>
              <Link to="/users">Users</Link>
            </Menu.Item>
          </Menu>
        </div>
      </Sider>
      <Layout className="site-layout default-admin-layout">
        <Header className="site-layout-background default-header-layout">
          {React.createElement(
            sidbarCollapse ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}
          <div className="d-flex header-icons-right">
            <div
              className="d-flex align-items-center cart-div"
              onClick={() => {
                navigate("/profile");
              }}
            >
              <UserSwitchOutlined />
              <span
                title="Navigate to user profile page"
                className="d-flex cart-span"
              >
                Profile
              </span>
            </div>
            <div
              className="d-flex align-items-center cart-div"
              onClick={() => {
                dispatch({ type: LOG_OUT });
                navigate("/");
                message.success("Logged out successfully!!");
              }}
            >
              <LoginOutlined />
              <span
                title="Log out from application"
                className="d-flex cart-span log-out-span"
              >
                Log Out
              </span>
            </div>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            padding: 15,
            minHeight: "80vh",
            backgroundColor: "#eff0f3",
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
