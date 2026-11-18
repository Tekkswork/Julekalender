require('dotenv').config();
const mongoose = require('mongoose');
const questions = require('./seed');
const Luke = require('./models/luke');

async function seedDatabase() {
  await mongoose.connect('mongodb://localhost:27017/JULEKALENDER');
  await Luke.insertMany(questions);
  console.log('Spørsmålene er lagt inn i databasen');
  await mongoose.disconnect();
}

seedDatabase().catch(error => {
  console.error('Kunne ikke legge inn spørsmålene:', error);
  process.exit(1);
});

// denne henter lista med spørsmål, kobler og sender basically til mongo