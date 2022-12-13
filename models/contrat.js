const mongoose = require('mongoose')

const contratSchema = mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'clients' },
    name: String,
    interlocutor:{ type: mongoose.Schema.Types.ObjectId, ref: 'interlocutor' },
    type: String,
    duration: Number,
    amount : Number,
    creationDate: Date,
    contratStart: Date,
    contratEnd: Date,
    residualValue: Number,
    links: String,
    marge: Number,
});

const Contrat = mongoose.model('contrats', contratSchema);

module.exports = Contrat