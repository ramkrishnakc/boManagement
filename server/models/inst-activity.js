const mongoose = require("mongoose");

const instActivitySchema = mongoose.Schema({
  refId: { type: String },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  images: { type: Array },
  externalLinks: { type: String },
}, { timestamps : true });

module.exports = mongoose.model("instActivities", instActivitySchema);
