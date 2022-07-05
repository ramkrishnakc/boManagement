const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");
const { logger } = require("../../config");
const { BillModel, BookModel, CategoryModel, UserModel } = require("../../models");
const {
  dateBefore,
  sendData,
  sendError,
  RECEIVED,
  PENDING,
  COMPLETED,
  CANCELED,
  DAYS,
  MONTHS,
} = require("../helper/lib");

/* Return book count by category */
const getBooksByCategory = async mDate => {
  const categories = await CategoryModel.find(
    {},
    { __v: 0, updatedAt: 0, image: 0, description: 0 }
  );
  const books = await BookModel.aggregate([
    {
      $match:{ createdAt: { $gt: new Date(mDate) }}
    },
    {
      $group: { _id: "$category", count: { $sum: 1 } }
    }
  ]);
  
  return categories.reduce((acc, curr) => {
    const obj = books.find(b => b._id === curr._id.toString());
    acc[curr.name] = (obj && obj.count) || 0;

    return acc;
  }, {});
};

/* Get latest data of book, user, order e.t.c */
const getLatestData = async mDate => {
  const promises = [
    BookModel.find({ createdAt: { $gt: mDate }}).count(),
    BookModel.find().count(),
    UserModel.find({ role: "user", verified: false, createdAt: { $gt: mDate }}).count(),
    UserModel.find({ role: "user", createdAt: { $gt: mDate }}).count(),
    UserModel.find({ role: "user" }).count(),
    BillModel.find({ createdAt: { $gt: mDate }}, { cartItems: 1, status: 1 }),
  ]

  const [
    bookNew,
    bookTotal,
    userUnverified,
    userNew,
    userTotal,
    orders,
  ] = await Promise.all(promises);

  return {
    bookNew,
    bookTotal,
    userUnverified,
    userNew,
    userTotal,
    orderReceived: orders.filter(d => d.status === RECEIVED).length,
    orderPending: orders.filter(d => d.status === PENDING).length,
    orderProcessed: orders.filter(d => d.status === COMPLETED).length,
    orderCancelled: orders.filter(d => d.status === CANCELED).length,
    allOrders: orders,
  }
};

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
      { $project: { [gKey]: { [`$${gKey}`]: "$createdAt" }, cartItems: 1, status: 1} },
      { $group: {
        _id: `$${gKey}`,
        count: { $sum: 1 },
      }},
    ]),
  ];

  const [books, users, bills] = await Promise.all(promises);

  return Object.keys(mapper).map(idx => ({
    day: mapper[idx],
    book: getCount(books, idx),
    user: getCount(users, idx),
    order: getCount(bills, idx),
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
      getLatestData(mDate),
      getBooksByCategory(mDate),
      getWeekSummary(),
      getYearSummary(year),
    ];

    const [
      allLatestData,
      booksByCategory,
      weekData,
      yearData,
    ] = await Promise.all(promises);

    const topBooks = [];
    const { allOrders, ...latestData } = allLatestData;

    allOrders.forEach(({ cartItems }) => {
      cartItems.forEach(({ name, itemId, quantity, author, total }) => {
        const idx = _.findIndex(topBooks, e => e.itemId === itemId);
        
        if (idx > -1) {
          topBooks[idx] = {
            ...topBooks[idx],
            quantity: topBooks[idx].quantity + quantity,
            total: topBooks[idx].total + total,
          };
        } else {
          topBooks.push({
            name,
            itemId,
            quantity,
            author,
            total,
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
      latestData,
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

const getWriterDashboard = async (req, res) => {
  try {
    const user = await UserModel.findOne(
      { _id: ObjectId(req.params.userId) },
      { publishedBooks: 1 }
    );
    const bookIds = _.get(user, "publishedBooks", []);

    if (bookIds.length) {
      const books = await BookModel
        .find({_id: { $in: bookIds.map(id => ObjectId(id)) }}, { name: 1, _id: 1 })
        .sort({ createdAt: -1 });
      
      const promises = books.map(book =>
        UserModel.find({ purchasedBooks: { $elemMatch: { $eq: book._id } } }).count()
      );
      const users = await Promise.all(promises);

      const data = {
        books: books.map(({ name }, idx) => ({
          name,
          user: users[idx],
          revenue: 0,
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
