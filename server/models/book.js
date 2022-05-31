const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  discount: { type: Number },
  price: { type: Number, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  language: { type: String, required: true },
  published: { type: String },
  description: { type: String },
  image: { type: String },
  available: { type: Boolean, default: true },
}, {
  timestamps : true,
});

module.exports = mongoose.model("books", bookSchema);
