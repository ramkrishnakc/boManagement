const mongoose = require("mongoose");

const instContactSchema = mongoose.Schema({
  refId: { type: String, required: true, index: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  alternateNumbers: [String],
  email: { type: String, required: true },
  website: { type: String },
  externalLinks: { type: String },
  gMap: { type: Object },
}, { timestamps : true });

module.exports = mongoose.model("instContact", instContactSchema);
