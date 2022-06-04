const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");

const { logger } = require("../../config");
const { BookModel } = require("../../models");
const { sendData, sendError } = require("../helper/lib");

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
    const { id } = req.params;
    if (!id) {
      return sendError(res, 400);
    }

    const item = await BookModel.findOne({ _id: ObjectId(id) });
    return sendData(res, item);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const getAll = async (req, res) => {
  try {
    const items = await BookModel.find();
    return sendData(res, items);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const add = async (req, res) => {
  try {
    if (!req.body.name || !req.body.price || !req.body.author || !req.body.category) {
      return sendError(res, 400);
    }

    const payload = allowedFields.reduce((acc, key) => {
      const val = req.body[key];
      if (val) {
        acc[key] = val;
      }
      return acc;
    }, {});

    if (req.file && req.file.filename) {
      payload.image = `/public/${req.file.filename}`;
    }

    const newItem = new BookModel(payload);
    const item = await newItem.save();

    if (item) {
      logger.info("Item added successfully");
      return sendData(res, null, "Item added successfully");
    }
    return sendError(res, 400);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendError(res, 400);
    }

    const payload = allowedFields.reduce((acc, key) => {
      const val = req.body[key];
      if (val) {
        acc[key] = val;
      }
      return acc;
    }, {});

    if (req.file && req.file.filename) {
      payload.image = `${req.protocol}://${req.get('host')}/public/${req.file.filename}`;
    }

    const item = await BookModel.findOneAndUpdate({ _id : ObjectId(id) } , payload);
    if (item) {
      return sendData(res, null, "Item updated successfully");
    }
    return sendError(res, 404);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendError(res, 400);
    }

    const item = await BookModel.findOneAndDelete({ _id: ObjectId(id) });

    if (item) {
      return sendData(res, null, "Item removed successfully");
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

    if (Array.isArray(keyFields)) {
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
      { $match: { ...categoryCriteria }},
      /* Return total and paginated result */
      {
        $facet: {
          results: [{ $skip: offset }, { $limit: limit }],
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

module.exports = {
  getById,
  getAll,
  add,
  update,
  remove,
  search,
};
