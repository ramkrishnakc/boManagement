import React, { useEffect, useState } from "react";
import { get } from "lodash";
import { Button, Form, Input, message, Modal, Upload } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { DEFAULT_ERR_MSG } from "../../constants";
import { Confirm, DefaultLayout, HtmlEditor, ListComponent, TableComponent } from "../../components";
import { LocalStore, Request } from "../../library";
import noImage from "../../resources/no-image.png";
 
const TextArea = Input.TextArea;
const SEARCH_FIELDS = ["name"];

const InstDepartment = () => {
  const refId = get(LocalStore.decodeToken(), "institution"); // Institution ID
  const [itemsData, setItemsData] = useState([]); // All data fetched from server
  const [tableData, setTableData] = useState([]); // Required for Search in table
  const [openModel, setOpenModel] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // Search keyword
  const [confirmOpt, setOpenConfirm] = useState({}); // Handle open/close confirmation
  const [links, setLinks] = useState([]);
  const [htmlValue, setHtml] = useState(""); // HTML content in the HTML editor

  const getAll = async () => {
    try {
      const {
        data: { success, data },
      } = await Request.get(`/api/institution/getByRefId-department/${refId}`);

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
      } = await Request.delete(`/api/institution/remove-department/${refId}/${record._id}`);
      
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
      title: "About",
      dataIndex: "about",
      render: data => (
        <>{data.length <= 120 ? data : `${data.slice(0, 120)} .....`}</>
      )
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EditOutlined
            className="mx-2"
            onClick={() => {
              const { externalLinks, html, ...rest } = record;

              if (html) {
                setHtml(html);
              }
              if (externalLinks) {
                setLinks(externalLinks);
              }
              setEditData(rest);
              setOpenModel(true);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => setOpenConfirm({
              msg: "Do you want to remove this department | program?",
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
      uriArr.push('update-department', refId, editData._id);
      method = "put";
    } else {
      uriArr.push('add-department', refId);
    }

    const formKeys = Object.keys(data).filter(d => !["externalLinks", "image"].includes(d));
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

    if (links.length) {
      links.forEach(d => {
        formData.append("externalLinks[]", d)
      });
    }
    if (htmlValue) {
      formData.append("html", htmlValue);
    }
    
    Request[method](uriArr.join("/"), formData)
      .then(res => {
        const { success, message: msg } = res.data;

        if (success) {
          message.success(msg);
          setEditData(null);
          setOpenModel(false);
          setLinks([]);
          setHtml("");
          getAll();
        } else {
          message.error(msg);
        }
      })
      .catch(() => message.error(DEFAULT_ERR_MSG));
  };

  useEffect(() => getAll(), []);

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>Departments & Programs</h3>
      </div>
      <TableComponent
        columns={columns}
        dataSource={tableData}
        bordered={true}
        showSearch={true}
        searchPlaceholder="Search for the department | program..."
        onSearch={onSearch}
        onChange={onChange}
        showAddButton={true}
        addButtonLabel="+ New"
        buttonOnClick={() => {
          setOpenModel(true);
          setEditData(null);
          setLinks([]);
        }}
      />

      {openModel && (
        <Modal
          onCancel={() => {
            setEditData(null);
            setOpenModel(false);
            setLinks([]);
            setHtml("");
          }}
          visible={openModel}
          title={`${editData ? "Edit" : "Add"}  Department | Program`}
          footer={false}
          className="department-model-class book-model-class"
        >
          <>
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
              name="about"
              label="About"
              rules={[{ required: true, message: "" }]}
            >
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="course"
              label="Course Offered"
              rules={[{ required: true, message: "" }]}
            >
              <TextArea rows={4} />
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
            <Form.Item name="externalLinks" label="ExternalLinks">
              <ListComponent
                list={links}
                setList={setLinks}
                placeholder="Enter the external links"
              />
            </Form.Item>
            <>
              <label>HTML Editor</label>
              <HtmlEditor value={htmlValue} onChange={setHtml} />
              <br />
            </>
            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">
                SAVE
              </Button>
            </div>
          </Form>
          </>
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
};

export default InstDepartment;
