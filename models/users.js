const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: String,
  password: String,
  poste: String,
  token: String,
  isAdmin: Boolean,
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'clients' }],
  contrats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'contrats' }]
});

const User = mongoose.model("users", userSchema);

module.exports = User;