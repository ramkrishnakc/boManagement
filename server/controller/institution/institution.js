const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");

const { logger } = require("../../config");
const { sendData, sendError, removeFiles } = require("../helper/lib");
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

const allowedFields = ["name"];

const getById = async (req, res) => {
  try {
    if (!req.params.id) {
      return sendError(res, 400);
    }

    const data = await InstitutionModel.findOne(
      { _id: ObjectId(req.params.id) },
      { _id: 1, name: 1, image: 1 }
    );

    return sendData(res, data);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const getAll = async (req, res) => {
  try {
    const items = await InstitutionModel
      .find({}, { _id: 1, name: 1, image: 1 })
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
      /* Remove image from the folder */
      if (item.image) {
        removeFiles([item.image]);
      }
      return sendData(res, null, "Institution info updated successfully");
    }
    return sendError(res, 404);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

/* Get images to remove while removing items from DB */
const getImages = (input = {}) => {
  let images = [];

  if (!Array.isArray(input) && !_.isEmpty(input)) {
    images = [
      _.get(input, "images", []),
      _.get(input, "image"),
    ];
  }

  // Handle for array of items
  if (Array.isArray(input)) {
    images = input.map(ele => getImages(ele));
  }
  return _.filter(_.flatten(images), d => d);
};

/* Remove matching items from DB and return the items */
const deleteManyAndReturnData = async (MyModel, refId) => {
  const items = await MyModel.find({ refId });

  if (items && items.length) {
    await MyModel.deleteMany({ refId });
  }
  return items || [];
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
        InstAboutModel.findOneAndDelete({ refId: req.params.id }),
        InstContactModel.deleteOne({ refId: req.params.id }),
        deleteManyAndReturnData(InstActivityModel, req.params.id),
        deleteManyAndReturnData(InstDepartmentModel, req.params.id),
        deleteManyAndReturnData(InstNoticeModel, req.params.id),
        deleteManyAndReturnData(InstTeamModel, req.params.id),
      ];
      const [
        u,
        about,
        c,
        activities,
        departments,
        notices,
        teams
      ] = await Promise.all(promises);

      /* Remove all the associated images as well from the folders */
      const allImages = [
        ...getImages(about),
        ...getImages(activities),
        ...getImages(departments),
        ...getImages(notices),
        ...getImages(teams),
      ];
      await removeFiles(allImages);

      const msg = `Institution with id: ${req.params.id} name: ${item.name} removed successfully`;
      logger.info(msg);
      return sendData(res, null, `Institution: ${item.name} removed successfully!!`);
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
