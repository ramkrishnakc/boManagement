const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");

const { logger } = require("../../config");
const { BillModel, UserModel } = require("../../models");
const { sendData, sendError } = require("../helper/lib");

const getAll = async (req, res) => {
  try {
    const items = await BillModel.aggregate([
      { $match: {} },
      { $project: {
          cartItems: 1,
          createdAt: 1,
          taxRate: 1,
          customerId: { $toObjectId: "$customerId" },
          _id: 1
        },
      },
      {
        $lookup: {
          from: "users",
          let: { searchId: "$customerId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$searchId" ] } } },
            { $project: { _id: 0, username: 1, email: 1 } },
          ],
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          cartItems: 1,
          createdAt: 1,
          taxRate: 1,
          username: "$user.username",
          email: "$user.email",
        }
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return sendData(res, items);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const add = async (req, res) => {
  try {
    const { customerId, cartItems } = req.body;

    if (!customerId || !Array.isArray(cartItems) || !_.get(cartItems, "[0]")) {
      return sendError(res, 400);
    }

    const newItem = new BillModel(req.body);
    const item = await newItem.save();

    if (item) {
      const msg = "Bill is added successfully";

      const ids = _.uniq(cartItems.map(d => d._id));

      const up = await UserModel.findOneAndUpdate(
        { _id: ObjectId(customerId) },
        { $push: { purchasedBooks: { $each: ids } } }
      );

      if (up) {
        logger.info(msg);
        return sendData(res, null, msg);
      } else {
        // Remove bill data if we couldn't update "user" collection
        await BillModel.findOneAndDelete({ _id: ObjectId(item._id) });
      }
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

    const item = await BillModel.findOneAndUpdate({ _id : ObjectId(req.params.id) } , req.body);
    if (item) {
      return sendData(res, null, "Bill updated successfully");
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

    const item = await BillModel.findOneAndDelete({ _id: ObjectId(req.params.id) });

    if (item) {
      return sendData(res, null, "Bill removed successfully");
    }
    return sendError(res, 404);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const getByUserId = async (req, res) => {
  try {
    if (!req.params.userId) {
      return sendError(res, 400);
    }
    /* Allow actual user to access his/her bills */
    if (_.get(res, "locals.payload.id") !== req.params.userId) {
      return sendError(res, 400);
    }

    const item = await BillModel
      .find(
        { customerId: req.params.userId },
        { cartItems: 1, createdAt: 1, taxRate: 1, _id: 1 },
      )
      .sort({ createdAt: -1 });
    return sendData(res, item);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

module.exports = {
  getByUserId,
  getAll,
  add,
  update,
  remove,
};
