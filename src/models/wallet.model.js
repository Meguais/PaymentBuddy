const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  usersessionid: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
}, { collection: "Wallets", timestamps: true });

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;
