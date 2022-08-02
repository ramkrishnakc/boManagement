const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  discount: { type: Number, default: 0 },
  price: { type: Number, required: () => !this.isFree, default: 0 },
  author: { type: String, required: true },
  category: { type: String, required: true },
  language: { type: String, required: true },
  published: { type: String },
  description: { type: String },
  image: { type: String },
  available: { type: Boolean, default: true },
  pdf: { type: String },
  isFree: { type: Boolean, required: () => !this.price, default: false },
}, {
  timestamps : true,
});

module.exports = mongoose.model("books", bookSchema);
