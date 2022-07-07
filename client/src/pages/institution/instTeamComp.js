import React, { useEffect, useState } from "react";
import { get } from "lodash";
import { Button, Form, Input, message, Modal, Upload } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";

import { LocalStore, Request } from "../../library";
import { Confirm, TableComponent } from "../../components";
import { DEFAULT_ERR_MSG } from "../../constants";
import noImage from "../../resources/no-image.png";

const TextArea = Input.TextArea;
const SEARCH_FIELDS = ["name", "position", "department"];

const InstTeam = () => {
  const refId = get(LocalStore.decodeToken(), "institution"); // Institution ID
  const [itemsData, setItemsData] = useState([]); // All data fetched from server
  const [tableData, setTableData] = useState([]); // Required for Search in table
  const [openModel, setOpenModel] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // Search keyword
  const [confirmOpt, setOpenConfirm] = useState({}); // Handle open/close confirmation

  const getAll = async () => {
    try {
      const {data: { success, data }} = await Request.get(`/api/institution/getByRefId-team/${refId}`);

      if (success && data) {
        setItemsData(data);
        setTableData(data);
      }
    } catch (err) {}
  };

  const deleteItem = async record => {
    try {
      const {
        data: { success, message: msg },
      } = await Request.delete(`/api/institution/remove-team/${refId}/${record._id}`);
      
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: img => <img src={img || noImage} alt="" height="60" width="60" />,
    },
    {
      title: "Position",
      dataIndex: "position",
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EditFilled
            className="mx-2"
            onClick={() => {
              setEditData(record);
              setOpenModel(true);
            }}
          />
          <DeleteFilled
            className="mx-2"
            onClick={() => setOpenConfirm({
              msg: "Do you want to remove this team member info?",
              visible: true,
              onOk: () => deleteItem(record),
            })}
          />
        </div>
      ),
    },
  ];

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

  const onFinish = data => {
    const uriArr = ['', 'api', 'institution'];
    let method = "post";

    if (editData) {
      uriArr.push('update-team', refId, editData._id);
      method = "put";
    } else {
      uriArr.push('add-team', refId);
    }

    const formKeys = Object.keys(data).filter(d => d !== "image");
    const formData = new FormData();

    formKeys.forEach(key => {
      if (data[key]) {
        formData.append(key, data[key]);
      }
    });

    const file = get(data, "image.file.originFileObj");
    if (file) {
      formData.append("file", file);
    }
    
    Request[method](uriArr.join("/"), formData)
      .then(res => {
        const { success, message: msg } = res.data;

        if (success) {
          message.success(msg);
          setEditData(null);
          setOpenModel(false);
          getAll();
        } else {
          message.error(msg);
        }
      })
      .catch(() => message.error(DEFAULT_ERR_MSG));
  };

  useEffect(() => getAll(), []);

  return (
    <>
      <TableComponent
        columns={columns}
        dataSource={tableData}
        bordered={true}
        showSearch={true}
        searchPlaceholder="Search for the team member..."
        onSearch={onSearch}
        onChange={onChange}
        showAddButton={true}
        addButtonLabel="+ New"
        buttonOnClick={() => setOpenModel(true)}
      />

      {openModel && (
        <Modal
          onCancel={() => {
            setEditData(null);
            setOpenModel(false);
          }}
          visible={openModel}
          title={`${editData ? "Edit Member Info" : "Add Member Info"}`}
          footer={false}
          className="book-model-class"
        >
          <Form
            initialValues={editData}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="position"
              label="Designation"
              rules={[{ required: true, message: "" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: "" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="image" label="Image">
              <Upload>
                <div class="ant-col ant-form-item-control">
                  <div class="ant-form-item-control-input">
                    <div class="ant-form-item-control-input-content">
                      <div class="ant-input">
                        Choose a file
                      </div>
                    </div>
                  </div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item name="about" label="About">
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item name="website" label="Website">
              <Input />
            </Form.Item>
            <Form.Item name="linkedIn" label="LinkedIn">
              <Input />
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">
                SAVE
              </Button>
            </div>
          </Form>
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
};

export default InstTeam;
