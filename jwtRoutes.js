require('dotenv').config();
const jwt = require('jsonwebtoken')
const express = require("express");
const router = express.Router();

router.post('/jwt', async(req, res) => {
  console.log('jwt route hit')
  const user = req.body;
  const token = jwt.sign(user, process.env.TOKEN_SECRET, {expiresIn:'1h'})
  res.send({token})
})

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


module.exports = router;