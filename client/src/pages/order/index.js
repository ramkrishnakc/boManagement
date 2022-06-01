import React, { useEffect, useRef, useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Modal, Table } from "antd";
import { useReactToPrint } from "react-to-print";

import Request from "../../library/request";
import TableComponent from "../../components/Table";
import DefaultLayout from "../../components/DefaultLayout";

const getSubtotal = cartItems => cartItems.reduce((acc, curr) => acc + curr.total, 0);

const getTotal = (cartItems, taxRate) => {
  const subTotal = getSubtotal(cartItems);
  return subTotal + (taxRate / 100 * subTotal);
};

const SEARCH_FIELDS = ["customerName", "customerEmail", "customerNumber", "status"];

const OrderComponent = () => {
  const componentRef = useRef();
  const [itemsData, setItemsData] = useState([]); // All data fetched from server
  const [tableData, setTableData] = useState([]); // Required for Search in table
  const [openModel, setOpenModel] = useState(false);
  const [bill, setBill] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // Search keyword
  
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
      dataIndex: "subtotal",
      render: (id, record) => `Rs. ${getSubtotal(record.cartItems)}`,
    },
    {
      title: "Total Rs. (incl. VAT)",
      dataIndex: "total",
      render: (id, record) => {
        return `Rs. ${getTotal(record.cartItems, record.taxRate)}`;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
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
              setOpenModel(true);
            }}
          />
        </div>
      ),
    },
  ];

  const cartcolumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price (Rs.)",
      dataIndex: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (id, record) => record.quantity,
    },
    {
      title: "Discount (Rs.)",
      dataIndex: "discount",
      render: (id, record) => ((record.discount / 100 * record.price) * record.quantity),
    },
    {
      title: "Total fare (Rs.)",
      dataIndex: "total"
    },
  ];

  useEffect(() => getAll(), []);

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

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>Orders</h3>
      </div>
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
                <b>SUB TOTAL</b> : {`Rs. ${getSubtotal(bill.cartItems)}`}
              </p>
              <p>
                <b>VAT(%)</b> : {bill.taxRate}
              </p>
            </div>

            <div>
              <h5>
                <b>GRAND TOTAL : {`Rs. ${getTotal(bill.cartItems, bill.taxRate)}`}</b>
              </h5>
            </div>

            <div className="text-center">
              <p>Thanks</p>
              <p>Visit Again :)</p>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <Button type="primary" onClick={handlePrint}>
              Print Bill
            </Button>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
}

export default OrderComponent;
