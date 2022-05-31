import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Table, Upload } from "antd";

import Request from "../../library/request";
import DefaultLayout from "../../components/DefaultLayout";
import { DEFAULT_ERR_MSG, REQUIRED } from "../../constants";
import "../../resources/modal.css";

const LANG = ["English", "Nepali", "Hindi", "Others"];

const BookComponent = () => {
  const [itemsData, setItemsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [editData, setEditData] = useState(null);
  const [itemDetail, setItemDetail] = useState(null);

  const getAll = async (reqType = "books") => {
    try {
      const {data: { success, data }} = await Request.get(`/api/${reqType}/getAll`);

      if (success) {
        if (reqType === "books") {
          setItemsData(data);
        } else {
          const normalized = data.reduce((acc, curr) => {
            acc[curr._id] = curr.name;
            return acc;
          }, {});
          setCategoryMap(normalized);
          setCategories(data.map(({ _id, name }) => ({ _id, name })));
        }
      }
    } catch (err) {}
  };

  const deleteItem = async record => {
    try {
      const {data: {success, message: msg}} = await Request.delete(`/api/books/remove/${record._id}`);

      if (success) {
        message.success(msg);
        setItemsData(itemsData.filter(d => d._id !== record._id));
      } else {
        message.error(msg);
      }
    } catch (err) {
      message.error(DEFAULT_ERR_MSG);
    }
  };

  const showInfo = data => {
    setOpenModel(true);
    setItemDetail(data);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: img => <img src={img} alt="" height="60" width="60" />,
    },
    {
      title: "Author",
      dataIndex: "author",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
      render: catId => {
        return categoryMap[catId];
      }
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
          <DeleteOutlined className="mx-2" onClick={() => deleteItem(record)} />
          <EyeOutlined title="Details" className="mx-2" onClick={() => showInfo(record)} />
        </div>
      ),
    },
  ];

  useEffect(() => getAll("category"), []);
  useEffect(() => getAll(), []);

  const onFinish = data => {
    const uriArr = ['', 'api', 'books'];
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

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>Books</h3>
        <Button type="primary" onClick={() => setOpenModel(true)}>
          + New Book
        </Button>
      </div>
      <Table columns={columns} dataSource={itemsData} bordered />

      {openModel && (
        <Modal
          onCancel={() => {
            setEditData(null);
            setOpenModel(false);
            setItemDetail(null);
          }}
          visible={openModel}
          title={`${itemDetail ? "Book Details" : editData ? "Edit Item" : "Add Item"}`}
          footer={false}
          className="book-model-class"
        >
          {
            itemDetail
            ? (<>
              {Object.keys(itemDetail).map(key => {
                let val = itemDetail[key];
                if (typeof val === "boolean") val = val.toString();

                return val ? (
                  <div style={{marginBottom: "5px"}}>
                    <span style={{fontWeight: "bold"}}>{key}</span>: {val}
                  </div>
                ) : "";
              })}
            </>)
            : (
            <Form
              initialValues={editData}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: REQUIRED }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="author"
                label="Author"
                rules={[{ required: true, message: REQUIRED }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="language"
                label="Language"
                rules={[{ required: true, message: REQUIRED }]}
              >
                <Select>
                  {LANG.map(d => <Select.Option value={d}>{d}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: REQUIRED }]}
              >
                <Select>
                  {categories.map(d => <Select.Option value={d._id}>{d.name}</Select.Option>)}
                </Select>
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
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: REQUIRED }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="discount"
                label="Discount"
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input type="textArea" />
              </Form.Item>
              <Form.Item name="publshed" label="Published Year">
                <Input />
              </Form.Item>

              <div className="d-flex justify-content-end">
                <Button htmlType="submit" type="primary">
                  SAVE
                </Button>
              </div>
            </Form>
          )}
        </Modal>
      )}
    </DefaultLayout>
  );
}

export default BookComponent;
