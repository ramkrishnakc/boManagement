const mongoose = require("mongoose");

const { config, logger } = require("./config");
const { createDefaultUser } = require("./controller/user");

const connectDB = async () => {
  try {
    const con = await mongoose.connect(config.dbUrl, config.dbOptions);
    logger.info("Mongo DB Connection Successfull.");
    await createDefaultUser();
    
    /* Set 'bucket' as global variable - used to upload book resources to DB */
    global.bucket = new mongoose.mongo.GridFSBucket(
      con.connections[0].db,
      {
        bucketName: "bookResources"
      }
    );
  } catch (error) {
    logger.error("Mongo DB Connection Failed!!");
    logger.error(error.stack);
  }
};

module.exports = connectDB;
