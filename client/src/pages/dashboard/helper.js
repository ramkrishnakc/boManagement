import { TAX } from "../../constants";

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

export const getRecordTotal = ({ price, quantity = 1, discount = 0}) =>
  Number(Number((price - (discount * price / 100)) * quantity).toFixed(2));

export const calculateTotal = (items = [], tax = TAX) => {
  const subtotal = items
    .reduce((
      acc, { price, discount = 0, quantity = 1 }
    ) => acc + getRecordTotal({ price, quantity, discount }), 0);

  return { subtotal, total: Number(Number(subtotal + subtotal * tax / 100 ).toFixed(2)) };
};

export const BOOKS_BY_USERS = [
  {
    title: "Books",
    dataIndex: "name",
  },
  {
    title: "No. of Readers",
    dataIndex: "user",
    render: count => count > 0 ? count : 0,
  },
  {
    title: "Revenue Generated (Rs.)",
    dataIndex: "revenue",
    render: count => count > 0 ? `RS. ${count}` : 0,
  },
];
