const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");

const { logger } = require("../../config");
const {
  InstitutionModel,
  InstAboutModel,
  InstContactModel,
  InstActivityModel,
  InstDepartmentModel,
  InstNoticeModel,
  InstTeamModel,
  UserModel,
} = require("../../models");
const { sendData, sendError } = require("../helper/lib");

const allowedFields = ["name", "about"];

const getById = async (req, res) => {
  try {
    if (!req.params.id) {
      return sendError(res, 400);
    }

    const item = await InstitutionModel.findOne({ _id: ObjectId(req.params.id) });
    return sendData(res, item);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const getAll = async (req, res) => {
  try {
    const items = await InstitutionModel
      .find({}, { name: 1, image: 1 })
      .sort({ createdAt: -1 });
    return sendData(res, items);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const add = async (req, res) => {
  try {
    if (!req.body.name) {
      return sendError(res, 400);
    }

    const payload = _.pick(req.body, allowedFields);

    if (req.file && req.file.filename) {
      payload.image = `/public/${req.file.filename}`;
    }

    const newItem = new InstitutionModel(payload);
    const item = await newItem.save();

    if (item) {
      const msg = `Institution ${payload.name} added successfully`;
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
    if (!req.params.id) {
      return sendError(res, 400);
    }

    const payload = _.pick(req.body, allowedFields);

    if (req.file && req.file.filename) {
      payload.image = `/public/${req.file.filename}`;
    }

    const item = await InstitutionModel.findOneAndUpdate({ _id : ObjectId(req.params.id) } , payload);
    if (item) {
      return sendData(res, null, `Institution with id: ${req.params.id} updated successfully`);
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

    const item = await InstitutionModel.findOneAndDelete({ _id: ObjectId(req.params.id) });
    if (item) {
      /* Delete the users and all info about the institution */
      const promises = [
        UserModel.deleteMany({ institution: req.params.id }),
        InstAboutModel.deleteOne({ refId: req.params.id }),
        InstContactModel.deleteOne({ refId: req.params.id }),
        InstActivityModel.deleteMany({ refId: req.params.id }),
        InstDepartmentModel.deleteMany({ refId: req.params.id }),
        InstNoticeModel.deleteMany({ refId: req.params.id }),
        InstTeamModel.deleteMany({ refId: req.params.id }),
      ];
      await Promise.all(promises);

      const msg = `Institution with id: ${req.params.id} name: ${item.name} removed successfully`;
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
