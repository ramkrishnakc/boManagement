import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "antd";

import { Request } from "../../library";
import { DefaultLayout, Header } from "../../components";
import { BOOKS_BY_USERS } from "./helper";

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

  return (
    <DefaultLayout>
      <Header title="Dashboard" />
      <p>Hello <b>{username}</b>,</p>
      <p><b>Total No. of Books Published:</b> {dashboardData.books.length}</p><br />
      <h5>Summary of Book Purchase:</h5>
      <Table
        columns={BOOKS_BY_USERS}
        dataSource={dashboardData.books}
        pagination={false}
        className="ant-table-custom"
      />
    </DefaultLayout>
  );
};

export default DashboardComponent;
