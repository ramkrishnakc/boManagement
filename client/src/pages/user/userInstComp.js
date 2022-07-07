import React, { useEffect, useState } from "react";
import { DeleteFilled, EyeOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal } from "antd";
import { get } from "lodash";

import { DEFAULT_ERR_MSG } from "../../constants";
import { LocalStore, Request } from "../../library";
import { Confirm, TableComponent } from "../../components";

const SEARCH_FIELDS = ["username", "email"];

const UserComponent = () => {
  const token = LocalStore.decodeToken();
  const refId = get(token, "institution"); // Institution ID
  const userId = get(token, "id");
  const [itemsData, setItemsData] = useState([]); // All data fetched from server
  const [tableData, setTableData] = useState([]); // Required for Search in table
  const [openModel, setOpenModel] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // Search keyword
  const [confirmOpt, setOpenConfirm] = useState({}); // Handle open/close confirmation

  const getAll = async () => {
    try {
      if (refId) {
        const {
          data: { success, data },
        } = await Request.get(`/api/users/get-inst-users/${refId}`);
        if (success) {
          setItemsData(data);
          setTableData(data);
        }
      }
    } catch (err) {}
  };

  const deleteItem = async record => {
    try {
      const {
        data: { success, message: msg },
      } = await Request.delete(`/api/users/remove-inst-user/${refId}/${record._id}`);
      
      if (success) {
        message.success(msg);
        const newData = itemsData.filter(d => d._id !== record._id);
        setItemsData(newData);
        setTableData(newData);
        setOpenConfirm({});
      } else {
        message.error(msg);
      }
    } catch (err) {
      message.error(DEFAULT_ERR_MSG);
    }
  };

  const onFinish = data =>
    Request
      .post(`/api/users/add-inst-user/${refId}`, data)
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
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          {record._id !== userId &&
            <DeleteFilled
              title="Remove"
              className="mx-2"
              onClick={() => setOpenConfirm({
                msg: "Do you want to remove this user?",
                visible: true,
                onOk: () => deleteItem(record),
              })}
            />
          }
          <EyeOutlined title="Details" className="mx-2" onClick={() => showInfo(record)} />
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
    if (!get(e, "target.value")) {
      onSearch("");
    }
  };

  return (
    <>
      <TableComponent
        columns={columns}
        dataSource={tableData}
        bordered={true}
        showSearch={true}
        searchPlaceholder="Search for the users..."
        onSearch={onSearch}
        onChange={onChange}
        showAddButton={true}
        addButtonLabel="+ New User"
        buttonOnClick={() => setOpenModel(true)}
      />

      {openModel && (
        <Modal
          onCancel={() => {
            setOpenModel(false);
            setUserDetail(null);
          }}
          visible={openModel}
          title={userDetail ? "User Details" : "Add New User"}
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
                initialValues={{
                  username: "",
                  email: "",
                  password: "",
                  role: "admin",
                }}
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
                        
                        if (!value || (reg.test(value) && getFieldValue('username') !== value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject("");
                      },
                    }),
                  ]}
                >
                  <Input type="password"/>
                </Form.Item>
                <ul className="pwd-info-class">
                  <li>At least 8 characters long.</li>
                  <li>At least one uppercase letter.</li>
                  <li>At least one lowercase letter.</li>
                  <li>At least one digit.</li>
                  <li>At least one special character.</li>
                </ul>
    
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
      {confirmOpt.visible && (
        <Confirm
          visible={confirmOpt.visible}
          onOk={confirmOpt.onOk}
          msg={confirmOpt.msg}
          onCancel={() => setOpenConfirm({})}
        />
      )}
    </>
  );
}

export default UserComponent;
