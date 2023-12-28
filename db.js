const mongoose = require('mongoose');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ktgpsav.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'avengers-web',
});

const connection = mongoose.connection;

connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Reconnecting...');
  setTimeout(() => {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'avengers-web',
    });
  }, 5000);
});

connection.once('open', () => {
  console.log('MongoDB database connection established successfully!');
});

process.on('SIGINT', () => {
  connection.close(() => {
    console.log('MongoDB connection closed due to application termination!');
    process.exit(0);
  });
});

module.exports = mongoose;