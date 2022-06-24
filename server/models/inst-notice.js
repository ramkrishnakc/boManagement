const mongoose = require("mongoose");

const instNoticeSchema = mongoose.Schema({
  refId: { type: String },
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  images: { type: Array },
  externalLinks: { type: String },
}, { timestamps : true });

module.exports = mongoose.model("instNotices", instNoticeSchema);
