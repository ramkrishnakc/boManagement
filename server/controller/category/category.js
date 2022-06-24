const ObjectId = require("mongoose").Types.ObjectId;

const { logger } = require("../../config");
const { CategoryModel, BookModel } = require("../../models");
const { sendData, sendError } = require("../helper/lib");

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendError(res, 400);
    }

    const item = await CategoryModel.findOne({ _id: ObjectId(id) });
    return sendData(res, item);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const getAll = async (req, res) => {
  try {
    const items = await CategoryModel
      .find({}, { __v: 0, updatedAt: 0})
      .sort({createdAt: -1});
    const books = await BookModel.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    
    const resData = items.map(item => {
      const match = books.find(b => b._id === item._id.toString());
      return {
        ...item._doc,
        bookCount: (match && match.count) || 0 // find no. of books in a category
      };
    });
    return sendData(res, resData);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const add = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return sendError(res, 400);
    }

    const payload = { name };

    if (description) {
      payload.description = description;
    }
    if (req.file && req.file.filename) {
      payload.image = `/public/${req.file.filename}`;
    }

    const newItem = new CategoryModel(payload);
    const item = await newItem.save();

    if (item) {
      const msg = `Category ${name} added successfully.`
      logger.info(msg);
      return sendData(res, null, msg);
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

    const { name, description } = req.body;
    const payload = {};

    if (name) {
      payload.name = name;
    }
    if (description) {
      payload.description = description;
    }
    if (req.file && req.file.filename) {
      payload.image = `${req.protocol}://${req.get('host')}/public/${req.file.filename}`;
    }

    const item = await CategoryModel.findOneAndUpdate({ _id : ObjectId(id) } , payload);

    if (item) {
      const msg = `Category with id: ${req.params.id}, name: ${item.name} updated successfully.`
      logger.info(msg);
      return sendData(res, null, msg);
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

    const item = await CategoryModel.findOneAndDelete({ _id: ObjectId(req.params.id) });

    if (item) {
      const msg = `Category with id: ${req.params.id}, name: ${item.name} removed successfully.`
      logger.info(msg);
      return sendData(res, null, msg);
    }
    return sendError(res, 404);
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
};
