import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Table } from "antd";

import Request from "../../library/request";
import DefaultLayout from "../../components/DefaultLayout";
import { SHOW_LOADER } from "../../constants";
import SimplePieChart from "./piechart";
import SimpleLineChart from "./lineChart";
import {
  LATEST_INFO_COL,
  TOP_BOOKS_COL,
  BOOK_CATEGORY_COL,
  WEEK_COL,
  YEAR_COL,
  DASHBOARD_INIT,
} from "./helper";

const getLatestData = data => ([
  {
    books: `${data.bookNew} | ${data.bookTotal}`,
    users: `${data.userUnverified} | ${data.userNew} | ${data.userTotal}`,
    orders: `${data.orderProcessed} | ${data.orderPending} | ${data.orderReceived}`,
  },
  {
    books: (
      <SimplePieChart data={[
        { name: "New", value: data.bookNew },
        { name: "Existing", value: data.bookTotal - data.bookNew },
      ]}
    />),
    users: (
      <SimplePieChart data={[
        { name: "New", value: data.userNew },
        { name: "Existing", value: data.userTotal - data.userNew - data.userUnverified },
        { name: "Unverified", value: data.userUnverified },
      ]}
    />),
    orders: <SimplePieChart data={[
      { name: "Processed", value: data.orderProcessed },
      { name: "Pending", value: data.orderPending },
      { name: "Received", value: data.orderReceived }
    ]} />,
  }
]);

const getBooksByCategory = data => ([{
  books: (
    <SimplePieChart
      data={Object.keys(data)
        .map(key => {
          const value = data[key] || 0;
          return { name: `${key} = ${value}`, value };
        })
      }
      width={1000}
      height={400}
      innerRadius={0}
      outerRadius={170}
      showLabel={true}
    />),
}]);

const getSummaryData = data => {
  const lineKeys = ["book", "user", "order", "revenue"];
  return [{
    summary: (
      <SimpleLineChart data={data} dataKey="day" lineKeys={lineKeys} />
    ),
  }];
};

const DashboardComponent = () => {
  const [dashboardData, setDashboardData] = useState(DASHBOARD_INIT);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch({ type: SHOW_LOADER, payload: true });
      const {data: { success, data }} = await Request.get(`/api/dashboard/getData`);
      dispatch({ type: SHOW_LOADER });

      if (success) {
        setDashboardData({
          ...dashboardData,
          data,
        });
      }
    } catch (err) {
      dispatch({ type: SHOW_LOADER });
      console.log(err);
    }
  };

  useEffect(() => getData(), []);

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>Dashboard</h3>
      </div>
      <p>Latest 48 hours Data: <sub>(shows latest info only, 'Total' refers all the total we have till now)</sub></p>
      <Table
        columns={LATEST_INFO_COL}
        dataSource={getLatestData(dashboardData.latestData)}
        pagination={false}
        className="ant-table-custom"
      />
      <br />
      <p>Books added during latest 48 hours: <sub>(shows latest info only)</sub></p>
      <Table
        columns={BOOK_CATEGORY_COL}
        dataSource={getBooksByCategory(dashboardData.booksByCategory)}
        pagination={false}
        className="ant-table-custom"
      />
      <br />
      <p>Top 10 books by purchase order: <sub>(On basis of 48 hours sales. Revenue is on basis of any state of item order)</sub></p>
      <Table
        columns={TOP_BOOKS_COL}
        dataSource={dashboardData.topTenBooks}
        pagination={false}
        className="ant-table-custom"
      />
      <br />
      <p>The Weekly summay: <sub>(On basis of 7 days data. Revenue(on Thousand))</sub></p>
      <Table
        columns={WEEK_COL}
        dataSource={getSummaryData(dashboardData.weekData)}
        pagination={false}
      />
      <br />
      <p>The Yearly summay: <sub>(On basis of a year. Revenue(on Thousand))</sub></p>
      <Table
        columns={YEAR_COL}
        dataSource={getSummaryData(dashboardData.yearData)}
        pagination={false}
      />
    </DefaultLayout>
  );
};

export default DashboardComponent;
