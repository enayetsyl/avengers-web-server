const cors = require('cors');

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']

const corsOptions = {
  origin: function(origin, callback) {
    if(!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else{
      callback(new error ('Not allowed by CORS'))
    }
  }
}

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong")
}

module.exports = {
  corsOptions, errorHandler
}