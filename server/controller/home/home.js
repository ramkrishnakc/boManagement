const { BillModel, BookModel, CategoryModel } = require("../../models");
const { logger } = require("../../config");
const { dateBefore, sendData, sendError } = require("../helper/lib");

const getData = async (req, res) => {
  try {
    const hrs = req.query.hrs || 24 * 30 // Recent 30 days
    const mDate = dateBefore(hrs);

    const promises = [
      /* Get recently added books */
      BookModel.find(
        { createdAt: { $gt: mDate } },
        { _id: 1, name: 1, author: 1, image: 1, discount: 1, price: 1, createdAt: 1 },
        { limit: 10, sort: { "createdAt": -1 } }
      ),
      /* Get popular books on basis of cart */
      BillModel.aggregate([
        { $match: { createdAt: { $gt: mDate } }},
        { $unwind: "$cartItems" },
        { $project: { _id: { $toObjectId: "$cartItems.itemId" } } },
        { 
          $lookup: {
            from: "books",
            let: { searchId: "$_id" },
            pipeline: [
              {$match: { $expr: { $eq: ["$_id", "$$searchId" ]}}},
              {$project:{ _id: 0, name: 1,  author: 1, image: 1, price: 1, discount: 1 }}
            ],
            as: "books"
          }
        },
        { $group: { _id: '$_id', book: { $first: { $first: "$books" }} }},
        {
          $project: {
            _id: 1,
            name: "$book.name",
            author: "$book.author",
            image: "$book.image",
            discount: "$book.discount",
            price: "$book.price",
          }
        },
        { $limit: 10 }
      ]),
      /* Get all categories */
      CategoryModel.find({}, { _id: 1, name: 1, image: 1 }),
    ];

    const [recentBooks, topBooks, categories] = await Promise.all(promises);
    const data = {
      recentBooks,
      topBooks: topBooks.length >= 10 ? topBooks : [...topBooks, ...recentBooks.slice(0, 5)],
      categories,
    };
    return sendData(res, data);
  } catch (err) {
    console.log(err);
    logger.error(err.stack);
    return sendError(res, 400);
  }
};

module.exports = { getData };