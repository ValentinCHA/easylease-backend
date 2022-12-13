const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
  
  name: String,
<<<<<<< HEAD
  adress: String,
  EmployedSince: Number,
  ClientBirth: Number,
  chiffre: Number,
  interlocutor: { type: mongoose.Schema.Types.ObjectId, ref: 'interlocutors' },
  scenary: { type: mongoose.Schema.Types.ObjectId, ref: 'scenary' },
  contrat:{ type: mongoose.Schema.Types.ObjectId, ref: 'contrats' },

});

const Client = mongoose.model('client', clientSchema);
=======
  address: String,
  numberOfEmployees: Number,
  clientBirth: Date,
  chiffre: String,
  // interlocutor: { type: mongoose.Schema.Types.ObjectId, ref: 'interlocutors' },
  // scenary: { type: mongoose.Schema.Types.ObjectId, ref: 'scenary' },
  // contrat:{ type: mongoose.Schema.Types.ObjectId, ref: 'contrats' },

});

const Client = mongoose.model('clients', clientSchema);
>>>>>>> cd3e22b93a2f907ef74e046809181af631a65a78

module.exports = Client;
