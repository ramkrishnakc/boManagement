export const COLORS = [
  "#3DCC91",
  "#FFB366",
  "#FF7373",
  "#44FF07",
  "#633EBB",
  "#FFF44C",
  "#BE61CA",
  "#FD6787",
  "#3700FF",
  "#288EEB",
  "#7AC142",
  "#007CC3",
  "#44FF07",
];

export const LATEST_INFO_COL = [
  {
    title: (<>Books <sub>(Newly Added | Total)</sub></>),
    dataIndex: "books",
  },
  {
    title: (<>Users <sub>(Unverifed | Newly Added | Total)</sub></>),
    dataIndex: "users",
  },
  {
    title: (<>Orders <sub>(Processed | Pending | Received | Canceled)</sub></>),
    dataIndex: "orders",
  },
];

export const TOP_BOOKS_COL = [
  {
    title: "Books",
    dataIndex: "name",
  },
  {
    title: "Author",
    dataIndex: "author",
  },
  {
    title: "Order (quantity)",
    dataIndex: "quantity",
  },
  {
    title: "Total Revenue (RS.)",
    dataIndex: "total",
  },
];

export const BOOK_CATEGORY_COL = [
  {
    title: "Books by Category",
    dataIndex: "books",
  },
];

export const WEEK_COL = [
  {
    title: "Weekly Summary",
    dataIndex: "summary",
  },
];

export const YEAR_COL = [
  {
    title: `Yearly Summary: ${(new Date()).getFullYear()}`,
    dataIndex: "summary"
  }
];

export const DASHBOARD_INIT = {
  latestData: {},
  booksByCategory: {},
  topBooksByQty: [],
  topBooksByRevenue: [],
  weekData: [],
  yearData: [],
};
