const ObjectId = require("mongoose").Types.ObjectId;
const _ = require("lodash");

const { config, logger, hash } = require("../../config");
const { BookModel, UserModel } = require("../../models");
const Auth = require("../../middleware/auth");
const Mail = require("../../middleware/mail");
const { sendData, sendError } = require("../helper/lib");

const saveUser = async payload => {
  const data = {
    username: payload.username,
    password: hash.encrypt(payload.password),
    role: payload.role,
    email: payload.email,
    verified: payload.verified,
  };

  if (payload.verificationCode) {
    data.verificationCode = payload.verificationCode;
  }

  if (payload.institution) {
    data.institution = payload.institution;
  }

  const newuser = new UserModel(data);
  return await newuser.save();
};

/* Create default "root_user" */
const createDefaultUser = async () => {
  try {
    const user = await UserModel.findOne({
      username: "root_user",
      verified: true,
    });

    if (user) {
      logger.info("Default admin user already exist!!");
    } else {
      await saveUser({
        username: "root_user",
        password: "changeme",
        role: "admin",
        email: "dummy@user.com",
        verified: true,
      });
      logger.info("Default user is registered successfully!!");
    }
  } catch (err) {
    logger.error(err.stack);
  }

  return true;
};

/* Handle login */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username, verified: true });

    if (user && hash.decrypt(user.password) === password) {
      const token = Auth.generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
        username: user.username,
        name: user.name,
        address: user.address,
        contactNum: user.contactNum,
        institution: user.institution,
        purchasedBooks: user.purchasedBooks,
      });
      return sendData(res, token);
    }
    return sendError(res, 400, "Login Failed!!");
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

