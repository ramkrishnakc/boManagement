import React from 'react';
import { Button, Col, Form, Input, message, Row } from "antd";
import { Link } from 'react-router-dom';

import Request from '../../library/request';
import { REQUIRED } from "../../constants";
import '../../resources/authentication.css';

const RegisterComponent = () => {

  const onFinish = values => {
    Request
      .post('/api/users/signup' , values)
      .then(res => message.success('Registration successful , please wait for verification'))
      .catch(() => {
        message.error('Something went wrong');
      });
  };

  return (
    <div className='authentication'>
      <Row>
        <Col lg={8} xs={22}>
          <Form layout="vertical" onFinish={onFinish}>
            <h1><b>Learn Nepal</b></h1>
            <hr />
            <h3>Register</h3>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: REQUIRED },
                { min: 5, message: "Minlength: 5" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: REQUIRED },
                () => ({
                  validator(rule, value) {
                    const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    if (!value || emailReg.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Enter valid email.");
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
                { required: true, message: REQUIRED },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    const reg = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
                    
                    if (!value || reg.test(value) || getFieldValue('username') !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Password criteria not matched.");
                  },
                }),
              ]}
            >
              <Input type='password'/>
              <ul style={{ fontSize: "11px" }}>
                <li>At least 8 characters long.</li>
                <li>At least one uppercase letter.</li>
                <li>At least one lowercase letter.</li>
                <li>At least one digit.</li>
                <li>At least one special character.</li>
              </ul>
            </Form.Item>

            <div className="d-flex justify-content-between align-items-center">
              <Link to='/login'>Already Registered ? Click Here To Login</Link>
              <Button htmlType="submit" type="primary">
                Register
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

export default RegisterComponent;
