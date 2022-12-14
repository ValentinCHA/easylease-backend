const mongoose = require("mongoose");

const interlocutorSchema = mongoose.Schema({
  nom: String,
  prenom: String,
  poste: String,
  phone: Number,
  mail: String,
  client: [{ type: mongoose.Schema.Types.ObjectId, ref: "clients" }],
});

const Interlocutor = mongoose.model("interlocutors", interlocutorSchema);

module.exports = Interlocutor;
