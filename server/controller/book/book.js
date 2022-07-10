const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");

const { logger } = require("../../config");
const { BookModel, UserModel } = require("../../models");
const { sendData, sendError, removeFiles } = require("../helper/lib");

const allowedFields = [
  "name",
  "discount",
  "price",
  "author",
  "category",
  "language",
  "published",
  "description",
];

const getById = async (req, res) => {
  try {
    if (!req.params.id) {
      return sendError(res, 400);
    }

    const item = await BookModel.findOne({ _id: ObjectId(req.params.id) });
    return sendData(res, item);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const getAll = async (req, res) => {
  try {
    const items = await BookModel
      .find({}, { protectdItems: 0 })
      .sort({ createdAt: -1 });
    return sendData(res, items);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const actualSave = async req => {
  if (!req.body.name || !req.body.price || !req.body.author || !req.body.category) {
    return null;
  }

  const payload = _.pick(req.body, allowedFields);
  const filename = _.get(req, "file.filename");

  if (filename) {
    payload.image = `/public/${filename}`;
  }

  const newItem = new BookModel(payload);
  const item = await newItem.save();

  if (item) {
    return item;
  }
  return null;
};

const add = async (req, res) => {
  try {
    const item = await actualSave(req);

    if (item) {
      logger.info("Book info added successfully");
      return sendData(res, { _id: item._id }, "Book info added successfully!!");
    }
    return sendError(res, 400);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const update = async (req, res) => {
  try {
    if (!req.params.id) {
      return sendError(res, 400);
    }

    const payload = _.pick(req.body, allowedFields);
    const filename = _.get(req, "file.filename");

    if (filename) {
      payload.image = `/public/${filename}`;
    }

    const item = await BookModel.findOneAndUpdate({ _id : ObjectId(req.params.id) } , payload);
    if (item) {
      /* Remove old image from the folder */
      if (item.image) {
        removeFiles([item.image]);
      }
      return sendData(res, { _id: req.params.id }, "Book info updated successfully!!");
    }
    return sendError(res, 404);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const remove = async (req, res) => {
  try {
    if (!req.params.id) {
      return sendError(res, 400);
    }

    const userInfo = await UserModel.findOne({ purchasedBooks: { $elemMatch: { $eq: req.params.id } } });

    if (userInfo) {
      const msg = "Cannot remove book. It's in purchase list of some Users.";
      logger.info(msg);
      return sendError(res, 400, msg);
    }

    const item = await BookModel.findOneAndDelete({ _id: ObjectId(req.params.id) });

    if (item) {
      /* Remove image from the folder */
      if (item.image) {
        removeFiles([item.image]);
      }
      /* Remove all the files associated with the book */
      const files = await global.bucket.find({ "metadata.refId": req.params.id }).toArray();

      if (files.length) {
        const promises = files.map(d => global.bucket.delete(d._id));
        await Promise.all(promises);
      }

      if (req.params.userId) {
        /* For published books, remove it from published list of user */
        await UserModel.updateOne(
          { _id: ObjectId(req.params.userId) },
          { $pull: { publishedBooks: req.params.id } }
        );
      } else {
        /* If book is removed by "admin", remove it from published list of any "writer" */
        await UserModel.updateOne(
          {},
          { $pull: { publishedBooks: req.params.id } }
        );
      }

      return sendData(res, null, "Book info removed successfully!!");
    }
    return sendError(res, 404);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const search = async (req, res) => {
  try {
    const {
      offset,
      limit = 12,
      keyword = "",
      keyFields,
      matchCriteria,
      categoryCriteria = {},
    } = req.body;

    let matchObj = {};

    if (!_.isEmpty(matchCriteria)) {
      matchObj = { ...matchCriteria };
    }

    if (Array.isArray(keyFields) && keyFields.length) {
      const orCriteria = keyFields.map(key =>({[key]: new RegExp(keyword, "i") }));

      matchObj = {
        ...matchObj,
        $or: orCriteria
      };
    }

    const searchCriteria = [
      { $match: { ...matchObj }},
      {
        $project: {
          _id: 1,
          name: 1,
          author: 1,
          category: 1,
          price: 1,
          discount: 1,
          image: 1,
        }
      },
      {
        $lookup: {
          from: "categories",
          let: { searchId: { $toObjectId: "$category" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$searchId" ]}}},
            { $project:{ _id: 0, name: 1 } },
          ],
          as: "category"
        }
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 1,
          name: 1,
          author: 1,
          category: "$category.name",
          price: 1,
          discount: 1,
          image: 1,
        }
      },
      { $match: { ...categoryCriteria }},
      { $sort : { createdAt : -1 } },
      /* Return total and paginated result */
      {
        $facet: {
          results: [
            { $skip: offset },
            { $limit: limit }
          ],
          totalCount: [
            {
              $count: 'count'
            }
          ]
        }
      },
    ];

    const data = await BookModel.aggregate(searchCriteria);
    return sendData(res, data[0]);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

/* ------------------ Following handlers are for the user role: "WRITER" ------------------- */
const getPublishedBooks = async (req, res) => {
  try {
    const user = await UserModel.findOne(
      { _id: ObjectId(req.params.userId) },
      { publishedBooks: 1 }
    );
    const bookIds = _.get(user, "publishedBooks", []);

    const items = await BookModel
      .find({_id: { $in: bookIds.map(id => ObjectId(id)) }}, { protectdItems: 0 })
      .sort({ createdAt: -1 });

    return sendData(res, items);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const updatePublishedBook = async (req, res) => {
  if (!req.params.userId ||
    req.params.userId !== _.get(res, "locals.payload.id")
  ) {
    return sendError(res, 400);
  }

  return update(req, res);
};

const publishBook = async (req, res) => {
  try {
    if (!req.params.userId ||
      req.params.userId !== _.get(res, "locals.payload.id")
    ) {
      return sendError(res, 400);
    }

    const item = await actualSave(req);

    if (item) {
      /* User info should also be updated */
      const userInfo = await UserModel.updateOne(
        { _id: ObjectId(req.params.userId) },
        { $addToSet: { publishedBooks: (item._id).toString() } }
      );

      if (userInfo) {
        logger.info(`Book published by ${req.params.userId} successfully`);
        return sendData(res, { _id: item._id }, "Book published successfully!!");
      }
    }
    return sendError(res, 400);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const removePublishedBook = async (req, res) => {
  if (!req.params.userId ||
    req.params.userId !== _.get(res, "locals.payload.id")
  ) {
    return sendError(res, 400);
  }

  return remove(req, res);
};

module.exports = {
  getById,
  getPublishedBooks,
  getAll,
  add,
  publishBook,
  update,
  updatePublishedBook,
  remove,
  removePublishedBook,
  search,
};
