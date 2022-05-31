const ObjectId = require("mongoose").Types.ObjectId;

const { logger } = require("../../config");
const { BillModel } = require("../../models");
const { sendData, sendError } = require("../helper/lib");

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendError(res, 400);
    }

    const item = await BillModel.findOne({ _id: ObjectId(id) });
    return sendData(res, item);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const getAll = async (req, res) => {
  try {
    const items = await BillModel.find();
    return sendData(res, items);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const add = async (req, res) => {
  try {
    const { customerName, customerPhoneNumber } = req.body;

    if (!customerName || !customerPhoneNumber) {
      return sendError(res, 400);
    }

    const newItem = new BillModel(req.body);
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

    const item = await BillModel.findOneAndUpdate({ _id : ObjectId(id) } , req.body);
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

    const item = await BillModel.findOneAndDelete({ _id: ObjectId(id) });

    if (item) {
      return sendData(res, null, "Item removed successfully");
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
