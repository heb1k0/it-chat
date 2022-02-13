const mongoose = require('mongoose');
require('dotenv').config()

const connectMongo = () => {
  const mongoDb = process.env.MONGODB_URI;
  mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
  const db = mongoose.connection;
  db.on('connected', () => console.log('MongoDb connected'));
  db.on('error', console.error.bind(console, 'mongo connection error'));
};
module.exports = { connectMongo };
