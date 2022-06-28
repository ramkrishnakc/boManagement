const mongoose = require("mongoose");

const instNoticeSchema = mongoose.Schema({
  refId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: Array },
  externalLinks: { type: Array },
}, { timestamps : true });

module.exports = mongoose.model("instNotices", instNoticeSchema);
