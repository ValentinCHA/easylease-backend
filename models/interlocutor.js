const mongoose = require('mongoose');

const interlocutorSchema = new mongoose.Schema({
  client: {type: String, required: true},
  tel: { type: String, required: false },
  name: { type: String, required: true },
  firstname: { type: String, required: true },
  email: { type: String, required: false },
  poste: { type: String, required: false }
});

const Interlocutor = mongoose.model('interlocutors', interlocutorSchema);

module.exports = Interlocutor;