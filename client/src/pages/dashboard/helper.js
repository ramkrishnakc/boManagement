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
    title: (<>Orders <sub>(Processed | Pending | Received )</sub></>),
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
    dataIndex: "qty",
  },
  {
    title: "Total Revenue (RS.)",
    dataIndex: "revenue",
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

/* --------------- JUST DUMMY DATA --------------------- */
export const weekData = [
  {
    day: "Sunday",
    book: 4,
    user: 5,
    order: 8,
    revenue:3
  },
  {
    day: "Monday",
    book: 5,
    user: 9,
    order: 2,
    revenue: 11
  },
  {
    day: "Tuesday",
    book: 1,
    user: 3,
    order: 7,
    revenue: 9
  },
  {
    day: "Wednesday",
    book: 4,
    user: 5,
    order: 2,
    revenue:1
  },
  {
    day: "Thursday",
    book: 2,
    user: 5,
    order: 2,
    revenue:3
  },
  {
    day: "Friday",
    book: 1,
    user: 9,
    order: 3,
    revenue:3
  },
  {
    day: "Saturday",
    book: 6,
    user: 8,
    order: 3,
    revenue:4
  },
];

export const yearData = [
  {
    day: "Jan",
    book: 4,
    user: 5,
    order: 8,
    revenue:3
  },
  {
    day: "Feb",
    book: 5,
    user: 9,
    order: 2,
    revenue: 11
  },
  {
    day: "Nov",
    book: 1,
    user: 3,
    order: 7,
    revenue: 9
  },
  {
    day: "Apr",
    book: 4,
    user: 5,
    order: 2,
    revenue:1
  },
  {
    day: "May",
    book: 2,
    user: 5,
    order: 2,
    revenue:3
  },
  {
    day: "Jun",
    book: 1,
    user: 9,
    order: 3,
    revenue:3
  },
  {
    day: "Jul",
    book: 6,
    user: 8,
    order: 3,
    revenue:4
  },
  {
    day: "Aug",
    book: 4,
    user: 1,
    order: 9,
    revenue:3
  },
  {
    day: "Sep",
    book: 2,
    user: 2,
    order: 8,
    revenue: 11
  },
  {
    day: "Oct",
    book: 1,
    user: 2,
    order: 7,
    revenue: 9
  },
  {
    day: "Nov",
    book: 4,
    user: 8,
    order: 7,
    revenue:1
  },
  {
    day: "Dec",
    book: 2,
    user: 9,
    order: 11,
    revenue:3
  },
];

export const latestData = {
  bookNew: 120,
  bookTotal: 2000,
  userUnverified: 9,
  userNew: 20,
  userTotal: 200,
  orderReceived: 200,
  orderPending: 34,
  orderProcessed: 25,
};

export const booksByCategory = {
  bookNewioweioroiewt: 120,
  bookTotal: 21,
  userUnverified: 9,
  userNew: 20,
  userTotal: 20,
  orderReceived: 92,
  orderPending: 34,
  orderProcessed: 25,
};

export const topTenBooks = [
  {
    name: "bookNewioweioroiewt",
    recentOrder: 34,
    totalOrder: 120,
  },
  {
    name: "bookNewioweioroiewt",
    recentOrder: 34,
    totalOrder: 120,
  },{
    name: "bookNewioweioroiewt",
    recentOrder: 34,
    totalOrder: 120,
  },{
    name: "bookNewioweioroiewt",
    recentOrder: 34,
    totalOrder: 120,
  },{
    name: "bookNewioweioroiewt",
    recentOrder: 34,
    totalOrder: 120,
  },{
    name: "bookNewioweioroiewt",
    recentOrder: 34,
    totalOrder: 120,
  },{
    name: "bookNewioweioroiewt",
    recentOrder: 34,
    totalOrder: 120,
  },{
    name: "bookNewioweioroiewt",
    recentOrder: 34,
    revenue: 120,
  },{
    name: "bookNewioweioroiewt",
    recentOrder: 34,
    revenue: 120,
  },{
    name: "bookNewioweioroiewt",
    recentOrder: 34,
    revenue: 120,
  },
];

export const DASHBOARD_INIT = {
  latestData,
  booksByCategory,
  topTenBooks,
  weekData,
  yearData,
};