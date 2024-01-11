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
console.log(body)

    const { userEmail, timestamp, ...updateFields} = body

    const newChangedItem = {
      userEmail,
      timestamp,
      changedItem: updateFields
    }

  const result = await Caller.findByIdAndUpdate(id,{$set:updateFields,
  $push: {changeHistory: newChangedItem}}, {new:true})
  res.send(result)
  } catch (error) {
    console.log('Error in caller data update', error)
    res.status(500).send('Internal Server Error')
  }
})


// -------STATISTICS DATA ROUTE

router.get('/sameDayLead', async(req, res)=> {
  try {
   
    const yesterday = new Date()
    yesterday.setHours(0,0,0,0)
    yesterday.setDate(yesterday.getDate() - 1)
    const leadCount = await Lead.countDocuments({entryDate: {$gte: yesterday}})
    const callerCount = await Caller.countDocuments({entryDate: {$gte: yesterday}})
    const developerCount = await Developer.countDocuments({entryDate: {$gte: yesterday}})

    const todayLeadCount = leadCount + callerCount + developerCount;
      
    res.status(200).json({todayLeadCount})
  } catch (error) {
    console.log('Error in same day count data', error)
    res.status(500).json({error: "Internal server Error"})
  }
})

// -----LAST WEEK LEAD COUNT

router.get('/lastWeekLead', async(req, res)=> {
  try {
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    const leadCount = await Lead.countDocuments({entryDate: {$gte: lastWeek}})
    const callerCount = await Caller.countDocuments({entryDate: {$gte: lastWeek}})
    const developerCount = await Developer.countDocuments({entryDate: {$gte: lastWeek}})

    const lastWeekLeadCount = leadCount + callerCount + developerCount;
    res.status(200).json({lastWeekLeadCount})
  } catch (error) {
    console.log('Error in same day count data', error)
    res.status(500).json({error: "Internal server Error"})
  }
})
// -----THIS MONTH LEAD COUNT

router.get('/thisMonthLead', async(req, res)=> {
  try {
    const today = new Date()
    const dayOfMonth = today.getDate()
    const thisMonthStartDate = new Date(today.getFullYear(), today.getMonth(), 1)
   
  
    const leadCount = await Lead.countDocuments({entryDate: {$gte: thisMonthStartDate}})
    const callerCount = await Caller.countDocuments({entryDate: {$gte: thisMonthStartDate}})
    const developerCount = await Developer.countDocuments({entryDate: {$gte: thisMonthStartDate}})

    const thisMonthLeadCount = leadCount + callerCount + developerCount;
  
    res.status(200).json({thisMonthLeadCount})
  } catch (error) {
    console.log('Error in same day count data', error)
    res.status(500).json({error: "Internal server Error"})
  }
})
// -----THIS YEAR LEAD COUNT

router.get('/thisYearLead', async(req, res)=> {
  try {
    const today = new Date()
    const thisYearStartDate = new Date(today.getFullYear(), 0, 1)
   
    const leadCount = await Lead.countDocuments({entryDate: {$gte: thisYearStartDate}})
    const callerCount = await Caller.countDocuments({entryDate: {$gte: thisYearStartDate}})
    const developerCount = await Developer.countDocuments({entryDate: {$gte: thisYearStartDate}})

    const thisYearLeadCount = leadCount + callerCount + developerCount;
  
    res.status(200).json({thisYearLeadCount})
  } catch (error) {
    console.log('Error in same day count data', error)
    res.status(500).json({error: "Internal server Error"})
  }
})


