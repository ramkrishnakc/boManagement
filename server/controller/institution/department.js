const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");

const { logger } = require("../../config");
const { InstDepartmentModel } = require("../../models");
const { sendData, sendError, removeFiles } = require("../helper/lib");

const allowedFields = ["name", "image", "about", "course", "fee", "html", "externalLinks"];

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

    const item = await InstDepartmentModel.find({ refId: req.params.refId }, projection);
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

    const data = await InstDepartmentModel.findOne({ _id: ObjectId(req.params.id) }, projection);
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
    const filename = _.get(req, "file.filename");

    if (filename) {
      payload.image = `/public/${filename}`;
    }

    const newItem = new InstDepartmentModel({refId: req.params.refId,  ...payload });
    const item = await newItem.save();

    if (item) {
      const msg = `Department info added successfully!!`;
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
    const filename = _.get(req, "file.filename");

    if (filename) {
      payload.image = `/public/${filename}`;
    }

    const item = await InstDepartmentModel.findOneAndUpdate({ _id : ObjectId(req.params.id) }, payload);

    if (item) {
      if (payload.image && item.image) {
        removeFiles([item.image]);
      }
      const msg = `Department info updated successfully!!`;
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

    const item = await InstDepartmentModel.findOneAndDelete({ _id: ObjectId(req.params.id) });

    if (item) {
      if (item.image) {
        removeFiles([item.image]);
      }
      return sendData(res, null, "Department info removed successfully");
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
