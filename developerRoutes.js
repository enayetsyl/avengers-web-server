const express = require("express");
const router = express.Router();
const { Developer, User, Caller } = require("./model");


// FOR DEVELOPER ADMIN ALL DEVELOPER GET ROUTE
router.get('/allDevLead', async(req, res) => {
  console.log('all dev route hit')
  try {
    const result = await Developer.find()
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

  const developerAssignedOn = new Date();
  console.log('assignDate', developerAssignedOn)

  const userData = await User.findOne({_id:developerId})
  
  const result = await Developer.findByIdAndUpdate(leadId, 
    {$set:{
      developerAssignedOn,
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
const { userEmail, timestamp, ...updateField} = body;

const newChangedItem = {
  userEmail,
  timestamp,
  changedItem: updateField,
}
console.log('body', body)
try {
  const result = await Developer.findByIdAndUpdate(id, {
    $set:updateField,
    $push: {changeHistory: newChangedItem}
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
  const developerPostDate = new Date()
  try {
    const postFind = await Developer.findById(id)
    if(postFind){
      const data = {...postFind._doc,
        developerPostDate,
        callerName: '',
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










// -------STATISTICS DATA ROUTE-------------

//  ------ SAME DAY DEV COUNT
router.get('/sameDayDev', async(req, res)=> {
  try {
   
    const yesterday = new Date()
    yesterday.setHours(0,0,0,0)
    yesterday.setDate(yesterday.getDate() - 1)
    

    const todayDeveloperCount = await Caller.countDocuments({developerPostDate: {$gte: yesterday}})

    res.status(200).json({todayDeveloperCount})
  } catch (error) {
    console.log('Error in same day count data', error)
    res.status(500).json({error: "Internal server Error"})
  }
})

// -----LAST WEEK DEV COUNT

router.get('/lastWeekDev', async(req, res)=> {
  try {
    const lastWeek = new Date()

    lastWeek.setDate(lastWeek.getDate() - 7)
    
    const lastWeekDevCount = await Caller.countDocuments({developerPostDate: {$gte: lastWeek}})
    
    res.status(200).json({lastWeekDevCount})
  } catch (error) {
    console.log('Error in same day count data', error)
    res.status(500).json({error: "Internal server Error"})
  }
})
// -----THIS MONTH DEV COUNT

router.get('/thisMonthDev', async(req, res)=> {
  try {
    const today = new Date()
    // const dayOfMonth = today.getDate()
    const thisMonthStartDate = new Date(today.getFullYear(), today.getMonth(), 1)
   
  
    const thisMonthDevCount = await Caller.countDocuments({developerPostDate: {$gte: thisMonthStartDate}})

    res.status(200).json({thisMonthDevCount})
  } catch (error) {
    console.log('Error in same day count data', error)
    res.status(500).json({error: "Internal server Error"})
  }
})
// -----THIS YEAR DEV COUNT

router.get('/thisYearDev', async(req, res)=> {
  try {
    const today = new Date()
    const thisYearStartDate = new Date(today.getFullYear(), 0, 1)
   
  
    const thisYearDevCount = await Caller.countDocuments({developerPostDate: {$gte: thisYearStartDate}})
    
    res.status(200).json({thisYearDevCount})
  } catch (error) {
    console.log('Error in same day count data', error)
    res.status(500).json({error: "Internal server Error"})
  }
})


// WEEKLY DAY WISE DEV COUNT
router.get('/last7DaysDevCount', async(req, res) => {
  try {
    const today = new Date()
    today.setUTCHours(0,0,0,0)
    const counts = []

    for(let i = 0; i < 7; i++){
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() - i)

          
      const dayWiseCount = await Caller.countDocuments({ developerPostDate: { $gte: currentDate, $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) } })
     
            
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


// WEEK WISE DEV COUNT
router.get('/weekWiseDevCount', async(req, res) => {
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

     
      
      const weekWiseCount = await Caller.countDocuments({ developerPostDate: { $gte: currentWeekStart, $lt: new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000) } })
      
           
    counts.unshift({
      weekStart: currentWeekStart.toLocaleDateString('en-US'), weekWiseCount
    })
  }
  res.status(200).json(counts)

  } catch (error) {
    console.log('Last 7 days lead count', error)
    res.status(500).json({error: "Internal Server Error"})
  }
})


// MONTH WISE DEV COUNT
router.get('/monthWiseDevCount', async(req, res) => {
  try {
    // console.log('monthWiseDevCount')
    const today = new Date()
    today.setUTCHours(0,0,0,0)
    const counts = []

    const startOfYear = new Date(today.getFullYear(), 0,1,0,0,0,0)
 
    const monthsFromStart =
      (today.getFullYear() - startOfYear.getFullYear()) * 12 + today.getMonth() - startOfYear.getMonth() 
    +1

     for(let i = monthsFromStart - 1; i >= 0; i--){
      const currentMonthStart = new Date(startOfYear.getFullYear(), startOfYear.getMonth() + i, 1,0,0,0,0);

     
      const monthWiseCount = await Caller.countDocuments({ developerPostDate: { $gte: currentMonthStart, $lt: new Date(currentMonthStart.getFullYear(),
        currentMonthStart.getMonth() + 1,0,23,59,59,999)
        } })
      
            
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
