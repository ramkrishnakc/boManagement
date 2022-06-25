const jwt = require("jsonwebtoken");
const _ = require("lodash");

const { config } = require("../config");

const getPayload = async req => {
  try {
    const token = req.header("authorization") || req.header("Authorization");
    const actualToken = token.split(/(bearer )/i).pop();
    const payload = await jwt.verify(actualToken, config.tokenKey);

    if (payload) {
      const isAllowed = config.allowedRoles.includes(payload.role);
      const isNotExpired = Date.now() < (payload.createdAt + config.tokenLife);

      if (isAllowed && isNotExpired) {
        return payload;
      };
    }
    return false;
  } catch (err) {
    return false;
  }
};

const Auth = {
  generateToken: payload => {
    const createdAt = Date.now();
    const data = {
      ...payload,
      createdAt,
      expiredAt: createdAt + config.tokenLife
    };
  
    return jwt.sign(data, config.tokenKey);
  },

  authorizeToken: async (req, res, next) => {
    const payload = await getPayload(req);

    if (config.allowedRoles.includes(_.get(payload, "role"))) {
      res.locals.payload = payload;
      return next();
    }
    return res.status(401).json({ error: "Unauthorized access" });
  },

  authorizeRole: async (role, req, res, next) => {
    const payload = await getPayload(req);

    if (_.get(payload, "role") === role) {
      res.locals.payload = payload;
      return next();
    }
    return res.status(401).json({ error: "Unauthorized access" });
  },

  authorizeAdmin: async (req, res, next) => {
    return Auth.authorizeRole("admin", req, res, next);
  },

  authorizeUser: async (req, res, next) => {
    return Auth.authorizeRole("user", req, res, next);
  },

  authorizeInstitution: async (req, res, next) => {
    return Auth.authorizeRole("institution", req, res, next);
  },

  authorizeWriter: async (req, res, next) => {
    return Auth.authorizeRole("writer", req, res, next);
  },
};

module.exports = Auth;
