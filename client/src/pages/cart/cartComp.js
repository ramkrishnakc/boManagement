import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  DeleteFilled,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Button, message, Table, Modal, Select, Form, Input } from "antd";

import { HomeLayout } from "../../components";
import { Request } from "../../library";
import { updateCart, removeFromCart, emptyCart } from "./cartModule";
import { getRecordTotal, calculateTotal } from "../dashboard/helper";
import { TAX } from "../../constants";
import noImage from "../../resources/no-image.png";
import  "../../resources/cart.css";

const TotalSection = props => (
  <>
    <div className="cart-subtotal-text">
      SUB TOTAL : <b>Rs. {props.subtotal}</b>
    </div>
    <div className="cart-tax-text">
      TAX : <b>{TAX}%</b>
    </div>
    <div className="cart-total-text">
      GRAND TOTAL : <b>Rs. {props.total}</b>
    </div>

    <div className="checkout-btn-wrapper-div">
      <Button type="primary" onClick={props.btnClick}>
        {props.btnLabel}
      </Button>
    </div>
  </>
);

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { login, cart: { cartItems } } = useSelector(state => state);
  const [openModal, setOpenModal] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image || noImage} alt={record.name} height="60" width="60" />
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
    },
    {
      title: "Discount (%)",
      dataIndex: "discount",
      render: (id, record) => record.discount || 0,
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (id, record) => `Rs. ${(record.price)}`,
    },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <MinusCircleOutlined
            className="mx-3"
            onClick={(() => {
              if (record.quantity > 1) {
                dispatch(
                  updateCart(
                    record._id,
                    { quantity: record.quantity ? record.quantity - 1 : 1 }
                  )
                );
              }
            })}
          />
          <b>{record.quantity || 1}</b>
          <PlusCircleOutlined
            className="mx-3"
            onClick={(
              () => dispatch(
                updateCart(
                  record._id,
                  { quantity: record.quantity ? record.quantity + 1 : 2 }
                )
              ))}
          />
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "_id",
      render: (id, { price, discount = 0, quantity = 1 }) =>
        `Rs. ${getRecordTotal({ price, discount, quantity })}`,
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteFilled
          onClick={(() => dispatch(removeFromCart(record._id)))}
        />
      ),
    },
  ];

  const { total, subtotal } = calculateTotal(cartItems);

  const getInitialData = () => ({
    customerName: login.name || "",
    customerEmail: login.email || "",
    customerNumber: login.contactNum || "",
    customerAddress: login.address || "",
  });

  const onFinish = (values) => {
    const payload = {
      ...values,
      taxRate: TAX,
      cartItems: cartItems.map(({
        _id,
        name,
        author,
        price,
        quantity = 1,
        discount = 0
      }) => ({
        name,
        author,
        itemId: _id,
        price,
        quantity,
        discount,
        total: getRecordTotal({ price, discount, quantity }),
      })),
    };

    if (login.id) {
      payload.customerId = login.id;
    }

    Request
      .post("/api/bills/add", payload)
      .then(res => {
        const { success, message: msg } = res.data;

        if (success) {
          message.success("Your order has been placed & current cart is cleared.");
          setOpenModal(false);
          dispatch(emptyCart());
          navigate("/");
        } else {
          message.error(msg);
        }
      })
      .catch(err => {
        console.log(err);
        message.error("Something went wrong, try again later.");
      });
  };

  return (
    <HomeLayout hideFooter>
      <div className="bread-crumb">
        <span className="b-parent hide-pointer">My Cart</span>
      </div>
      <div className="cart-item-wrapper">
        <Table
          columns={columns}
          dataSource={cartItems}
          bordered={false}
          pagination={false}
        />
        {cartItems.length > 0 && (
          <div className="d-flex justify-content-end flex-column align-items-end">
            <TotalSection
              subtotal={subtotal}
              total={total}
              btnLabel="CHECKOUT"
              btnClick={() => setOpenModal(true)}
            />
          </div>
        )}
        {openModal && (
            <Modal
              title="Confirm Order"
              visible={openModal}
              footer={false}
              onCancel={() => setOpenModal(false)}
              className="book-model-class"
            >
              <Form
                layout="vertical"
                onFinish={onFinish}
                initialValues={getInitialData()}
              >
                <Form.Item
                  name="customerName"
                  label="Name"
                  rules={[{ required: true, message: "" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="customerEmail"
                  label="Email"
                  rules={[
                    { required: true, message: "" },
                    () => ({
                      validator(rule, value) {
                        const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                        if (!value || emailReg.test(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject("");
                      },
                    }),
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="customerNumber"
                  label="Phone Number"
                  rules={[
                    { required: true, message: "" },
                    { min: 6, message: "" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="customerAddress"
                  label="Address"
                  rules={[{ required: true, message: "" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="paymentMode"
                  label="Payment Mode"
                  rules={[{ required: true, message: "" }]}
                >
                  <Select>
                    <Select.Option value="cash">Cash</Select.Option>
                    <Select.Option value="card">Card</Select.Option>
                    <Select.Option value="online">Online</Select.Option>
                  </Select>
                </Form.Item>
                <Button block={true} htmlType="submit" type="primary">CONFIRM</Button>
              </Form>
            </Modal>
          )}
      </div>
    </HomeLayout>
  );
};

export default CartPage;

