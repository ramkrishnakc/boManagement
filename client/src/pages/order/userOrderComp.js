import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "antd";

import { Request } from "../../library";
import { calculateTotal, getRecordTotal } from "../dashboard/helper";

const UserOrderComponent = () => {
  const [itemsData, setItemsData] = useState([]); // All data fetched from server
  const { id } = useSelector(state => state.login);

  const getAll = async () => {
    try {
      const {data: { success, data }} =
        await Request.get(`/api/bills/getByUserId/${id}`);

      if (success) {
        setItemsData(data);
      }
    } catch (err) {}
  };

  const cartColumns = [
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
      render: d => `Rs. ${d}`,
    },
    {
      title: "Discount (%)",
      dataIndex: "discount",
      render: d => d ? `${d}%` : "-",
    },
    {
      title: "Total (Rs.)",
      dataIndex: "total",
      render: (d, record) => `Rs. ${getRecordTotal({ price: record.price, discount: record.discount })}`,
    },
  ];

  const columns = [
    {
      title: "Order Date",
      dataIndex: "createdAt",
      render: val => val ? val.toString().substring(0, 10) : "",
    },
    {
      title: "Purchased Items",
      dataIndex: "cartItems",
      render: (items, record) => {
        const { subtotal, total } = calculateTotal(items);

        return (
          <div>
            <Table
              columns={cartColumns}
              dataSource={items}
              bordered={false}
              pagination={false}
              className="user-order-inner-table"
            />
            <div className="flex-div-right">
              <span className="m-right-20">SUB TOTAL : <b>Rs. {subtotal}</b></span>
              <span className="m-right-20">TAX : <b>{record.taxRate}%</b></span>
              <span className="m-right-20">GRAND TOTAL : <b>Rs. {total}</b></span>
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => getAll(), []); // Fetch all my orders

  return (
    <>
      <div className="bread-crumb">
        <span className="b-parent hide-pointer">My Orders</span>
      </div>
      <div className="cart-item-wrapper">
        <Table
          columns={columns}
          dataSource={itemsData}
          bordered={false}
          pagination={false}
        />
      </div>
    </>
  );
}

export default UserOrderComponent;
