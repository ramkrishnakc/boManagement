import React, { useEffect, useState } from "react";
import { Table } from "antd";

import { Request } from "../../library";
import { DefaultLayout, Header } from "../../components";
import SimplePieChart from "./piechart";
import SimpleLineChart from "./lineChart";
import {
  TOTAL_INFO_COL,
  USER_TYPE_COL,
  TOP_BOOKS_COL,
  BOOK_CATEGORY_COL,
  WEEK_COL,
  YEAR_COL,
  DASHBOARD_INIT,
  getTopUsersCol,
} from "./helper";

const getPie = (data, dataKey) => ([{
  [dataKey]: (
    <SimplePieChart
      data={Object.keys(data)
        .map(key => {
          const value = data[key] || 0;
          return { name: `${key} = ${value}`, value };
        })
      }
      width={1000}
      height={400}
      innerRadius={120}
      outerRadius={170}
      showLabel={true}
    />),
}]);

const getSummaryData = data => {
  const lineKeys = ["books", "users", "orders"];
  return [{
    summary: (
      <SimpleLineChart data={data} dataKey="day" lineKeys={lineKeys} />
    ),
  }];
};

const DashboardComponent = () => {
  const [dashboardData, setDashboardData] = useState(DASHBOARD_INIT);

  const getData = async () => {
    try {
      const {data: { success, data }} = await Request.get(`/api/dashboard/getData`);

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
      <p>Overview: <sub>(refers to total count we have till now)</sub></p>
      <Table
        columns={TOTAL_INFO_COL}
        dataSource={dashboardData.totalOverview}
        pagination={false}
      />
      <br />
      <p>Available Categories: <sub>(Total count we have till now)</sub></p>
      <Table
        columns={BOOK_CATEGORY_COL}
        dataSource={getPie(dashboardData.booksByCategory, "books")}
        pagination={false}
      />
      <br />
      <p>Available Users: <sub>(Total count we have till now)</sub></p>
      <Table
        columns={USER_TYPE_COL}
        dataSource={getPie(dashboardData.usersByRole, "users")}
        pagination={false}
      />
      {
        dashboardData.topBooksByQty && dashboardData.topBooksByQty.length > 0 ? (
          <>
            <br />
            <p>Top books by Purchase Order: <sub>(On basis of volume of book sales - max 5 books displayed)</sub></p>
            <Table
              columns={TOP_BOOKS_COL}
              dataSource={dashboardData.topBooksByQty}
              pagination={false}
            />
          </>
        ) : ""
      }
      {
        dashboardData.topBooksByQty && dashboardData.topBooksByQty.length > 0 ? (
          <>
            <br />
            <p>Top books by Revenue: <sub>(On basis of revenue from book sales - max 5 books displayed)</sub></p>
            <Table
              columns={TOP_BOOKS_COL}
              dataSource={dashboardData.topBooksByRevenue}
              pagination={false}
            />
          </>
        ) : ""
      }
      {
        dashboardData.topUsers && dashboardData.topUsers.length > 0 ? (
          <>
            <br />
            <p>Top Users by Purchase Orders: <sub>(On basis of book orders by users - max 5 users displayed)</sub></p>
            <Table
              columns={getTopUsersCol("user")}
              dataSource={dashboardData.topUsers}
              pagination={false}
            />
          </>
        ) : ""
      }
      {
        dashboardData.topWriters && dashboardData.topWriters.length > 0 ? (
          <>
            <br />
            <p>Top Writers by No. Published Books: <sub>(On basis of books published by writers - max 5 writer displayed)</sub></p>
            <Table
              columns={getTopUsersCol("writer")}
              dataSource={dashboardData.topWriters}
              pagination={false}
            />
          </>
        ) : ""
      }
      <br />
      <p>The Weekly summay: <sub>(On basis of 7 days data.)</sub></p>
      <Table
        columns={WEEK_COL}
        dataSource={getSummaryData(dashboardData.weekData)}
        pagination={false}
      />
      <br />
      <p>The Yearly summay: <sub>(On basis of a year.)</sub></p>
      <Table
        columns={YEAR_COL}
        dataSource={getSummaryData(dashboardData.yearData)}
        pagination={false}
      />
    </DefaultLayout>
  );
};

export default DashboardComponent;
