const express = require('express')
const router = express.Router();
const { ObjectId } = require('mongodb');
const { Lead, User, Caller, Developer } = require('./model');
const { default: mongoose } = require('mongoose');
const {verifyToken} = require('./middleware')


// ALL UNASSIGN DATA FOR MARKETING ADMIN
router.get('/assignCaller', async(req,res) => {
  try {
    const result = await Caller.find({callerName: ''})
    res.send(result)
  } catch (error) {
    console.log('Error in fetching all caller data for marketing admin', error)
    res.status(500).send("Internal Server Error")
  }
})

// ALL ASSIGN DATA FOR MARKETING ADMIN
router.get('/allCallerData', async(req,res) => {
  try {
    const result = await Caller.find({callerName: {$ne:''}})
    res.send(result)
  } catch (error) {
    console.log('Error in fetching all caller data for marketing admin', error)
    res.status(500).send("Internal Server Error")
  }
})
 


// INDIVIDUAL CALLER DATA GET ROUTE

router.get('/callerLead', verifyToken,  async(req,res) => {
  console.log('token', req.headers)
  const email = req.query.email;
  try {
  const result = await Caller.find({callerEmail
: email  })    
    res.send(result)
  } catch (error) {
    console.log(`Error in caller lead fetching`, error)
    res.status(500).send("Internal Server Error")
  }
}) 
  
// SINGLE DATA GET ROUTE FOR CALLER EDIT PAGE 

router.get('/singleCallerData/:id', async(req, res) => {
  const id = req.params.id
  try {
    const result = await Caller.findById(id);
    console.log('single caller editn data', result)
    res.send(result)
  } catch (error) {
    console.log('Error in fetching single caller data', error)
    res.status(500).send("Internal Server Error")
  }
})


// CALLER ASSIGN PATCH ROUTE
router.patch('/assignCaller', async(req, res) => {
  try {
    const callerId = req.query.callerId;
  const leadId = req.query.leadId
  const userData = await User.findOne({_id:callerId})
  const leadData = await Caller.findOne({_id:leadId})
  console.log('caller id', userData)
  console.log('lead data', leadData)
    const id  = leadData._id
    console.log('id', id)
  const result = await Caller.findByIdAndUpdate(id, {$set:{
    callerName: userData.name,
  callerEmail: userData.email,
  }})
  res.status(200).send("Caller Assigned Successfully")
 
  } catch (error) {
    console.log('Error in lead updating', error)
  res.status(500).send('Internal Server Error')
  }
})


// CALLER EDIT FORM UPDATE ROUTE
router.patch('/callerUpdateData/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const updateFields = {}

    for (const key in body){
      if(body[key] !== undefined && body[key] !== null && body[key] !== ''){
        updateFields[key] = body[key]
      }
    }

  const result = await Caller.findByIdAndUpdate(id,{$set:updateFields}, {new:true})
  res.send(result)
  } catch (error) {
    console.log('Error in caller data update', error)
    res.status(500).send('Internal Server Error')
  }
})

module.exports = router;