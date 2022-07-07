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
    title: "Total Revenue (Rs.)",
    dataIndex: "total",
  },
];

export const BOOK_CATEGORY_COL = [
  {
    title: "Total No. books by Category",
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
  totalOverview: [],
  booksByCategory: {},
  usersByRole: {},
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

  return { subtotal: Number(Number(subtotal).toFixed(2)), total: Number(Number(subtotal + subtotal * tax / 100 ).toFixed(2)) };
};

export const TOTAL_INFO_COL = [
  {
    title: "Books",
    dataIndex: "totalBooks",
  },
  {
    title: "Categories",
    dataIndex: "totalCategories",
  },
  {
    title: "Institutions",
    dataIndex: "totalInstitutions",
  },
  {
    title: "Orders",
    dataIndex: "totalBills",
  },
  {
    title: "Users",
    dataIndex: "totalUsers",
  },
];

export const USER_TYPE_COL = [
  {
    title: "Total No. Users by Role",
    dataIndex: "users",
  },
];

export const getTopUsersCol = role => {
  const cols = [
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
  ];

  if (role === "writer") {
    cols.push({
      title: "No. of books Published",
      dataIndex: "quantity",
    });
  }
  if (role === "user") {
    cols.push({
      title: "No. of books Purchased",
      dataIndex: "quantity",
    });
  }

  return cols;
};
