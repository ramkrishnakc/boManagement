const fs = require("fs");
const path = require("path");
const { logger } = require("../../config");

/* Remove list of files from "Public" directory */
const removeFiles = files => {
  files.forEach(filePath => {
    const pathToFile = path.resolve(__dirname, `../../..${filePath}`);

    fs.unlink(pathToFile, function(err) {
      if (err) {
        logger.error(`Error while deleting file: ${pathToFile}: ${err.stack}`);
      } else {
        logger.info(`Successfully deleted file: ${pathToFile}.`);
      }
    });    
  });
};

/* Get date before certain hours + minutes */
const dateBefore = (hrs, min = 0) => {
  const ts = Math.round(new Date().getTime() / 1000);
  const tsBefore = ts - (hrs * 3600) - (min * 60);

  return new Date(tsBefore * 1000);
};

const getMessage = (code, msg) => {
  if (msg) {
    return msg;
  }

  switch (code) {
    case 400:
      return "Bad request";
    case 401:
      return "Unauthorized request";
    case 404:
      return "Not found";
    default:
      return "Server error - Something went wrong";
  }
};

/* Respond with proper error code & message */
const sendError = (res, code = 500, msg = "") => {
  return res.status(code)
    .json({
      success: false,
      message: getMessage(code, msg),
    });
};

/* Respond success with data and message */
const sendData = (res, data, message) => {
  const payload = { success: true };

  if (data) {
    payload.data = data;
  }
  if (message) {
    payload.message = message;
  }

  return res.send(payload);
};

const DAYS = { 1: "Sun", 2: "Mon", 3: "Tue", 4: "Wed", 5: "Thu", 6: "Fri", 7: "Sat" };
const MONTHS = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

module.exports = {
  removeFiles,
  dateBefore,
  sendError,
  sendData,
  RECEIVED: "received",
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELED: "canceled",
  DAYS,
  MONTHS,
};
