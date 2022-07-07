import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "antd";

import { Request } from "../../library";
import { DefaultLayout, Header } from "../../components";
import noImage from "../../resources/no-image.png";

const BOOKS_BY_USERS = [
  {
    title: "Books",
    dataIndex: "name",
  },
  {
    title: "Image",
    dataIndex: "image",
    render: img => <img src={img || noImage} alt="" height="60" width="60" />,
  },
  {
    title: "No. of Readers",
    dataIndex: "user",
    render: count => count > 0 ? count : 0,
  },
  {
    title: "Revenue Generated (Rs.)",
    dataIndex: "revenue",
    render: count => count > 0 ? `Rs. ${count}` : 0,
  },
];

const DashboardComponent = () => {
  const username = useSelector(state => state.login.username);
  const userId = useSelector(state => state.login.id);
  const [dashboardData, setDashboardData] = useState({ books: [] });

  const getData = async () => {
    try {
      const {data: { success, data }} = await Request.get(
        `/api/dashboard/getWriterDashboard/${userId}`
      );

      if (success) {
        setDashboardData({
          ...dashboardData,
          ...data,
        });
      }
    } catch (err) {}
  };

  useEffect(() => getData(), []);

  const revenue = dashboardData.books.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <DefaultLayout>
      <Header title="Dashboard" />
      <p>Hello <b>{username}</b>,</p>
      <p><b>Total No. of Books Published:</b> {dashboardData.books.length}</p>
      {revenue > 0 && (
        <>
          <p><b>Total Revenue Generated (Approx.):</b> Rs.{revenue}</p>
        </>
      )}
      <br />
      <h5>Summary of Book Purchase:</h5>
      <Table
        columns={BOOKS_BY_USERS}
        dataSource={dashboardData.books}
        pagination={false}
      />
    </DefaultLayout>
  );
};

export default DashboardComponent;
