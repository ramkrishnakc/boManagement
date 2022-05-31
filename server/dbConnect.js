const mongoose = require("mongoose");

const { config, logger } = require("./config");
const { createDefaultUser } = require("./controller/user");

const connectDB = async () => {
  try {
    await mongoose.connect(config.dbUrl, config.dbOptions);
    logger.info("Mongo DB Connection Successfull.");
    await createDefaultUser();
  } catch (error) {
    logger.error("Mongo DB Connection Failed!!");
    logger.error(error.stack);
  }
};

module.exports = connectDB;
