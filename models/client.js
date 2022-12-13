const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
  
  name: String,
  adress: String,
  NumberOfEmployees: Number,
  ClientBirth: Date,
  chiffre: String,
  email: String,
  tel: Number,
  // interlocutor: { type: mongoose.Schema.Types.ObjectId, ref: 'interlocutors' },
  // scenary: { type: mongoose.Schema.Types.ObjectId, ref: 'scenary' },
  // contrat:{ type: mongoose.Schema.Types.ObjectId, ref: 'contrats' },

});

const Client = mongoose.model('clients', clientSchema);

module.exports = Client;
