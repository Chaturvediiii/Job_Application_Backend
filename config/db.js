const mongoose = require('mongoose');
const colors = require('colors');
require('dotenv').config();

const mongoURI = process.env.MONGO_URL

mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log(`Connected to MongoDB!`.bgMagenta.white);
});

module.exports = db
