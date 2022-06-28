import { Radio, Form, Button, Input, Col, Row, Upload, message } from "antd";
import { useState, useEffect } from "react";
import { get } from "lodash";

import { LocalStore, Request } from "../../library";
import { DefaultLayout, HtmlEditor } from "../../components";
import { DEFAULT_ERR_MSG } from "../../constants";

const { TextArea } = Input;

const InstAbout = () => {
  const refId = get(LocalStore.decodeToken(), "institution"); // Institution ID
  const [formType, setFormType] = useState("text");
  const [htmlValue, setHtml] = useState(""); // HTML content in the HTML editor
  const [editData, setEditData] = useState(null); // Set Edit Data for update
  const [loadForm, setLoadform] = useState(false); // Load form only after fetching DB data

  const getData = async () => {
    try {
      if (refId) {
        const {
          data: { success, data },
        } = await Request.get(`/api/institution/getByRefId-about/${refId}`);

        if (success && data) {
          const { html, ...rest } = data;

          if (html) {
            setHtml(html);
          }
          setEditData(rest);
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
      uriArray.push("update-about", refId, _id);
    } else {
      uriArray.push("add-about", refId);
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

  const htmlSave = async () => {
    if (!htmlValue) {
      return null;
    }
    return actualSave({ html: htmlValue }, get(editData, "_id"));
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
      <div className="d-flex justify-content-between">
        <h3>About Us</h3>
      </div>

      <div>
        <Radio.Group value={formType} onChange={e => setFormType(e.target.value)}>
          <Radio value="text">Form</Radio>
          <Radio value="html">Write HTML</Radio>
        </Radio.Group>
      </div>
  
      {formType === "html" && (
        <div className="html-wrapper">
          <p className="html-info">HTML will be reflected in web-page as you design here.</p>
          <HtmlEditor value={htmlValue} onChange={setHtml}/>
          <div className="html-btn">
            <Button onClick={htmlSave}>
              {editData ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      )}

      {loadForm && formType === "text" && (
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

export default InstAbout;
