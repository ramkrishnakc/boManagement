import React from "react";
import { Layout, Menu, message } from "antd";
import {
  DashboardOutlined,
  BlockOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CopyOutlined,
  LoginOutlined,
  UserSwitchOutlined,
  AppstoreAddOutlined,
  UserAddOutlined,
  ReadOutlined,
  BankOutlined,
  TeamOutlined,
  CopyrightOutlined,
  NotificationOutlined,
  PictureOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { APP_NAME, APP_NAME_ABBR, LOG_OUT, TOGGLE_SIDEBAR } from "../constants";
import "../resources/layout.css";

const { Header, Sider, Content } = Layout;

const DefaultLayout = (props) => {
  const { common: { loading, sidbarCollapse }, login: { role } } = useSelector(state => state);
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
          <h3>{sidbarCollapse ? APP_NAME_ABBR : APP_NAME}</h3>
        </div>
        <div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={window.location.pathname}
          >
            {/* Menu for the "ADMIN" users */}
            {role === "admin" && (<>
              <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
                <Link to="/dashboard">Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="/books" icon={<ReadOutlined />}>
                <Link to="/books">Books</Link>
              </Menu.Item>
              <Menu.Item key="/categories" icon={<AppstoreAddOutlined />}>
                <Link to="/categories">Categories</Link>
              </Menu.Item>
              <Menu.Item key="/institutions" icon={<BankOutlined />}>
                <Link to="/institutions">Institutions</Link>
              </Menu.Item>
              <Menu.Item key="/orders" icon={<CopyOutlined />}>
                <Link to="/orders">Orders</Link>
              </Menu.Item>
              <Menu.Item key="/users" icon={<UserAddOutlined />}>
                <Link to="/users">Users</Link>
              </Menu.Item>
            </>)}

            {/* Menu for the "Writer" users */}
            {role === "writer" && (
              <>
                <Menu.Item key="/writer-dashboard" icon={<DashboardOutlined />}>
                  <Link to="/writer-dashboard">Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="/writer-books" icon={<ReadOutlined />}>
                  <Link to="/writer-books">Books</Link>
                </Menu.Item>
              </>
            )}

            {/* Menu for the Institutions i.e school & colleges */}
            {role === "institution" && (<>
              <Menu.Item key="/inst-home" icon={<BankOutlined />}>
                <Link to="/inst-home">Home</Link>
              </Menu.Item>
              <Menu.Item key="/inst-about" icon={<BlockOutlined />}>
                <Link to="/inst-about">About Us</Link>
              </Menu.Item>
              <Menu.Item key="/inst-team" icon={<TeamOutlined />}>
                <Link to="/inst-team">Our Team</Link>
              </Menu.Item>
              <Menu.Item key="/inst-departments" icon={<AppstoreOutlined />}>
                <Link to="/inst-departments">Departments</Link>
              </Menu.Item>
              <Menu.Item key="/inst-events" icon={<PictureOutlined />}>
                <Link to="/inst-events">Events</Link>
              </Menu.Item>
              <Menu.Item key="/inst-notices" icon={<NotificationOutlined />}>
                <Link to="/inst-notices">Notices</Link>
              </Menu.Item>
              <Menu.Item key="/inst-contact" icon={<CopyrightOutlined />}>
                <Link to="/inst-contact">Contact Us</Link>
              </Menu.Item>
              <Menu.Item key="/inst-users" icon={<UserAddOutlined />}>
                <Link to="/inst-users">Admins</Link>
              </Menu.Item>
            </>)}
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
                if (role === "admin") {
                  navigate("/profile");
                }
                if (role === "institution") {
                  navigate("/inst-user-profile");
                }
                if (role === "writer") {
                  navigate("/writer-profile");
                }
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
