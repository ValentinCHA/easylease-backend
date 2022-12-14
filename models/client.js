const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  name: String,
  address: String,
<<<<<<< HEAD
  EmployedSince: Number,
  ClientBirth: Number,
  chiffre: Number,
  interlocutors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'interlocutors' }],
  scenary: { type: mongoose.Schema.Types.ObjectId, ref: 'scenary' },
  contrat:{ type: mongoose.Schema.Types.ObjectId, ref: 'contrats' },

});

const Client = mongoose.model('clients', clientSchema);
=======
  numberOfEmployees: Number,
  clientBirth: Date,
  chiffre: String,
  interlocutor: { type: mongoose.Schema.Types.ObjectId, ref: "interlocutors" },
  // scenary: { type: mongoose.Schema.Types.ObjectId, ref: 'scenary' },
  //contrat:{ type: mongoose.Schema.Types.ObjectId, ref: 'contrats' },
});

const Client = mongoose.model("clients", clientSchema);
>>>>>>> 578d01fa6ce1559eba1b3a5a4f78c0fdb46fff17

module.exports = Client;
