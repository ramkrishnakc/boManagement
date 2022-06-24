const mongoose = require("mongoose");

const instDepartmentSchema = mongoose.Schema({
  refId: { type: String },
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  course: { type: String },
  about: { type: String, required: true },
  fee: { type: String },
  externalLinks: { type: String },
}, { timestamps : true });

module.exports = mongoose.model("instDepartments", instDepartmentSchema);
