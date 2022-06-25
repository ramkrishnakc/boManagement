const mongoose = require("mongoose");

const instDepartmentSchema = mongoose.Schema({
  refId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  course: { type: String },
  about: { type: String, required: true },
  fee: { type: String },
  externalLinks: { type: String },
  html: { type: String },
}, { timestamps : true });

module.exports = mongoose.model("instDepartments", instDepartmentSchema);
