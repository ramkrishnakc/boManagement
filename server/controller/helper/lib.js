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

module.exports = {
  sendError,
  sendData,
};
