const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Lead, User, Caller, Developer } = require('./model');


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
  console.log('verify token route hit')
  if(!req.headers.authorization){
    return res.status(401).send({message: 'Unauthorized access'})
  }
  const token = req.headers.authorization.split(' ')[1];
  console.log('inside verify token ', token)
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if(err){
      console.log('error token', err)
      return res.status(401).send({message: 'Unauthorized access'})
    }
    console.log('decoded email', decoded)
    console.log('email', decoded.email)
    req.decoded = decoded;
    next()
  })
}

const verifyAdmin = async (req, res, next) => {
  const email = req.query.email
  if(email !== req.decoded.email){
    return res.status(403).send({message: "Unauthorized Access"})
  }

  const findUser = await User.find({email:email})
  console.log('user found ', findUser)
  console.log('finduser role', findUser.role)
  const user = findUser[0]
  console.log('user role', user.role)
  const isAdmin = user?.role === 'marketingAdmin' || user?.role === 'developmentAdmin';
  console.log("is admin", isAdmin)
  
  if(!isAdmin) {
    return res.status(403).send({message: 'Forbidden Access'})
  }
  next()
}


const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong")
}

module.exports = {
  corsOptions, errorHandler, verifyToken, verifyAdmin
}