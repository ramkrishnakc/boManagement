import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { Button, Col, Form, Input, message, Row } from "antd";

import { LocalStore, Request} from "../../library";
import { LOGIN_SUCCESS } from "../../constants";
import "../../resources/authentication.css";

const LoginComponent = () => {
  const { loading } = useSelector(state => state.common);
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
          } else if (payload.role === "institution") {
            navigate("/inst-about");
          } else {
            navigate("/");
          }
        } else {
          message.error("Unsuccessful login attempt!!");
        }
      })
      .catch((err) => {
        message.error("Something went wrong. Probably, invalid username | password !!");
      });
  };

  useEffect(() => {
    /* Go to dashboard if 'admin', about page if 'institution' or home page for 'user' */
    const payload = LocalStore.decodeToken();

    if (payload) {
      if (payload.role === "admin") {
        navigate("/dashboard");
      }
      if (payload.role === "institution") {
        navigate("/inst-about");
      }
      if (payload.role === "user") {
        navigate("/");
      }
    }
  }, []);

  return (
    <div className="authentication">
      {loading && (
        <div className="spinner">
          <div class="spinner-border" role="status"></div>
        </div>
      )}
      {!loading && (<Row>
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
      </Row>)}
    </div>
  );
}

export default LoginComponent;
