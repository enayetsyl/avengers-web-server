const cors = require('cors');
const jwt = require('jsonwebtoken');
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

const verifyToken = (req, res, next) => {
  if(!req.headers.authorization){
    return res.status(401).send({message: 'Unauthorized access'})
  }
  const token = req.headers.authorization.split(' ')[1];
  console.log('inside verify token ', token)
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if(err){
      return res.status(401).send({message: 'Unauthorized access'})
    }
    req.decoded = decoded;
    next()
  })
}



const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong")
}

module.exports = {
  corsOptions, errorHandler, verifyToken
}