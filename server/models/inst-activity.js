const mongoose = require("mongoose");

const instActivitySchema = mongoose.Schema({
  refId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: Array },
  externalLinks: { type: String },
  html: { type: String },
}, { timestamps : true });

module.exports = mongoose.model("instActivities", instActivitySchema);
