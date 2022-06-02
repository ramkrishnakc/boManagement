import React, { useEffect } from "react";
import { Button, Col, Form, Input, message, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import LocalStore from "../../library/localStore";
import Request from "../../library/request";
import { SHOW_LOADER, LOGIN_SUCCESS } from "../../constants";
import "../../resources/authentication.css";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = (values) => {
    dispatch({ type: SHOW_LOADER, payload: true });
    Request
      .post("/api/users/login", values)
      .then(res => {
        dispatch({ type: SHOW_LOADER });
        const { success, data } = res.data;

        if (success) {
          message.success("Login successful!!");
          dispatch({ type: LOGIN_SUCCESS, payload: data });
          
          navigate("/dashboard");
        } else {
          message.error("Unsuccessful login attempt!!");
        }
      })
      .catch(() => {
        dispatch({ type: SHOW_LOADER });
        message.error("Something went wrong!!");
      });
  };

  useEffect(() => {
    if (LocalStore.get()) {
      navigate("/dashboard");
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
