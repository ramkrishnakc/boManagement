const getMessage = (code, msg) => {
  if (msg) {
    return msg;
  }

  switch (code) {
    case 400:
      return "Bad request";
    case 404:
      return "Not found";
    default:
      return "Server error - Something went wrong";
  }
};

const sendError = (res, code = 500, msg = "") => {
  return res.status(code)
    .json({
      success: false,
      message: getMessage(code, msg),
    });
};

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
  sendError,
  sendData,
  RECEIVED: "received",
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELED: "canceled",
  DAYS,
  MONTHS,
};
