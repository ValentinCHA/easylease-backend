const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: String,
  password: String,
  poste: String,
  token: String,
  isAdmin : Boolean,
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'clients' }]
});

const User = mongoose.model('users', userSchema);

module.exports = User;
