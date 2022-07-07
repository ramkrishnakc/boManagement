const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");

const { logger } = require("../../config");
const { InstNoticeModel } = require("../../models");
const { sendData, sendError, removeFiles } = require("../helper/lib");

const allowedFields = ["title", "description", "images", "externalLinks"];

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

    const item = await InstNoticeModel.find(
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

    const data = await InstNoticeModel.findOne({ _id: ObjectId(req.params.id) }, projection);
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

    const newItem = new InstNoticeModel({refId: req.params.refId,  ...payload });
    const item = await newItem.save();

    if (item) {
      const msg = `Notice | Information added successfully!!`;
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

    const item = await InstNoticeModel.findOneAndUpdate({ _id : ObjectId(req.params.id) }, payload);

    if (item) {
      if (Array.isArray(item.images) && item.images.length) {
        removeFiles(item.images);
      }
      const msg = `Notice | Information updated successfully!!`;
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

    const item = await InstNoticeModel.findOneAndDelete({ _id: ObjectId(req.params.id) });

    if (item) {
      if (Array.isArray(item.images) && item.images.length) {
        removeFiles(item.images);
      }
      return sendData(res, null, "Notice | Information removed successfully!!");
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
