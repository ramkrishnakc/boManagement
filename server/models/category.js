const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  image: { type: String },
  description: { type: String },
}, { timestamps : true });

module.exports = mongoose.model("categories", categorySchema);
