const mongoose = require("mongoose");

const instDepartmentSchema = mongoose.Schema({
  refId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  course: { type: String, required: true },
  about: { type: String, required: true },
  image: { type: String },
  externalLinks: { type: Array },
  html: { type: String },
}, { timestamps : true });

module.exports = mongoose.model("instDepartments", instDepartmentSchema);
