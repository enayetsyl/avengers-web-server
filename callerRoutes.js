const express = require('express')
const router = express.Router();
const { Lead } = require('./model')


router.get('/allCaller', async(req, res) => {
  console.log('caller route hit')
})

module.exports = router;