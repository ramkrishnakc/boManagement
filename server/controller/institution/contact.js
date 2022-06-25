const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");

const { logger } = require("../../config");
const { InstitutionModel, InstAboutModel } = require("../../models");
const { sendData, sendError } = require("../helper/lib");

const allowedFields = [
  "text",
  "images",
  "html"
];

const getByRefId = async (req, res) => {
  try {
    if (!req.params.refId) {
      return sendError(res, 400);
    }

    const item = await InstAboutModel.findOne({ refId });

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
      const msg = `About info added for college: ${req.params.refId}.`;
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
  
};

module.exports = {
  getByRefId,
  add,
  update,
};
