const ObjectId = require("mongoose").Types.ObjectId;

const { config, logger, hash } = require("../../config");
const { UserModel } = require("../../models");
const Auth = require("../../middleware/auth");
const { sendData, sendError } = require("../helper/lib");

const saveUser = async payload => {
  const newuser = new UserModel({
    username: payload.username,
    password: hash.encrypt(payload.password),
    role: payload.role,
    email: payload.email,
    verified: payload.verified,
  });

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
        id: user.id,
        email:user.email,
        role: user.role,
        username: user.username,
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
    const { username, password, email} = req.body;
    
    if (!username || !password || !email) {
      return sendError(res, 400);
    }

    const item = await saveUser({ username, password, email, role: "user", verified: false});
    if (item) {
      return res.send({ success: true, message: "User signup successful" });
    }
    return sendError(res, 400);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendError(res, 400);
    }

    const item = await UserModel.findOne(
      { _id: ObjectId(id) },
      {
        password: 0,
        _id: 0,
        __v: 0,
        role: 0,
        username: 0,
      });
    return sendData(res, item);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

const getAll = async (req, res) => {
  try {
    const items = await UserModel.find({}, {password: 0});
    return sendData(res, items);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

/* Add User by admin */
const add = async (req, res) => {
  try {
    const { username, password, email, role} = req.body;

    if (!username || !password || !email || !config.allowedRoles.includes(role)) {
      return sendError(res, 400);
    }

    const item = await saveUser({ username, password, email, role, verified: true});

    if (item) {
      return sendData(res, null, "User Added successfully");
    }
    return sendError(res, 400);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

/* Verify User by admin */
const verify = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendError(res, 400);
    }
    const payload = { verified: true };

    const item = await UserModel.findOneAndUpdate({ _id : ObjectId(id) }, payload);
    
    if (item) {
      return sendData(res, null, "User verified successfully");
    }
    return sendError(res, 404);
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
    const email = res.locals && res.locals.payload.email;

    /* Verify that only the exact user can change its own password */
    if (user && user.email === email) {
      const payload = allowedFields.reduce((acc, key) => {
        const val = req.body[key];
        if (val) {
          acc[key] = val;
        }
        return acc;
      }, {});
      
      const item = await UserModel.findOneAndUpdate({ _id : ObjectId(req.params.id) }, payload);
      
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
    const email = res.locals && res.locals.payload.email;

    /* Verify that only the exact user can change its own password */
    if (user && hash.decrypt(user.password) === req.body.oldPassword && user.email === email) {
      const item = await UserModel.findOneAndUpdate(
        { _id : ObjectId(req.params.id) },
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
    const { id } = req.params;
    if (!id) {
      return sendError(res, 400);
    }

    const item = await UserModel.findOneAndDelete({
      _id: ObjectId(id), role: { $in: [ "admin", "user" ] }
    });

    if (item) {
      return sendData(res, null, "User removed successfully");
    }
    return sendError(res, 404);
  } catch (err) {
    logger.error(err.stack);
    return sendError(res);
  }
};

module.exports = {
  createDefaultUser,
  login,
  signup,
  getById,
  getAll,
  add,
  verify,
  update,
  pwdUpdate,
  remove,
};
