const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    trim: true,
  },
  product: {
    type: Object,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  usersessionid: {
    type: String,
    required: true,
    trim: true,
  },
}, { collection: "PaymentsLog", timestamps: true });

const User = mongoose.model("PaymentsLog", userSchema);

module.exports = User;
