import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Form, Input, message, Row } from "antd";

import Request from '../../library/request';
import '../../resources/authentication.css';

const RegisterComponent = () => {
  const { loading } = useSelector(state => state.common);
  const navigate = useNavigate();

  const onFinish = values => {
    Request
      .post('/api/users/signup' , values)
      .then(res => {
        if (res.data.success) {
          message.success('Registration successful, please check your email for verification. Check spam if not in inbox.');
          navigate("/");
        } else {
          message.error('Registration Failed, try again later.');
        }
      })
      .catch(() => {
        message.error('Something went wrong');
      });
  };

  return (
    <div className='authentication'>
      {loading && (
        <div className="spinner">
          <div class="spinner-border" role="status"></div>
        </div>
      )}
      {!loading && (<Row>
        <Col lg={8} xs={22}>
          <Form layout="vertical" onFinish={onFinish}>
            <h3>Register</h3><hr /><br />
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: "" },
                { min: 5, message: "Minlength: 5" },
                { max: 20, message: "Maxlength: 20" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "" },
                () => ({
                  validator(rule, value) {
                    const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    if (!value || emailReg.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject("");
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('username') === value) {
                      return Promise.reject("");
                    }

                    const reg = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
                    if (reg.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject("");
                  },
                }),
              ]}
            >
              <Input type='password'/>
            </Form.Item>
            <ul style={{ fontSize: "10px", padding: "0px 0px 0px 15px", marginTop: "-20px" }}>
              <li>At least 8 characters long.</li>
              <li>At least one uppercase letter.</li>
              <li>At least one lowercase letter.</li>
              <li>At least one digit.</li>
              <li>At least one special character.</li>
            </ul>

            <Button block htmlType="submit" type="primary">
              Register
            </Button>

            <div
              className="d-flex justify-content-between align-items-center"
              style={{ marginTop: "20px", fontSize: "12px" }}
            >
              <Link to="/">
                <a href="/">Go to Home</a> 
              </Link>
              <Link to='/login'>
                <a href="/login">Already Registered ? Click Here To Login</a> 
              </Link>
            </div>
          </Form>
        </Col>
      </Row>)}
    </div>
  )
}

export default RegisterComponent;
