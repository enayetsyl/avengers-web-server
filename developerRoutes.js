const express = require("express");
const router = express.Router();
const { Developer, User, Caller } = require("./model");


// FOR DEVELOPER ADMIN ALL DEVELOPER GET ROUTE
router.get('/allDevLead', async(req, res) => {
  console.log('all dev route hit')
  try {
    const result = await Developer.find()
    console.log(result)
    res.send(result)
  } catch (error) {
    console.log('Error in fetching all developer lead', error)
    res.status(500).send("Internal Server Error")
  }
})

// DEVELOPER ASSIGN PATCH ROUTE
router.patch('/assignDeveloper', async(req, res) => {
  try {
    const developerId = req.query.callerId;
  const leadId = req.query.leadId
  console.log('dev id', developerId)
  console.log('lead id', leadId)

  const userData = await User.findOne({_id:developerId})
  
  const result = await Developer.findByIdAndUpdate(leadId, 
    {$set:{
      developerName:userData.name, developerEmail: userData.email,
    }}
    )
    res.status(200).send("Developer Assigned Successfully")

  } catch (error) {
    console.log('Error in lead updating', error)
  res.status(500).send('Internal Server Error')
  }
})

// SINGE DEVELOPER LEAD ROUTE
router.get('/developerLead', async(req, res) => {
  const email = req.query.email;
  try {
    const result = await Developer.find({
      developerEmail
      : email})
      res.send(result)
  } catch (error) {
    console.log('Error in fetching developer lead', error)
    res.status(500).send("Internal server Error")
  }
})

// DEVELOPER EDIT DATA GET ROUTE
router.get('/singleDeveloperData/:id', async (req, res) => {
  const id = req.params.id
  console.log(id)
  try {
    const result = await Developer.findById(id)
    console.log(result)
    res.send(result)
  } catch (error) {
    console.log('Error in getting single developer data for edit', error)
    res.status(500).send('Internal Server Error')
  }
})

// EDITED DATA BY DEVELOPER UPDATE ROUTE
router.patch('/developerUpdateData/:id', async(req, res) => {
const id = req.params.id
const body = req.body;
try {
  console.log(id, body)
  const result = await Developer.findByIdAndUpdate(id, {
    $set:body
  })
  console.log(result)
  res.send(result)
} catch (error) {
  console.log('Error in developer data update', error)
  res.status(500).send('Internal Server Error')
}
})

// DEVELOPER DATA POST ROUTE
router.post('/developerPost/:id', async(req, res) => {
  const id = req.params.id;
  try {
    const postFind = await Developer.findById(id)
    if(postFind){
      const data = {...postFind._doc,  callerName: '',
        callerEmail: '',}
      const saveToCaller = new Caller(data)
      const result = await saveToCaller.save()
      if(result){
        const result = await Developer.findByIdAndDelete(id)
        res.send(result)
      }
    }
  } catch (error) {
    console.log('Error in posting developer data', error)
    res.status(500).send('Internal Server Error')
  }
})


module.exports = router;
