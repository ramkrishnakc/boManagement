const mongoose = require("mongoose");

const institutionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  image: { type: String, required: true },
}, { timestamps : true });

module.exports = mongoose.model("institutions", institutionSchema);
