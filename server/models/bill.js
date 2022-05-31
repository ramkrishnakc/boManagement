const mongoose = require("mongoose");

const billSchema = mongoose.Schema({
  customerId: { type: String },
  customerName: { type: String, required: () => !this.customerId },
  customerNumber: { type: String, required: () => !this.customerId },
  customerAddress: { type: String, required: () => !this.customerId },
  customerEmail: {
    type: String,
    required: () => !this.customerId,
    validate: [
      email => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email),
      'Please fill a valid email address'
    ],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ]
  },
  taxRate: { type: Number, default: 13 },
  paymentMode : { type: String, default: "online" },
  cartItems : [
    {
      name: { type: String , required:true },
      author: { type: String, required: true },
      itemId: { type: String, required: true },
      price: { type: Number, required: true  },
      quantity: { type: Number, default: 1 },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
  ],
  status: {
    type: String,
    default: "received",
    enum: ["received", "pending", "completed", "canceled"],
  },
}, {
  timestamps : true,
});

module.exports = mongoose.model("bills", billSchema);
