const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");

const { logger } = require("../../config");
const { InstActivityModel } = require("../../models");
const { sendData, sendError } = require("../helper/lib");

const allowedFields = ["title", "description", "images", "html", "externalLinks"];

const projection = {
  _id: 1,
  ...allowedFields.reduce((acc, curr) => {
    acc[curr] = 1;
    return acc;
  }, {}),
};

const getByRefId = async (req, res) => {
  try {
    if (!req.params.refId) {
      return sendError(res, 400);
    }

    const item = await InstActivityModel.find(
      { refId: req.params.refId },
      projection,
      { sort: { "updatedAt": -1 } }
    );
    return sendData(res, item);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const getById = async (req, res) => {
  try {
    if (!req.params.refId) {
      return sendError(res, 400);
    }

    const data = await InstActivityModel.findOne({ _id: ObjectId(req.params.id) }, projection);
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
    if (req.files) {
      payload.images = req.files.map(d => `/public/${d.filename}`);
    }

    const newItem = new InstActivityModel({refId: req.params.refId,  ...payload });
    const item = await newItem.save();

    if (item) {
      const msg = `Activity | Event added successfully!!`;
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
    if (!req.params.refId ||
      !req.params.id ||
      req.params.refId !== _.get(res, "locals.payload.institution")
    ) {
      return sendError(res, 400);
    }

    const payload = _.pick(req.body, allowedFields);
    if (req.files) {
      payload.images = req.files.map(d => `/public/${d.filename}`);
    }

    const item = await InstActivityModel.findOneAndUpdate({ _id : ObjectId(req.params.id) }, payload);

    if (item) {
      const msg = `Activity | Event updated successfully!!`;
      logger.info(msg);
      return sendData(res, null, msg);
    }
    return sendError(res, 400);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const remove = async (req, res) => {
  try {
    if (!req.params.refId ||
      !req.params.id ||
      req.params.refId !== _.get(res, "locals.payload.institution")
    ) {
      return sendError(res, 400);
    }

    const item = await InstActivityModel.findOneAndDelete({ _id: ObjectId(req.params.id) });

    if (item) {
      return sendData(res, null, "Activity | Event removed successfully!!");
    }
    return sendError(res, 404);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

module.exports = {
  getByRefId,
  getById,
  add,
  update,
  remove,
};
