import React, { useEffect, useRef, useState } from "react";
import { MinusCircleOutlined, PlusCircleOutlined, DeleteFilled, EyeOutlined } from "@ant-design/icons";
import { Button, Modal, Table, Checkbox, message } from "antd";
import { useReactToPrint } from "react-to-print";

import { Request } from "../../library";
import { Confirm, DefaultLayout, Header, TableComponent } from "../../components";
import { CANCELED, COMPLETED, PENDING, RECEIVED, TAX, STATUS_COLOR_MAP } from "../../constants";
import { calculateTotal, getRecordTotal } from "../dashboard/helper";

const SEARCH_FIELDS = ["customerName", "customerEmail", "customerNumber", "status"];

const OrderComponent = () => {
  const componentRef = useRef();
  const [itemsData, setItemsData] = useState([]); // All data fetched from server
  const [tableData, setTableData] = useState([]); // Required for Search in table
  const [openModel, setOpenModel] = useState(false); // Open bill info modal
  const [confirmOpt, setOpenConfirm] = useState({}); // Handle open/close confirmation
  const [actualBill, setActualBill] = useState(null);
  const [bill, setBill] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // Search keyword
  const [orderStatus, setOrderStatus] = useState(null);
  
  const getAll = async () => {
    try {
      const {data: { success, data }} = await Request.get(`/api/bills/getAll`);
      if (success) {
        setItemsData(data);
        setTableData(data);
      }
    } catch (err) {}
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "customerName",
    },
    {
      title: "Email",
      dataIndex: "customerEmail",
    },
    {
      title: "Number",
      dataIndex: "customerNumber",
    },
    {
      title: "Subtotal",
      dataIndex: "_id",
      render: (id, record) =>
        `Rs. ${calculateTotal(record.cartItems).subtotal}`,
    },
    {
      title: "Total Rs. (incl. VAT)",
      dataIndex: "_id",
      render: (id, record) =>
        `Rs. ${calculateTotal(record.cartItems, record.taxRate).total}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (id, record) => {
        const color = STATUS_COLOR_MAP[record.status] || "";
        return <b style={{ color }}>{(record.status || "").toUpperCase()}</b>;
      }
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EyeOutlined
            className="mx-2"
            onClick={() => {
              setBill(record);
              setActualBill(record);
              setOpenModel(true);
            }}
          />
        </div>
      ),
    },
  ];

  const updateCart = (id, data) =>
    setBill({
      ...bill,
      cartItems: bill.cartItems.map(ele => ele.itemId === id ? { ...ele, ...data } : ele),
    });

  const removeCartItem = id =>
    setBill({
      ...bill,
      cartItems: bill.cartItems.filter(ele => ele.itemId !== id),
    });

  let cartcolumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Author",
      dataIndex: "author",
    },
    {
      title: "Price (Rs.)",
      dataIndex: "price",
      render: (id, record) => `Rs. ${record.price}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (id, record) => (
        (actualBill && actualBill.status === RECEIVED) ? (
          <div>
            <MinusCircleOutlined
              className="mx-3"
              onClick={(() => {
                if (record.quantity > 1) {
                  updateCart(record.itemId, { quantity: record.quantity - 1 });
                }
              })}
            />
            <b>{record.quantity || 1}</b>
            <PlusCircleOutlined
              className="mx-3"
              onClick={(() => updateCart(record.itemId, { quantity: record.quantity + 1 }))}
            />
          </div>
        ) : (<b>{record.quantity || 1}</b>)
      ),
    },
    {
      title: "Discount (%)",
      dataIndex: "discount",
    },
    {
      title: "Total fare (Rs.)",
      dataIndex: "total",
      render: (id, record) => `Rs. ${getRecordTotal(record)}`,
    },
  ];

  if (actualBill && actualBill.status === RECEIVED) {
    cartcolumns = [
      ...cartcolumns,
      {
        title: "Actions",
        dataIndex: "_id",
        render: (id, record) => (
          <div className="d-flex">
            <DeleteFilled
              className="mx-2"
              onClick={() => removeCartItem(record.itemId)}
            />
          </div>
        ),
      },
    ];
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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
    const keyword = e && e.target && e.target.value;

    if (!keyword) {
      onSearch("");
    }
  };

  const items = (bill && bill.cartItems) || [];
  const taxRate = (bill && bill.taxRate) || TAX;

  const { total, subtotal } = calculateTotal(items, taxRate);

  useEffect(() => getAll(), []); // Fetch all the bills

  /* Handle "SaveChanges" button click */
  const saveChanges = () => {
    let payload;

    if ([COMPLETED, CANCELED].includes(orderStatus)) {
      payload = { _id: bill._id, status: orderStatus };
    } else {
      payload = {
        ...bill,
        status: orderStatus ? orderStatus : actualBill.status,
        cartItems: bill.cartItems.map(ele => ({
          ...ele,
          total: getRecordTotal(ele),
        })),
      };
    }

    const {_id, ...rest} = payload;
    
    Request
      .put(`/api/bills/update/${_id}`, rest)
      .then(res => {
        const { success, message: msg } = res.data;

        if (success) {
          setItemsData(itemsData.map(ele => ele._id === _id ? { ...ele, ...rest } : ele));
          setTableData(tableData.map(ele => ele._id === _id ? { ...ele, ...rest } : ele));
          setOpenConfirm({});
          setOpenModel(false);
          setActualBill(null);
          setOrderStatus(null);
          setBill(null);
          message.success("Changes saved successfully!!");
        } else {
          message.error(msg);
        }
      })
      .catch(err => {
        message.error("Something went wrong. Couldn't save your changes!!");
      });
  };

  return (
    <DefaultLayout>
      <Header title="Orders" />
      <TableComponent
        columns={columns}
        dataSource={tableData}
        bordered={true}
        showSearch={true}
        searchPlaceholder="Search for the orders..."
        onSearch={onSearch}
        onChange={onChange}
        showAddButton={false}
        searchInlineStyle={{ marginRight: 0 }}
      />

      {openModel && (
        <Modal
          onCancel={() => {
            setOpenModel(false);
            setActualBill(null);
            setOrderStatus(null);
            setBill(null);
          }}
          visible={openModel}
          title="Learn Nepal - Bill detail"
          footer={false}
          className="bill-model-class"
        >
          <div className="bill-model p-3" ref={componentRef}>
            <div className="bill-customer-details my-2">
              <p>
                <b>Customer Name | Ph. Number | Email</b>: {" "}
                {bill.customerName} | {bill.customerNumber} | {bill.customerEmail}
              </p>
              <p>
                <b>Date</b> : {" "}
                {bill.createdAt ? bill.createdAt.toString().substring(0, 10) : ""}
              </p>
            </div>
            <Table
              dataSource={bill.cartItems}
              columns={cartcolumns}
              bordered={false}
              pagination={false}
            /><br/>

            <div className="dotted-border">
              <p>
                <b>SUB TOTAL</b> : {`Rs. ${subtotal}`}
              </p>
              <p>
                <b>VAT(%)</b> : {bill.taxRate}
              </p>
            </div>

            <div>
              <h5>
                <b>GRAND TOTAL : {`Rs. ${total}`}</b>
              </h5>
            </div>

            <div className="text-center">
              <p>Thanks</p>
              <p>Visit Again :)</p>
            </div>
          </div>

          <div className="bill-footer">
            <div>
              {[RECEIVED].includes(actualBill.status) && (
                <Checkbox
                  checked={orderStatus === PENDING}
                  onChange={() => setOrderStatus(PENDING)}
                >
                  Accept Order
                </Checkbox>
              )}
              {[PENDING].includes(actualBill.status) && (
                <Checkbox
                  checked={orderStatus === COMPLETED}
                  onChange={() => setOrderStatus(COMPLETED)}
                >
                  Complete Order
                </Checkbox>
              )}
              {[RECEIVED, PENDING].includes(actualBill.status) && (
                <Checkbox
                  checked={orderStatus === CANCELED}
                  onChange={() => setOrderStatus(CANCELED)}
                >
                  Cancel Order
                </Checkbox>
              )}
              {" "}
            </div>
            <div>
              {[RECEIVED, PENDING].includes(actualBill.status) && (
                <Button
                  className="primary-btn"
                  onClick={() =>
                    setOpenConfirm({
                      msg: "Do you want to save the changes?",
                      visible: true,
                      onOk: () => saveChanges(),
                    })
                  }
                >
                  Save Changes
                </Button>
              )}
              <Button
                className="print-btn"
                onClick={handlePrint}
              >
                Print Bill
              </Button>
            </div>
          </div>
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
}

export default OrderComponent;
