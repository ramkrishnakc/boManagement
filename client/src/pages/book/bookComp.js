import React, { useEffect, useState } from "react";
import { get } from "lodash";
import { DeleteFilled, EditFilled, EyeOutlined } from "@ant-design/icons";
import { Button, Form, Input, Checkbox, message, Modal, Select, Upload } from "antd";

import { Request } from "../../library";
import { Confirm, TableComponent } from "../../components";
import { DEFAULT_ERR_MSG } from "../../constants";
import noImage from "../../resources/no-image.png";
import "../../resources/modal.css";

const TextArea = Input.TextArea;
const LANG = ["English", "Nepali", "Hindi", "Others"];
const SEARCH_FIELDS = ["name", "author", "language", "category"];

const BookComponent = () => {
  const [itemsData, setItemsData] = useState([]); // All data fetched from server
  const [tableData, setTableData] = useState([]); // Required for Search in table
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [openModel, setOpenModel] = useState(false);
  const [editData, setEditData] = useState(null);
  const [itemDetail, setItemDetail] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // Search keyword
  const [confirmOpt, setOpenConfirm] = useState({}); // Handle open/close confirmation
  const [isFree, setIsFree] = useState(false);

  const getAll = async (reqType = "books") => {
    try {
      const {data: { success, data }} = await Request.get(`/api/${reqType}/getAll`);

      if (success) {
        if (reqType === "books") {
          setItemsData(data);
          setTableData(data);
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
      render: img => <img src={img || noImage} alt="" height="60" width="60" />,
    },
    {
      title: "Author",
      dataIndex: "author",
    },
    {
      title: "Price (RS.)",
      dataIndex: "price",
      render: d => d ? `RS. ${d}` : <span style={{ "color": "green" }}>Free</span>,
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
          <EditFilled
            className="mx-2"
            onClick={() => {
              setEditData(record);
              setIsFree(record.isFree);
              setOpenModel(true);
            }}
          />
          <DeleteFilled
            className="mx-2"
            onClick={() => setOpenConfirm({
              msg: "Do you want to remove this book?",
              visible: true,
              onOk: () => deleteItem(record),
            })}
          />
          <EyeOutlined title="Details" className="mx-2" onClick={() => showInfo(record)} />
        </div>
      ),
    },
  ];

  useEffect(() => getAll("category"), []);
  useEffect(() => getAll(), []);

  const onFinish = async data => {
    const uriArr = ['', 'api', 'books'];
    let method = "post";

    if (editData) {
      uriArr.push('update', editData._id);
      method = "put";
    } else {
      uriArr.push('add');
    }

    let formKeys = [];

    if (isFree) {
      /* Price, Discount e.t.c not needed for Free books */
      formKeys = Object.keys(data)
        .filter(d => !["image", "pdf", "isFree", "price", "discount"].includes(d));
    } else {
      formKeys = Object.keys(data).filter(d => !["image", "pdf", "isFree"].includes(d));
    }

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

    if (isFree) {
      formData.append("price", 0);
      formData.append("discount", 0);
      formData.append("isFree", true);
    } else {
      formData.append("isFree", false);
    }

    try {
      /* First insert | update book info */
      const resp1 = await Request[method](uriArr.join("/"), formData);

      if (get(resp1, "data.success")) {
        const pdfFile = get(data, "pdf.file.originFileObj");

        if (pdfFile) {
          const refId = get(resp1, "data.data._id");

          const newForm = new FormData();
          newForm.append("pdf", pdfFile);

          /* Then, insert | update book resource to a separate collection */
          await Request.post(`/api/books/uploadPdf/${refId}`, newForm);
        }

        message.success(get(resp1, "data.message"));
        setEditData(null);
        setIsFree(false);
        setOpenModel(false);
        getAll();
      } else {
        throw new Error('');
      }

    } catch (err) {
      message.error(DEFAULT_ERR_MSG);
    }
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
          let val = obj[key] || "";
          
          if (key === "category") {
            val = categoryMap[val] || "";
          }
          acc += val;
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
        searchPlaceholder="Search for the books..."
        onSearch={onSearch}
        onChange={onChange}
        showAddButton={true}
        addButtonLabel="+ New Book"
        buttonOnClick={() => setOpenModel(true)}
      />

      {openModel && (
        <Modal
          onCancel={() => {
            setEditData(null);
            setIsFree(false);
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
                rules={[{ required: true, message: "" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="author"
                label="Author"
                rules={[{ required: true, message: "" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="language"
                label="Language"
                rules={[{ required: true, message: "" }]}
              >
                <Select>
                  {LANG.map(d => <Select.Option value={d}>{d}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "" }]}
              >
                <Select>
                  {categories.map(d => <Select.Option value={d._id}>{d.name}</Select.Option>)}
                </Select>
              </Form.Item>
              {get(editData, "image") ? (
                  <img
                    src={editData.image}
                    height="65"
                    width="65"
                    alt=""
                    style={{ padding: "5px", border: "1px dotted grey"}}
                  />
                ) : ""
              }
              <Form.Item name="image" label="Image">
                <Upload accept=".png,.jpg,.jpeg">
                  <div class="ant-col ant-form-item-control">
                    <div class="ant-form-item-control-input">
                      <div class="ant-form-item-control-input-content">
                        <div class="ant-input">
                          Choose {get(editData, "image") ? "new": "a"} image
                        </div>
                      </div>
                    </div>
                  </div>
                </Upload>
              </Form.Item>
              {get(editData, "pdf") ? (
                <p style={{padding: "10px", color: "green", border: "1px dotted grey"}}>
                  {editData.pdf}
                </p>) : ""
              }
              <Form.Item name="pdf" label="PDF Resource">
                <Upload accept="application/pdf">
                  <div class="ant-col ant-form-item-control">
                    <div class="ant-form-item-control-input">
                      <div class="ant-form-item-control-input-content">
                        <div class="ant-input">
                          Choose {get(editData, "pdf") ? "new": "a"} pdf file
                        </div>
                      </div>
                    </div>
                  </div>
                </Upload>
              </Form.Item>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: !isFree, message: "" }]}
              >
                <Input disabled={isFree} type="number" />
              </Form.Item>
              <Form.Item name="isFree" label="">
                <span style={{ color: "blue" }}>Available for Free</span>{" "}
                <Checkbox
                  checked={isFree}
                  onChange={() => setIsFree(!isFree)}
                />
              </Form.Item>
              <Form.Item
                name="discount"
                label="Discount"
              >
                <Input disabled={isFree} type="number" />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <TextArea rows={2} />
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

export default BookComponent;