/* Sign up request by normal users */
const signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return sendError(res, 400);
    }

    const verificationCode = `vs_${Math.random() * 1000000}`;

    const item = await saveUser({
      username,
      password,
      email,
      role: "user",
      verified: false,
      verificationCode,
    });

    if (item) {
      /* Now send mail for the verification */
      const bool = await Mail.sendVerifyEmail({
        username,
        email,
        id: verificationCode,
        protocol: req.protocol,
        host: req.headers.host,
      });

      if (bool) {
        return sendData(res, null, "User signup successful.");
      }
      /* Delete the data from DB, if mail is not sent */
      await UserModel.findOneAndDelete({ _id: ObjectId(item._id) });
      return sendError(res, 400, "Couldn't send verification email - something wrong.");
    }
    return sendError(res, 400);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const getById = async (req, res) => {
  try {
    if (!req.params.id) {
      return sendError(res, 400);
    }

    const item = await UserModel.findOne(
      { _id: ObjectId(req.params.id) },
      {
        password: 0,
        _id: 0,
        __v: 0,
        role: 0,
        username: 0,
        institution: 0,
        purchasedBooks: 0,
        publishedBooks: 0,
        createdAt: 0,
        updatedAt: 0,
      });
    return sendData(res, item);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const getAll = async (req, res) => {
  try {
    const items = await UserModel.find({}, {
      password: 0,
      institution: 0,
      purchasedBooks: 0,
      publishedBooks: 0,
    }).sort({ createdAt: -1 });

    return sendData(res, items);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const getInstUsers = async (req, res) => {
  try {
    if (
      !req.params.refId ||
      req.params.refId !== _.get(res, "locals.payload.institution")
    ) {
      return sendError(res, 400);
    }

    const items = await UserModel.find({ institution: req.params.refId }, {
      role: 0,
      password: 0,
      institution: 0,
      purchasedBooks: 0,
      publishedBooks: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    }).sort({ createdAt: -1 });

    return sendData(res, items);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

/* Add User by admin */
const add = async (req, res) => {
  try {
    const { username, password, email, role, institution } = req.body;

    if (
      !username ||
      !password ||
      !email ||
      !config.allowedRoles.includes(role) ||
      (role === "institution" && !institution)
    ) {
      return sendError(res, 400);
    }

    const item = await saveUser({username, password, email, role, institution, verified: true });

    if (item) {
      /* Now send mail to provide the user details to concerned person */
      const bool = await Mail.sendUserCreatedEmail({
        email,
        host: req.headers.host,
        password,
        protocol: req.protocol,
        role,
        username,
      });

      if (bool) {
        return sendData(res, null, "User Added successfully.");
      }
      /* Delete the data from DB, if mail is not sent */
      await UserModel.findOneAndDelete({ _id: ObjectId(item._id) });
      return sendError(res, 400, "Couldn't send user info to the provided e-mail. Something went wrong.");
    }
    return sendError(res, 400);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const addInstUser = async (req, res) => {
  if (
    !req.params.refId ||
    req.params.refId !== _.get(res, "locals.payload.institution")
  ) {
    return sendError(res, 400);
  }

  req.body.institution = req.params.refId;
  req.body.role = "institution";

  return add(req, res);
};

/* Verify e-mail by actual user */
const verifyEmail = async (req, res) => {
  try {
    if (!req.query.vid) {
      return sendError(res, 400);
    }

    const item = await UserModel.findOneAndUpdate(
      { verificationCode: req.query.vid, verified: false },
      { verified: true, verificationCode: "" }
    );

    if (item) {
      return res.end(`User has been Successfully verified. Enjoy using ${config.appName}!!`);
    }
    return res.end("Couldn't verify the user. Bad request!!");
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

/* Update User by it-self */
const update = async (req, res) => {
  try {
    const allowedFields = [
      "email",
      "name",
      "address",
      "contactNum",
    ];

    if (!req.params.id) {
      return sendError(res, 400);
    }

    const user = await UserModel.findOne({ _id: ObjectId(req.params.id), verified: true });

    /* Verify that only the exact user can change its own password */
    if (user && user.email === _.get(res, "locals.payload.email")) {
      const payload = allowedFields.reduce((acc, key) => {
        const val = req.body[key];
        if (val) {
          acc[key] = val;
        }
        return acc;
      }, {});

      const item = await UserModel.findOneAndUpdate({ _id: ObjectId(req.params.id) }, payload);

      if (item) {
        return sendData(res, null, "User Info updated successfully");
      }
    }
    return sendError(res, 404);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const pwdUpdate = async (req, res) => {
  try {
    if (!req.params.id || !req.body.password || !req.body.oldPassword) {
      return sendError(res, 400);
    }
    const user = await UserModel.findOne({ _id: ObjectId(req.params.id), verified: true });

    /* Verify that only the exact user can change its own password */
    if (
      user &&
      hash.decrypt(user.password) === req.body.oldPassword &&
      user.email === _.get(res, "locals.payload.email")
    ) {
      const item = await UserModel.findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        { password: hash.encrypt(req.body.password) }
      );

      if (item) {
        return sendData(res, null, "User Password updated successfully. Please login again.");
      }
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

    const item = await UserModel.findOneAndDelete({ _id: ObjectId(req.params.id) });

    if (item) {
      return sendData(res, null, "User removed successfully");
    }
    return sendError(res, 404);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const removeInstUser = async (req, res) => {
  if (
    !req.params.refId ||
    req.params.refId !== _.get(res, "locals.payload.institution")
  ) {
    return sendError(res, 400);
  }

  return remove(req, res);
};

const getMyPurchase = async (req, res) => {
  if (!req.params.userId ||
    req.params.userId !== _.get(res, "locals.payload.id")
  ) {
    return sendError(res, 400);
  }

  const user = await UserModel.findOne({ _id: ObjectId(req.params.userId) });
  const bookIds = _.get(user, "purchasedBooks", []);

  if (bookIds.length) {
    const books = await BookModel.find(
      {
        _id: { $in: bookIds.map(id => ObjectId(id)) }
      },
      {
        _id: 1, name: 1, author: 1, category: 1, image: 1, description: 1, language: 1
      }
    );

    return sendData(res, books);
  }
  return sendError(res, 400);
};

module.exports = {
  createDefaultUser,
  login,
  signup,
  getById,
  getAll,
  getInstUsers,
  add,
  addInstUser,
  verifyEmail,
  update,
  pwdUpdate,
  remove,
  removeInstUser,
  getMyPurchase,
};
