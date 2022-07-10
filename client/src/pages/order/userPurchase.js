import React, { useEffect, useState } from "react";
import { get } from "lodash";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";
import { ReadOutlined } from "@ant-design/icons";

import { Request } from "../../library";
import noImage from "../../resources/no-image.png";

const Purchase = () => {
  const navigate = useNavigate();
  const [itemsData, setItemsData] = useState([]); // All data fetched from server
  const id = useSelector(state => get(state, "login.id"));
  const categories = useSelector(state => get(state, "category.all", []));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: img => <img src={img || noImage} alt="" height="60" width="60" />,
    },
    {
      title: "Author",
      dataIndex: "author",
    },
    {
      title: "Category",
      dataIndex: "category",
      render: id => get(categories.find(d => d._id === id), "name", ""),
    },
    {
      title: "Language",
      dataIndex: "language",
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <ReadOutlined
            className="mx-2"
            title="Read Book"
            style={{color: "rgb(106, 106, 243)"}}
            onClick={() => {
              navigate(`/read-book/${record._id}/${record.name}`);
            }}
          />
        </div>
      ),
    },
  ];

  const getPurchase = async () => {
    try {
      const {data: { success, data }} =
        await Request.get(`/api/users/getMyPurchase/${id}`);

      if (success) {
        setItemsData(data);
      }
    } catch (err) {}
  };

  useEffect(() => getPurchase(), []);

  return (
    <>
      <div className="bread-crumb">
        <span className="b-parent hide-pointer">My Purchases</span>
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
};

export default Purchase;
