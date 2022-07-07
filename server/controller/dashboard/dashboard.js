const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");
const { logger } = require("../../config");
const { BillModel, BookModel, CategoryModel, InstitutionModel, UserModel } = require("../../models");
const {
  dateBefore,
  sendData,
  sendError,
  DAYS,
  MONTHS,
} = require("../helper/lib");

/* Return book count by category */
const getBooksByCategory = async () => {
  const categories = await CategoryModel.find(
    {},
    { __v: 0, updatedAt: 0, image: 0, description: 0 }
  );
  const books = await BookModel.aggregate([
    { $match: {} },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  
  return categories.reduce((acc, curr) => {
    const obj = books.find(b => b._id === curr._id.toString());
    acc[curr.name] = (obj && obj.count) || 0;

    return acc;
  }, {});
};

/* Retun total no. of counts for each entities */
const getTotalOverview = async () => {
  const [b, c, i, o, u] = await Promise.all([
    BookModel.find().count(),
    CategoryModel.find().count(),
    InstitutionModel.find().count(),
    BillModel.find().count(),
    UserModel.find().count(),
  ]);

  return [{
    totalBooks: b,
    totalCategories: c,
    totalInstitutions: i,
    totalBills: o,
    totalUsers: u,
  }];
};

/* Return Users by category */
const getUsersByRole = async () => {
  const [a, w, i, u] = await Promise.all([
    UserModel.find({ role: "admin"}).count(),
    UserModel.find({ role: "writer"}).count(),
    UserModel.find({ role: "institution"}).count(),
    UserModel.find({ role: "user"}).count(),
  ]);

  return {
    "Admin Users": a,
    "Writers": w,
    "Institution Users": i,
    "Normal Users": u,
  };
};

/* Return Top Users by purchase orders */
const getTopUsers = async () => {
  const users = await UserModel.find(
    { $expr:{ $gte: [{ $size:"$purchasedBooks" }, 1] } },
    { username: 1, email: 1, purchasedBooks: 1 }
  );

  return _.sortBy(users, [u => { return u.purchasedBooks.length; }])
    .reverse()
    .slice(0, 5)
    .map(d => ({ username: d.username, email: d.email, quantity: d.purchasedBooks.length}));
};

/* Return Top Writers by published books */
const getTopWriters = async () => {
  const users = await UserModel.find(
    { $expr:{ $gte: [{ $size:"$publishedBooks" }, 1] } },
    { username: 1, email: 1, publishedBooks: 1 }
  );

  return _.sortBy(users, [u => { return u.publishedBooks.length; }])
    .reverse()
    .slice(0, 5)
    .map(d => ({ username: d.username, email: d.email, quantity: d.publishedBooks.length}));
};

/* Get latest data of book, user, order e.t.c */
/*
const getLatestData = async mDate => {
  const promises = [
    BookModel.find({ createdAt: { $gt: mDate }}).count(),
    BookModel.find().count(),
    UserModel.find({ role: "admin", createdAt: { $gt: mDate }}).count(),
    UserModel.find({ role: "writer", createdAt: { $gt: mDate }}).count(),
    UserModel.find({ role: "institution", createdAt: { $gt: mDate }}).count(),
    UserModel.find({ role: "user", createdAt: { $gt: mDate }}).count(),
    UserModel.find({}).count(),
    BillModel.find({ createdAt: { $gt: mDate }}, { cartItems: 1, status: 1 }),
  ]

  const [
    bookNew,
    bookTotal,
    adminUsers,
    writerUsers,
    institutionUsers,
    normalUsers,
    userTotal,
    orders,
  ] = await Promise.all(promises);

  return {
    bookNew,
    bookTotal,
    adminUsers,
    writerUsers,
    institutionUsers,
    normalUsers,
    userTotal,
    orders,
  };
};
*/

const getCount = (arr, idx) =>
  _.get(arr.find(d => d._id == idx), "count", 0);

/* Get summary for certain time period */
const getSummary = async (mDate, gKey, mapper) => {
  const promises = [
    BookModel.aggregate([
      { $match: { createdAt: { $gt: mDate }} },
      { $project: { [gKey]: { [`$${gKey}`]: "$createdAt" }} },
      { $group: { _id: `$${gKey}`, count: { $sum: 1 }} }
    ]),
    UserModel.aggregate([
      { $match: { role: "user", createdAt: { $gt: mDate }} },
      { $project: { [gKey]: { [`$${gKey}`]: "$createdAt" }} },
      { $group: { _id: `$${gKey}`, count: { $sum: 1 }} }
    ]),
    BillModel.aggregate([
      { $match: { createdAt: { $gt: mDate }} },
      { $project: { [gKey]: { [`$${gKey}`]: "$createdAt" }, cartItems: 1 } },
      { $group: {
        _id: `$${gKey}`,
        count: { $sum: 1 },
      }},
    ]),
  ];

  const [books, users, bills] = await Promise.all(promises);

  return Object.keys(mapper).map(idx => ({
    day: mapper[idx],
    books: getCount(books, idx),
    users: getCount(users, idx),
    orders: getCount(bills, idx),
  }));
};

/* Get summary for latest 7 days */
const getWeekSummary = async () => {
  const hrs = 7 * 24 + (new Date()).getHours();
  const min = (new Date()).getMinutes();
  const d = dateBefore(hrs, min);

  return await getSummary(d, "dayOfWeek", DAYS);
};

/* Get summary for year provided */
const getYearSummary = async (date) => {
  const d = new Date(new Date(date).getFullYear(), 0, 1);
  return await getSummary(d, "month", MONTHS);
};

const getData = async (req, res) => {
  try {
    const hrs = req.query.hrs || 48 // Get data for latest 48 hours only
    const mDate = dateBefore(hrs);
    const year = req.query.year || new Date(); // Get data for latest or the year provided

    const promises = [
      getTotalOverview(),
      getUsersByRole(),
      getTopUsers(),
      getBooksByCategory(),
      getWeekSummary(),
      getYearSummary(year),
      BillModel.find({}),
      getTopWriters(),
    ];

    const [
      totalOverview,
      usersByRole,
      topUsers,
      booksByCategory,
      weekData,
      yearData,
      allOrders,
      topWriters,
    ] = await Promise.all(promises);

    const topBooks = [];

    allOrders.forEach(({ cartItems }) => {
      cartItems.forEach(({ name, _id, price, discount, author }) => {
        const cost = Number(Number(price - ((discount * 100)/price)).toFixed(2));
        const idx = _.findIndex(topBooks, e => e._id === _id);
        
        if (idx > -1) {
          topBooks[idx] = {
            ...topBooks[idx],
            quantity: topBooks[idx].quantity + 1,
            total: topBooks[idx].cost + cost,
          };
        } else {
          topBooks.push({
            name,
            _id,
            author,
            quantity: 1,
            total: cost,
          });
        }
      });
    });

    const topBooksByQty = _.orderBy(topBooks, ['quantity'], ['desc'])
      .slice(0, 5)
      .map(({ itemId, ...d }) => d);
    const topBooksByRevenue = _.orderBy(topBooks, ['total'], ['desc'])
      .slice(0, 5)
      .map(({ itemId, ...d }) => d);
    

    const data = {
      totalOverview,
      usersByRole,
      topUsers,
      topWriters,
      booksByCategory,
      topBooksByQty,
      topBooksByRevenue,
      weekData,
      yearData,
    };

    return sendData(res, data);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res, 400);
  }
};

/* For the Writers */
const getWriterDashboard = async (req, res) => {
  try {
    const user = await UserModel.findOne(
      { _id: ObjectId(req.params.userId) },
      { publishedBooks: 1 }
    );
    const bookIds = _.get(user, "publishedBooks", []);

    if (bookIds.length) {
      const books = await BookModel
        .find(
          {_id: { $in: bookIds.map(id => ObjectId(id)) }},
          { price: 1, discount: 1, image: 1, name: 1, _id: 1 }
        )
        .sort({ createdAt: -1 });
      
      const promises = books.map(book =>
        UserModel.find({ purchasedBooks: { $elemMatch: { $eq: book._id.toString() } } }).count()
      );
      const users = await Promise.all(promises);

      const data = {
        books: books.map(({ price, discount = 0, image, name }, idx) => ({
          image,
          name,
          user: users[idx],
          revenue: Number(Number((users[idx] || 0) * (price - (discount / price * 100))).toFixed(2)),
        })),
      };
      return sendData(res, data);
    }

    return sendData(res, { books: [] });
  } catch(err) {
    logger.error(err.stack);
    return sendError(res, 400);
  }
};

module.exports = {
  getData,
  getWriterDashboard,
};
