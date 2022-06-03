import React, { useEffect } from "react";
import { Button, Col, Form, Input, message, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import LocalStore from "../../library/localStore";
import Request from "../../library/request";
import { LOGIN_SUCCESS } from "../../constants";
import "../../resources/authentication.css";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = (values) => {
    Request
      .post("/api/users/login", values)
      .then(res => {
        const { success, data: token } = res.data;

        if (success) {
          LocalStore.set(token);
          const {iat, createdAt, expiredAt, ...payload} = LocalStore.decodeToken(token);
          dispatch({ type: LOGIN_SUCCESS, payload });
          message.success("Login successful!!");

          /* Go to dashboard if 'admin' or home page for 'user' */
          if (payload.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        } else {
          message.error("Unsuccessful login attempt!!");
        }
      })
      .catch((err) => {
        message.error("Something went wrong!!");
      });
  };

  useEffect(() => {
    /* Go to dashboard if 'admin' or home page for 'user' */
    const payload = LocalStore.decodeToken();

    if (payload) {
      if (payload.role === "admin") {
        navigate("/dashboard");
      }
      if (payload.role === "user") {
        navigate("/");
      }
    }
  }, []);

  return (
    <div className="authentication">
      <Row>
        <Col lg={8} xs={22}>
          <Form layout="vertical" onFinish={onFinish}>
            <h3>Login</h3><hr /><br />

            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "" }]}
            >
              <Input type="password" />
            </Form.Item>

            <Button block htmlType="submit" type="primary">
              Login
            </Button>

            <div
              className="d-flex justify-content-between align-items-center"
              style={{ marginTop: "20px", fontSize: "12px" }}
            >
              <Link to="/">
                <a href="/">Go to Home</a> 
              </Link>
              <Link to="/register">
                <a href="/register">Not Yet Registered ? Click Here To Register</a>
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default LoginComponent;