// WEEKLY DAY WISE LEAD COUNT
router.get('/last7DaysLeadCount', async(req, res) => {
  try {
    const today = new Date()
    today.setUTCHours(0,0,0,0)
    const counts = []

    for(let i = 0; i < 7; i++){
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() - i)

      const leadCount = await Lead.countDocuments({ entryDate: { $gte: currentDate, $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) } })
      const callerCount = await Caller.countDocuments({ entryDate: { $gte: currentDate, $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) } })
      const developerCount = await Developer.countDocuments({ entryDate: { $gte: currentDate, $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) } })
      
      const dayWiseCount = leadCount + callerCount + developerCount;
      
    counts.unshift({
      date: currentDate.toISOString().split('T')[0], dayWiseCount
    })
  }
  res.status(200).json(counts)

  } catch (error) {
    console.log('Last 7 days lead count', error)
    res.status(500).json({error: "Internal Server Error"})
  }
})


// WEEK WISE LEAD COUNT
router.get('/weekWiseLeadCount', async(req, res) => {
  try {
    const today = new Date()
    today.setUTCHours(0,0,0,0)
    const counts = []

    const startOfYear = new Date(today.getFullYear(), 0,1,0,0,0,0)

    const weeksFromStart = Math.floor(
      ((today - startOfYear) / (7 * 24 * 60 * 60 * 1000))
    )

    for(let i = weeksFromStart; i >= 0; i--){
      const currentWeekStart = new Date(startOfYear);

      currentWeekStart.setDate(currentWeekStart.getDate() + i * 7)

      const leadCount = await Lead.countDocuments({ entryDate: { $gte: currentWeekStart, $lt: new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000) } })
      
      const callerCount = await Caller.countDocuments({ entryDate: { $gte: currentWeekStart, $lt: new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000) } })
      
      const developerCount = await Developer.countDocuments({ entryDate: { $gte: currentWeekStart, $lt: new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000) } })
      
      const weekWiseCount = leadCount + callerCount + developerCount;
      
    counts.unshift({
      weekStart: currentWeekStart.toLocaleDateString('en-US'), weekWiseCount
    })
  }
  console.log('last 7', counts)
  res.status(200).json(counts)

  } catch (error) {
    console.log('Last 7 days lead count', error)
    res.status(500).json({error: "Internal Server Error"})
  }
})


// MONTH WISE LEAD COUNT
router.get('/monthWiseLeadCount', async(req, res) => {
  try {
    // console.log('monthWiseLeadCount')
    const today = new Date()
    today.setUTCHours(0,0,0,0)
    const counts = []

    const startOfYear = new Date(today.getFullYear(), 0,1,0,0,0,0)

    const monthsFromStart =
      (today.getFullYear() - startOfYear.getFullYear()) * 12 + today.getMonth() - startOfYear.getMonth() 
    +1

     for(let i = monthsFromStart - 1; i >= 0; i--){
      const currentMonthStart = new Date(startOfYear.getFullYear(), startOfYear.getMonth() + i, 1,0,0,0,0);

      // currentMonthStart.setMonth(startOfYear.getMonth() + i)
      // console.log('Current month start:', currentMonthStart);

      currentMonthStart.setDate(1)


      const leadCount = await Lead.countDocuments({ entryDate: { $gte: currentMonthStart, $lt: new Date(currentMonthStart.getFullYear(),
        currentMonthStart.getMonth() + 1,0,23,59,59,999)
        } })
      
      const callerCount = await Caller.countDocuments({ entryDate: { $gte: currentMonthStart, $lt: new Date(currentMonthStart.getFullYear(),
        currentMonthStart.getMonth() + 1,0,23,59,59,999)
        } })
      
      const developerCount = await Developer.countDocuments({ entryDate: { $gte: currentMonthStart, $lt: new Date(currentMonthStart.getFullYear(),
        currentMonthStart.getMonth() + 1, 0, 23, 59, 59, 999)
        } })
      
      const monthWiseCount = leadCount + callerCount + developerCount;
      
    counts.unshift({
      monthStart: currentMonthStart.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }), monthWiseCount
    })
  }
  // console.log('month wise', counts)
  res.status(200).json(counts)

  } catch (error) {
    console.log('Last 7 days lead count', error)
    res.status(500).json({error: "Internal Server Error"})
  }
})


module.exports = router;