// k, så nå skal jeg prøve å lagre svarene i mongoMonica, ikke i terminalen

const mongoose = require('mongoose');

const svarSchema = new mongoose.Schema({
  dag: { type: Number, required: true },
  svar: { type: String, required: true },
  riktig: { type: Boolean, default: null },
  opprettet: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Svar', svarSchema);