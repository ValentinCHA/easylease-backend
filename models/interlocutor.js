const mongoose = require("mongoose");

const interlocutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstname: { type: String, required: true },
  poste: { type: String, required: false },
  tel: { type: String, required: false },
  email: { type: String, required: false },
  client: [
    { type: mongoose.Schema.Types.ObjectId, ref: "clients", required: true },
  ],
});

const Interlocutor = mongoose.model("interlocutors", interlocutorSchema);

module.exports = Interlocutor;

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
