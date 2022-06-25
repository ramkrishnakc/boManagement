const mongoose = require("mongoose");

const institutionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  image: { type: String, required: true },
  about: { type: String },
  contact: { type: String },
  team: { type: Array },
  programs: { type: Array },
  activities: { type: Array },
  notices: { type: Array },
}, { timestamps : true });

module.exports = mongoose.model("institutions", institutionSchema);
