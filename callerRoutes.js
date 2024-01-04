const express = require('express')
const router = express.Router();
const { ObjectId } = require('mongodb');
const { Lead, User, Caller } = require('./model');
const { default: mongoose } = require('mongoose');


// ALL CALLER DATA FOR MARKETING ADMIN
router.get('/allCaller', async(req,res) => {
  console.log('all caller route hit')
  try {
    const result = await Caller.find()
    console.log('all caller data', result)
    res.send(result)
  } catch (error) {
    console.log('Error in fetching all caller data for marketing admin', error)
    res.status(500).send("Internal Server Error")
  }
})


// INDIVIDUAL CALLER DATA GET ROUTE

router.get('/callerLead', async(req,res) => {
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
  const leadData = await Lead.findOne({_id:leadId})
  const newData = {
    ...leadData._doc, callerName:userData.name, callerEmail: userData.email
  }
  const caller = new Caller(newData)
  const result = await caller.save()
  if(result._id){
    const deletedItem = await Lead.findByIdAndDelete({_id: leadId})
    if(deletedItem._id){
      res.status(200).send('Caller Assigned Successfully')
    }else{
      res.status(500).send('An Error Occurred')
    }
  }else{
    res.status(500).send('An Error Occurred')
  }
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
  const result = await Caller.findByIdAndUpdate(id,{$set:body})
  res.send(result)
  } catch (error) {
    console.log('Error in caller data update', error)
    res.status(500).send('Internal Server Error')
  }
})

module.exports = router;