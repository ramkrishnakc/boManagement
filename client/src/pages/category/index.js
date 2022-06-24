import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Upload } from "antd";

import Request from "../../library/request";
import Confirm from "../../components/Confirm";
import TableComponent from "../../components/Table";
import DefaultLayout from "../../components/DefaultLayout";
import { DEFAULT_ERR_MSG } from "../../constants";
import noImage from "../../resources/no-image.png";

const TextArea = Input.TextArea;
const SEARCH_FIELDS = ["name"];

const CategoryComponent = () => {
  const [itemsData, setItemsData] = useState([]); // All data fetched from server
  const [tableData, setTableData] = useState([]); // Required for Search in table
  const [openModel, setOpenModel] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // Search keyword
  const [confirmOpt, setOpenConfirm] = useState({}); // Handle open/close confirmation

  const getAll = async () => {
    try {
      const {data: { success, data }} = await Request.get(`/api/category/getAll`);

      if (success) {
        setItemsData(data);
        setTableData(data);
      }
    } catch (err) {}
  };

  const deleteItem = async record => {
    try {
      const {data: {success, message: msg}} = await Request.delete(`/api/category/remove/${record._id}`);
      
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
      title: "No. of Books",
      dataIndex: "bookCount",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EditOutlined
            className="mx-2"
            onClick={() => {
              setEditData(record);
              setOpenModel(true);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => setOpenConfirm({
              msg: "Do you want to remove this category?",
              visible: true,
              onOk: () => deleteItem(record),
            })}
          />
        </div>
      ),
    },
  ];

  useEffect(() => getAll(), []);

  const onFinish = data => {
    const uriArr = ['', 'api', 'category'];
    let method = "post";

    if (editData) {
      uriArr.push('update', editData._id);
      method = "put";
    } else {
      uriArr.push('add');
    }

    const formKeys = Object.keys(data).filter(d => d !== "image");
    const formData = new FormData();

    formKeys.forEach(key => {
      if (data[key]) {
        formData.append(key, data[key]);
      }
    });

    const file = data.image && data.image.file && data.image.file.originFileObj;

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
        <h3>Categories</h3>
      </div>
      <TableComponent
        columns={columns}
        dataSource={tableData}
        bordered={true}
        showSearch={true}
        searchPlaceholder="Search for the category..."
        onSearch={onSearch}
        onChange={onChange}
        showAddButton={true}
        addButtonLabel="+ New Category"
        buttonOnClick={() => setOpenModel(true)}
      />

      {openModel && (
        <Modal
          onCancel={() => {
            setEditData(null);
            setOpenModel(false);
          }}
          visible={openModel}
          title={`${editData ? "Edit Category" : "Add New Category"}`}
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
            <Form.Item name="description" label="Description">
              <TextArea rows={4} />
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
    </DefaultLayout>
  );
}

export default CategoryComponent;
