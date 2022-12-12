const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: String,
  password: String,
  poste: String,
  token: String,
  isAdmin : Boolean,
  // client....cle etrangere a mettre pour le populate a partir de client *******
});

const User = mongoose.model('users', userSchema);

module.exports = User;
