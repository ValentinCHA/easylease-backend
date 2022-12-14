const mongoose = require('mongoose');

const interlocutorSchema = new mongoose.Schema({
  client: [{ type: mongoose.Schema.Types.ObjectId, ref: "clients", required : true }],
  tel: { type: String, required: false },
  name: { type: String, required: true },
  firstname: { type: String, required: true },
  email: { type: String, required: false },
  poste: { type: String, required: false }
});

const Interlocutor = mongoose.model('interlocutors', interlocutorSchema);

module.exports = Interlocutor;
const mongoose = require("mongoose");

/*const interlocutorSchema = mongoose.Schema({
  nom: String,
  prenom: String,
  poste: String,
  phone: Number,
  mail: String,
  client: [{ type: mongoose.Schema.Types.ObjectId, ref: "clients" }],
});

const Interlocutor = mongoose.model("interlocutors", interlocutorSchema);
*/
module.exports = Interlocutor;
