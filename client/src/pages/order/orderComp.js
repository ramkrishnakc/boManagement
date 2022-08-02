import React, { useEffect, useRef, useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Modal, Table } from "antd";
import { useReactToPrint } from "react-to-print";

import { Request } from "../../library";
import { TableComponent } from "../../components";
import { TAX, APP_NAME } from "../../constants";
import { calculateTotal, getRecordTotal } from "../dashboard/helper";

const SEARCH_FIELDS = ["username", "email"];

const OrderComponent = () => {
  const componentRef = useRef();
  const [itemsData, setItemsData] = useState([]); // All data fetched from server
  const [tableData, setTableData] = useState([]); // Required for Search in table
  const [openModel, setOpenModel] = useState(false); // Open bill info modal
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
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Subtotal (Rs.)",
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
      title: "Discount (%)",
      dataIndex: "discount",
    },
    {
      title: "Total fare (Rs.)",
      dataIndex: "total",
      render: (id, record) => `Rs. ${getRecordTotal(record)}`,
    },
  ];

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

  return (
    <>
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
            setBill(null);
          }}
          visible={openModel}
          title={`${APP_NAME} - Bill detail`}
          footer={false}
          className="bill-model-class"
        >
          <div className="bill-model p-3" ref={componentRef}>
            <div className="bill-customer-details my-2">
              <p>
                <b>Username | Email</b>: {" "}
                {bill.username} | {bill.email}
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
    </>
  );
}

export default OrderComponent;
