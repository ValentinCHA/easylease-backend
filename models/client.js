const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
  
  name: String,
  adress: String,
  EmployedSince: Number,
  ClientBirth: Number,
  chiffre: Number,
  interlocutor: { type: mongoose.Schema.Types.ObjectId, ref: 'interlocutors' },
  scenary: { type: mongoose.Schema.Types.ObjectId, ref: 'scenary' },
  contrat:{ type: mongoose.Schema.Types.ObjectId, ref: 'contrats' },

});

const Client = mongoose.model('client', clientSchema);

module.exports = Client;
