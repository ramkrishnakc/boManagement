import { Form, Button, Input, Col, Row, message } from "antd";
import { useState, useEffect } from "react";
import { get } from "lodash";

import { LocalStore, Request } from "../../library";
import { ListComponent } from "../../components";
import { DEFAULT_ERR_MSG } from "../../constants";

const { TextArea } = Input;

const InstContact = () => {
  const refId = get(LocalStore.decodeToken(), "institution"); // Institution ID
  const [editData, setEditData] = useState(null); // Set Edit Data for update
  const [loadForm, setLoadform] = useState(false); // Load form only after fetching DB data
  const [numbers, setNumbers] = useState([]);
  const [links, setLinks] = useState([]);

  const getData = async () => {
    try {
      if (refId) {
        const {
          data: { success, data },
        } = await Request.get(`/api/institution/getByRefId-contact/${refId}`);

        if (success && data) {
          const { externalLinks, phone, ...rest } = data;
          if (externalLinks) {
            setLinks(externalLinks);
          }
          if (phone) {
            setNumbers(phone);
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
        // Fetch data only after POST
        if (!_id) {
          await getData();
        }
      } else {
        message.error(msg);
      }
    } catch (err) {
      message.error(DEFAULT_ERR_MSG);
    }
  };

  const onFinish = data => {
    const payload = {
      ...data,
    };

    if (links.length) {
      payload.externalLinks = links;
    }
    if (numbers.length) {
      payload.phone = numbers;
    }

    return actualSave(payload, get(editData, "_id"));
  };

  useEffect(() => getData(), []);

  return (
    <>
      {loadForm && (
        <Row className="html-wrapper profile-row">
          <Col span={12} className="profile-col-1">
            <Form
              layout="vertical"
              onFinish={onFinish}
              initialValues={editData}
            >
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "" }]}
              >
                <TextArea rows={2} />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Contact Numbers"
                rules={[
                  () => ({
                    validator() {
                      if (numbers.length) {
                        return Promise.resolve();
                      }
                      return Promise.reject("");
                    },
                  }),
                ]}
              >
                <ListComponent
                  list={numbers}
                  setList={setNumbers}
                  placeholder="Enter contact numbers"
                />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="website"
                label="Website"
                rules={[{ required: true, message: "" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="externalLinks" label="ExternalLinks">
                <ListComponent
                  list={links}
                  setList={setLinks}
                  placeholder="Enter the external links"
                />
              </Form.Item>

              <Button htmlType="submit" type="primary">
                {editData ? "Update" : "Save"}
              </Button>
            </Form>
          </Col>
        </Row>
      )}
    </>
  );
};

export default InstContact;
