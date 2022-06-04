import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message, Row, Col } from "antd";

import Request from "../../library/request";
import DefaultLayout from "../../components/DefaultLayout";
import { DEFAULT_ERR_MSG, LOG_OUT } from "../../constants";

const Profile = props => {
  const { id: userId } = useSelector(state => state.login);
  const [userInfo, setUserInfo] = useState({});
  const [dataFetched, setDataFetched] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getUserInfo = async () => {
    try {
      const {data: { success, data }} = await Request.get(`/api/users/getById/${userId}`);
        
      if (success) {
        setUserInfo({
          name: data.name || "",
          contactNum: data.contactNum || "",
          address: data.address || "",
        });
        setDataFetched(true);
      }
    } catch (err) {}
  };

  useEffect(() => getUserInfo(), []);

  const onUpdateInfo = async values => {
    try {
      const {data: {success, message: msg}} = await Request.put(`/api/users/update/${userId}`, values);

      if (success) {
        message.success(msg);
      } else {
        message.error(msg);
      }
    } catch (err) {
      message.error(DEFAULT_ERR_MSG);
    }
  };

  const onChangePassword = async values => {
    try {
      const {data: {success, message: msg}} = await Request.put(`/api/users/pwdUpdate/${userId}`,
        { oldPassword: values.oldPassword, password: values.password });
      
      if (success) {
        dispatch({ type: LOG_OUT });
        message.success(msg);
        navigate("/login");
      } else {
        message.error(msg);
      }
    } catch (err) {
      message.error(DEFAULT_ERR_MSG);
    }
  };

  return (
    <>
      {props.hideHeader
        ? ""
        : (
          <div className="d-flex justify-content-between">
            <h3>Profile</h3>
          </div>
        )}
      {dataFetched && <Row className="profile-row">
        <Col span={12} className="profile-col-1">
          <h5>Update Info:</h5><br />
          <Form
            initialValues={userInfo}
            layout="vertical"
            onFinish={onUpdateInfo}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="contactNum"
              label="Contact No."
              rules={[{ required: true, message: "" }]}
            >
              <Input />
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">
                SUBMIT
              </Button>
            </div>
          </Form>
        </Col>
        <Col span={11} className="profile-col-2">
          <h5>Change Password:</h5><br />
          <Form layout="vertical" onFinish={onChangePassword}>
            <Form.Item
              name="oldPassword"
              label="Old Password"
              rules={[{ required: true, message: "" }]}
            >
              <Input type="password"/>
            </Form.Item>
            <Form.Item
              name="password"
              label="New Password"
              rules={[
                { required: true, message: "" },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("oldPassword") === value) {
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
              <Input type="password"/>
            </Form.Item>
            <Form.Item
              name="rePassword"
              label="Retype New Password"
              rules={[
                { required: true, message: "Please re-type you New Password." },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Does not match with `password`');
                  },
                }),
              ]}
            >
              <Input type="password"/>
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">
                SUBMIT
              </Button>
            </div>
            <ul>
              <li>At least 8 characters long.</li>
              <li>At least one uppercase letter.</li>
              <li>At least one lowercase letter.</li>
              <li>At least one digit.</li>
              <li>At least one special character.</li>
              <li>Should be different than existing password.</li>
            </ul>
          </Form>
        </Col>
      </Row>}
    </>
  );
}

const ProfileComponent = props => {
  return props.hideWrapper
    ? <Profile hideHeader />
    : (<DefaultLayout><Profile /></DefaultLayout>);
};
export default ProfileComponent;
