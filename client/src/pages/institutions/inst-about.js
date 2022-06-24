import { Radio, Form, Button, Input, Col, Row } from "antd";
import { useState } from "react";

import DefaultLayout from "../../components/DefaultLayout";
import HTMLEditor from "../../library/html-editor";
import "../../resources/inst-layout.css";

const { TextArea } = Input;

const InstAbout = () => {
  const [formType, setFormType] = useState("text");
  const [htmlValue, setHtml] = useState("");

  const onFinish = data => {
    console.log("DATA :: ", data);
  };

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
          <HTMLEditor value={htmlValue} onChange={setHtml}/>
          <div className="html-btn">
            <Button>Update</Button>
          </div>
        </div>
      )}

      {formType === "text" && (
        <Row className="html-wrapper profile-row">
        <Col span={12} className="profile-col-1">
          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{}}
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
              <TextArea rows={5} />
            </Form.Item>

            <Button htmlType="submit" type="primary">
              Update
            </Button>
            </Form>
          </Col>
        </Row>
      )}
    </DefaultLayout>
  );
};

export default InstAbout;
