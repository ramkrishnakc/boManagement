const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");

const { logger } = require("../../config");
const { InstAboutModel } = require("../../models");
const { sendData, sendError } = require("../helper/lib");

const allowedFields = ["address", "phone", "email", "website", "externalLinks", "gMap"];

const getByRefId = async (req, res) => {
  try {
    if (!req.params.refId) {
      return sendError(res, 400);
    }

    const item = await InstAboutModel.findOne(
      { refId: req.params.refId },
      { _id: 1, text: 1, images: 1, html: 1 }
    );

    return sendData(res, item);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const add = async (req, res) => {
  try {
    if (!req.params.refId ||
      req.params.refId !== _.get(res, "locals.payload.institution")
    ) {
      return sendError(res, 400);
    }

    const payload = _.pick(req.body, allowedFields);
    const newItem = new InstAboutModel({refId: req.params.refId,  ...payload });
    const item = await newItem.save();

    if (item) {
      return sendData(res, null, "Contact information saved successfully.");
    }
    return sendError(res, 400);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const update = async (req, res, next) => {
  try {
    if (!req.params.refId ||
      !req.params.id ||
      req.params.refId !== _.get(res, "locals.payload.institution")
    ) {
      return sendError(res, 400);
    }

    const payload = _.pick(req.body, allowedFields);
    const item = await InstAboutModel.findOneAndUpdate({ _id : ObjectId(req.params.id) } , payload);

    if (item) {
      return sendData(res, null, "Contact information updated successfully");
    }
    return sendError(res, 400);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

module.exports = {
  getByRefId,
  add,
  update,
};
