import React, { useEffect, useState } from "react";
import { get } from "lodash";
import { Button, Form, Input, message, Modal, Upload, Col } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";

import { LocalStore, Request } from "../../library";
import { Confirm, DefaultLayout, Header, ListComponent, TableComponent } from "../../components";
import { DEFAULT_ERR_MSG } from "../../constants";
 
const TextArea = Input.TextArea;
const SEARCH_FIELDS = ["title"];

const InstEvent = () => {
  const refId = get(LocalStore.decodeToken(), "institution"); // Institution ID
  const [itemsData, setItemsData] = useState([]); // All data fetched from server
  const [tableData, setTableData] = useState([]); // Required for Search in table
  const [openModel, setOpenModel] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // Search keyword
  const [confirmOpt, setOpenConfirm] = useState({}); // Handle open/close confirmation
  const [links, setLinks] = useState([]);

  const getAll = async () => {
    try {
      const {data: { success, data }} = await Request.get(`/api/institution/getByRefId-activity/${refId}`);

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
      } = await Request.delete(`/api/institution/remove-activity/${refId}/${record._id}`);
      
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
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      render: data => (
        <>{data.length <= 120 ? data : `${data.slice(0, 120)} .....`}</>
      )
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EditFilled
            className="mx-2"
            onClick={() => {
              setLinks(record.externalLinks || []);
              setEditData(record);
              setOpenModel(true);
            }}
          />
          <DeleteFilled
            className="mx-2"
            onClick={() => setOpenConfirm({
              msg: "Do you want to remove this event?",
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
      uriArr.push('update-activity', refId, editData._id);
      method = "put";
    } else {
      uriArr.push('add-activity', refId);
    }

    const formKeys = Object.keys(data).filter(d => !["externalLinks", "images"].includes(d));
    const formData = new FormData();

    formKeys.forEach(key => {
      if (data[key]) {
        formData.append(key, data[key]);
      }
    });

    const files = get(data, "images.fileList", []);
    if (files.length) {
      files.forEach(file => {
        formData.append("files[]", file.originFileObj)
      });
    }

    if (links.length) {
      links.forEach(d => {
        formData.append("externalLinks[]", d)
      });
    }
    
    Request[method](uriArr.join("/"), formData)
      .then(res => {
        const { success, message: msg } = res.data;

        if (success) {
          message.success(msg);
          setEditData(null);
          setOpenModel(false);
          setLinks([]);
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
      <Header title="Events" />
      <TableComponent
        columns={columns}
        dataSource={tableData}
        bordered={true}
        showSearch={true}
        searchPlaceholder="Search for the event..."
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
          }}
          visible={openModel}
          title={`${editData ? "Edit" : "Add"}  Event`}
          footer={false}
          className="book-model-class"
        >
          <>
          <Form
            initialValues={editData}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "" }]}
            >
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item name="images" label="Images">
              <Upload multiple={true}>
                <div class="ant-col ant-form-item-control">
                  <div class="ant-form-item-control-input">
                    <div class="ant-form-item-control-input-content">
                      <div class="ant-input">
                        Choose files
                      </div>
                    </div>
                  </div>
                </div>
              </Upload>
            </Form.Item>

            {get(editData, "images[0]") && (<Col style={{marginBottom: "10px"}} span={11}>
              {
                editData.images.map(img => (
                  <img
                    key={img}
                    src={img}
                    alt=""
                    style={{height: "50px", width: "50px", marginRight: "10px"}}
                  />
                ))
              }
            </Col>)}
            
            <Form.Item name="externalLinks" label="ExternalLinks">
              <ListComponent
                list={links}
                setList={setLinks}
                placeholder="Enter the external links"
              />
            </Form.Item>
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

export default InstEvent;
