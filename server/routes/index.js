const booksRoute = require("../controller/book");
const usersRoute = require("../controller/user");
const billsRoute = require("../controller/bill");
const categoryRoute = require("../controller/category");
const DashboardRoute = require("../controller/dashboard");

const routes = (app) => {
  app.use("/api/users/", usersRoute);
  app.use("/api/books/", booksRoute);
  app.use("/api/bills/", billsRoute);
  app.use("/api/category/", categoryRoute);
  app.use("/api/dashboard/", DashboardRoute);
};

module.exports = routes;
