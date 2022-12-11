const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: String,
  password: String,
  poste: String,
  token: String,
  isAdmin : Boolean,
});

const User = mongoose.model('users', userSchema);

module.exports = User;
