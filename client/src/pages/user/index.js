import React, { useEffect, useState } from "react";
import { DeleteOutlined, CheckCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal } from "antd";

import Request from "../../library/request";
import TableComponent from "../../components/Table";
import DefaultLayout from "../../components/DefaultLayout";
import { DEFAULT_ERR_MSG } from "../../constants";

const SEARCH_FIELDS = ["username", "email", "verified", "role", "name"];

const UserComponent = () => {
  const [itemsData, setItemsData] = useState([]); // All data fetched from server
  const [tableData, setTableData] = useState([]); // Required for Search in table
  const [openModel, setOpenModel] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // Search keyword

  const getAll = async () => {
    try {
      const {data: { success, data }} = await Request.get(`/api/users/getAll`);
      if (success) {
        setItemsData(data);
        setTableData(data);
      }
    } catch (err) {}
  };

  const deleteItem = async record => {
    try {
      const {data: {success, message: msg}} = await Request.delete(`/api/users/remove/${record._id}`);
      
      if (success) {
        message.success(msg);
        const newData = itemsData.filter(d => d._id !== record._id);
        setItemsData(newData);
        setTableData(newData);
      } else {
        message.error(msg);
      }
    } catch (err) {
      message.error(DEFAULT_ERR_MSG);
    }
  };

  const onFinish = (data, editData) => {
    const uriArr = ['', 'api', 'users'];
    let method = "post";
    let body = {};

    if (editData) {
      uriArr.push('verify', editData._id);
      method = "put";
    } else {
      body = {...data, role: "admin"};
      uriArr.push('add');
    }
    
    Request[method](uriArr.join("/"), body)
      .then(res => {
        const { success, message: msg } = res.data;

        if (success) {
          message.success(msg);
          setOpenModel(false);
          getAll();
        } else {
          message.error(msg);
        }
      })
      .catch(() => message.error(DEFAULT_ERR_MSG));
  };

  const showInfo = data => {
    setOpenModel(true);
    setUserDetail(data);
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Verified",
      dataIndex: "verified",
      render: bool => (
        <div className="d-flex">
          {bool ? "Yes" : "No"}
        </div>
      )
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          {record.role !== "root" &&
            <DeleteOutlined title="Remove" className="mx-2" onClick={() => deleteItem(record)} />
          }
          <EyeOutlined title="Details" className="mx-2" onClick={() => showInfo(record)} />
          {!record.verified &&
            <CheckCircleOutlined title="Verify" className="mx-2" onClick={() => onFinish(null, record)} />
          }
        </div>
      ),
    },
  ];

  useEffect(() => getAll(), []);

  /* Handle search */
  const onSearch = (str = "") => {
    const keyword = str.replace(/\s/g, "").toLowerCase();

    if (searchKeyword !== keyword) {
      setSearchKeyword(keyword);

      if (!keyword) {
        return setTableData(itemsData);
      }

      const reg = new RegExp(keyword);
      const filteredData = itemsData.filter(obj => {
        const text = SEARCH_FIELDS.reduce((acc, key) => {
          acc += obj[key] || "";
          return acc;
        }, "");

        return reg.test(text.replace(/\s/g, "").toLowerCase());
      });
      setTableData(filteredData);
    }
  };

  /* Handle change in search input */
  const onChange = e => {
    const keyword = e && e.target && e.target.value;

    if (!keyword) {
      onSearch("");
    }
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>Users</h3>
      </div>
      <TableComponent
        columns={columns}
        dataSource={tableData}
        bordered={true}
        showSearch={true}
        searchPlaceholder="Search for the users..."
        onSearch={onSearch}
        onChange={onChange}
        showAddButton={true}
        addButtonLabel="+ New Admin User"
        buttonOnClick={() => setOpenModel(true)}
      />

      {openModel && (
        <Modal
          onCancel={() => {
            setOpenModel(false);
            setUserDetail(null);
          }}
          visible={openModel}
          title={userDetail ? "User Details" : "Add New Admin User"}
          footer={false}
          className="book-model-class"
        >
          {
            userDetail
            ? <>
              {Object.keys(userDetail).map(key => {
                let val = userDetail[key];
                if (typeof val === "boolean") val = val.toString();

                return val ? (
                  <div style={{marginBottom: "5px"}}>
                    <span style={{fontWeight: "bold"}}>{key}</span>: {val}
                  </div>
                ) : "";
              })}
            </>
            : (
              <Form
                layout="vertical"
                onFinish={onFinish}
              >
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    { required: true, message: "" },
                    { min: 5, message: "Minlength: 5" },
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
                    { required: true, message: "" },
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
                  <Input type="password"/>
                  <ul style={{ fontSize: "12px", color: "white" }}>
                    <li>At least 8 characters long.</li>
                    <li>At least one uppercase letter.</li>
                    <li>At least one lowercase letter.</li>
                    <li>At least one digit.</li>
                    <li>At least one special character.</li>
                  </ul>
                </Form.Item>
    
                <div className="d-flex justify-content-end">
                  <Button htmlType="submit" type="primary">
                    SAVE
                  </Button>
                </div>
              </Form>
            )
          }
        </Modal>
      )}
    </DefaultLayout>
  );
}

export default UserComponent;
