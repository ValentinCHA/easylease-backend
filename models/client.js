const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  name: String,
  address: String,
  numberOfEmployees: Number,
  clientBirth: Date,
  chiffre: String,
  // links: String, ****a ajouter ****
  interlocutor: [{ type: mongoose.Schema.Types.ObjectId, ref: "interlocutors" }],
  // scenary: { type: mongoose.Schema.Types.ObjectId, ref: 'scenary' },
  //contrat:{ type: mongoose.Schema.Types.ObjectId, ref: 'contrats' },
});

const Client = mongoose.model("clients", clientSchema);

module.exports = Client;
