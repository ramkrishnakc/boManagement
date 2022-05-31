const jwt = require("jsonwebtoken");
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
    const data = {
      ...payload,
      createdAt: Date.now(),
    };
  
    return jwt.sign(data, config.tokenKey);
  },

  authorizeToken: async (req, res, next) => {
    const payload = await getPayload(req);
    if (payload && ["admin", "user"].includes(payload.role)) {
      res.locals.payload = payload;
      return next();
    }
    return res.status(401).json({ error: "Unauthorized access" });
  },

  authorizeAdmin: async (req, res, next) => {
    const payload = await getPayload(req);
    if (payload && payload.role === "admin") {
      res.locals.payload = payload;
      return next();
    }
    return res.status(401).json({ error: "Unauthorized access" });
  },

  authorizeUser: async (req, res, next) => {
    const payload = await getPayload(req);
    if (payload && payload.role === "user") {
      res.locals.payload = payload;
      return next();
    }
    return res.status(401).send({ error: "Unauthorized access" });
  },
};

module.exports = Auth;
