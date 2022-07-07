const mongoose = require("mongoose");

const billSchema = mongoose.Schema({
  customerId: { type: String, required: true },
  taxRate: { type: Number, default: 13 },
  cartItems : [
    {
      _id: { type: String, uniq: true, required: true },
      name: { type: String , required:true },
      author: { type: String, required: true },
      price: { type: Number, required: true  },
      discount: { type: Number, default: 0 },
    },
  ],
}, {
  timestamps : true,
});

module.exports = mongoose.model("bills", billSchema);
