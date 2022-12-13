const mongoose = require('mongoose');

const scenarySchema = mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'clients' },
  name: String,
  type: String,
  duration: Number,
  amount : Number,
  creationDate: Date,
  contratStart: Date,
  contratEnd: Date,
  residualValue: Number,
});

const Scenary = mongoose.model('scenary', scenarySchema);

module.exports = Scenary;
