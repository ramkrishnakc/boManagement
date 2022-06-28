const mongoose = require("mongoose");

const instAboutSchema = mongoose.Schema({
  refId: { type: String, required: true, index: true },
  text: { type: String },
  images: [String],
  html: { type: String },
}, { timestamps : true });

module.exports = mongoose.model("instAbout", instAboutSchema);
