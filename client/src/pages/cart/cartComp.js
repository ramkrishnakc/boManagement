import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { get, intersection } from "lodash";
import { DeleteFilled, ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, message, Table } from "antd";

import { LocalStore, Request } from "../../library";
import { removeFromCart, emptyCart } from "./cartModule";
import { getRecordTotal, calculateTotal } from "../dashboard/helper";
import { TAX } from "../../constants";
import noImage from "../../resources/no-image.png";
import  "../../resources/cart.css";

/* Payment modules */
import KhaltiCheckout from "khalti-checkout-web";
import getConfig from "./khaltiConfig";

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
      <Button
        block
        type="primary"
        onClick={props.btnClick}
      >
        {props.btnLabel}
      </Button>
    </div>
  </>
);

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { login, cart: { cartItems } } = useSelector(state => state);
  const purchaseList = get(login, "purchasedBooks", []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (name, record) => {
        const exist = purchaseList.find(id => id === record._id);

        if (exist) {
          return (
            <>
              <ExclamationCircleOutlined title="Already purchased!!" style={{color: "red"}} />
              {" "} {name}
            </>
          );
        }
        return name;
      }
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
      render: (id, record) => record.discount ? `${record.discount}%` : "-",
    },
    {
      title: "Price (Rs.)",
      dataIndex: "price",
      render: (id, record) => `Rs. ${(record.price)}`,
    },
    {
      title: "Total (Rs.)",
      dataIndex: "_id",
      render: (id, { price, discount = 0 }) =>
        `Rs. ${getRecordTotal({ price, discount })}`,
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

  const saveBill = () => {
    if (!login.id) {
      return null;
    }

    const payload = {
      customerId: login.id,
      taxRate: TAX,
      cartItems: cartItems.map(({
        _id,
        name,
        author,
        price,
        discount,
      }) => ({
        _id,
        name,
        author,
        price,
        discount,
      })),
    };

    Request
      .post("/api/bills/add", payload)
      .then(res => {
        const { success, message: msg } = res.data;

        if (success) {
          message.success("Purchase is Successful & Current Cart is cleared.");
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

  const checkout = () => {
    const info = LocalStore.decodeToken();

    if (get(info, "role") === "user" && Date.now() < info.expiredAt) {
      const pList = intersection(purchaseList, cartItems.map(d => d._id));

      if (pList.length) {
        return message.warn("Please remove already purchased books from your cart.");
      }


      /* Handle Payment */
      const config = getConfig({
        successHandler: saveBill,
      });
      const CheckoutModel = new KhaltiCheckout(config);
      return CheckoutModel.show({ amount: total * 100 }); /* "amount" should be in Paisa */
    }
    return message.warn("Please login before you can proceed with checkout.");
  };

  return (
    <>
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
              btnClick={checkout}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;

