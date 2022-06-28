import { Form, Button, Input, Col, Row, Upload, message } from "antd";
import { useState, useEffect } from "react";
import { get } from "lodash";

import { LocalStore, Request } from "../../library";
import { DefaultLayout, Header } from "../../components";
import { DEFAULT_ERR_MSG } from "../../constants";

const { TextArea } = Input;

const InstContact = () => {
  const refId = get(LocalStore.decodeToken(), "institution"); // Institution ID
  const [editData, setEditData] = useState(null); // Set Edit Data for update
  const [loadForm, setLoadform] = useState(false); // Load form only after fetching DB data

  const getData = async () => {
    try {
      if (refId) {
        const {
          data: { success, data },
        } = await Request.get(`/api/institution/getByRefId-contact/${refId}`);

        if (success && data) {
          setEditData(data);
        }
        setLoadform(true);
      }
    } catch (err) {}
  };

  const actualSave = async (payload, _id) => {
    let method = "post";
    const uriArray = ["", "api", "institution"];

    if (_id) {
      method = "put";
      uriArray.push("update-contact", refId, _id);
    } else {
      uriArray.push("add-contact", refId);
    }

    try {
      const {
        data: { success, message: msg },
      } = await Request[method](uriArray.join("/"), payload);

      if (success) {
        message.success(msg);
        await getData();
      } else {
        message.error(msg);
      }
    } catch (err) {
      message.error(DEFAULT_ERR_MSG);
    }
  };

  const onFinish = data => {
    const formData = new FormData();
    formData.append("text", data.text);

    const files = get(data, "images.fileList", []);

    if (files.length) {
      files.forEach(file => {
        formData.append("files[]", file.originFileObj)
      });
    }

    return actualSave(formData, get(editData, "_id"));
  };

  useEffect(() => getData(), []);

  return (
    <DefaultLayout>
      <Header title="Contact Us" />
      {loadForm && (
        <Row className="html-wrapper profile-row">
          <Col span={12} className="profile-col-1">
            <Form
              layout="vertical"
              onFinish={onFinish}
              initialValues={editData}
            >
              <Form.Item
                name="text"
                label="About"
                rules={[{ required: true, message: "" }]}
              >
                <TextArea rows={5} />
              </Form.Item>
              <Form.Item
                name="images"
                label="Images"
              >
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

              <Button htmlType="submit" type="primary">
                {editData ? "Update" : "Save"}
              </Button>
            </Form>
          </Col>
          {get(editData, "images[0]") && (<Col span={11} className="profile-col-2">
            <p>Uploaded Images:</p>
            {
              editData.images.map(img => (
                <img
                  key={img}
                  src={img}
                  alt=""
                  style={{height: "80px", width: "80px", marginRight: "10px"}}
                />
              ))
            }
          </Col>)}
        </Row>
      )}
    </DefaultLayout>
  );
};

export default InstContact;
