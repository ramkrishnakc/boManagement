const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 20,
    index: true,
  },
  password: { type: String, required: true },
  role: { type: String, default: "user", enum: ["admin", "user"] },
  verified: { type: Boolean, default: false },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [
      email => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email),
      'Please fill a valid email address'
    ],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ],
  },
  name: { type: String },
  address: { type: String },
  contactNum: { type: String, unique: true },
}, { timestamps : true });

module.exports = mongoose.model("users", userSchema);
