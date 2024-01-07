const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();
const { User } = require('./model');
const { route } = require('./leadRoutes');
const {verifyToken, verifyAdmin} = require('./middleware')
require('dotenv').config();
const saltRounds = 10


// DEVELOPER GET ROUTE
router.get('/developer',verifyToken, verifyAdmin, async(req, res) => {
  try {
    const result = await User.find({role:{$in:['Developer', 'NewUser']}}).sort({role:1}) 
    res.send(result)
  } catch (error) {
    console.log('Error in getting developer user', error)
    res.status(500).send('Internal Server Error')
  }
})

// LEAD COLLECTOR AND CALLER GET ROUTE
router.get('/allUsers', verifyToken, verifyAdmin,  async(req, res) => {
  console.log('user route hit')
  
  try{
    const result = await User.find({role:{$nin:['marketingAdmin', 'developmentAdmin', 'Developer']}}, {password: 0, __v:0}).sort({role:-1})
    res.send(result)
  }catch(error){
    console.log('Error fetching data', error.message)
    res.status(500).send("Internal server error")
  }
})
 
// SINGLE USER GET ROUTE

router.get('/userLogin', async (req, res) => {
  try {
    const email = req.query.email;
    const userPassword = req.query.password
    const userExist = await User.findOne({email:email})

    if(userExist){
    const dbPassword = userExist.password
    const passwordMatch = await bcrypt.compare(userPassword, dbPassword)  

    if(passwordMatch){
      console.log('Password Matched')
      const userInfo = {
        name: userExist.name,
        email: userExist.email,
        role: userExist.role,
      }

      res.status(200).json({message: 'Login Successful', userInfo})
    }else {

      console.log('Incorrect Password')
      res.status(200).send('Incorrect Password')
    } 
    }else{

      res.status(202).send('Could not find the email. Please provide correct email or register')
    }
  } catch (error) {
    console.error('Error fetching leads:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// FOR ADD LEAD POST ROUTE
router.post('/addUser', async (req, res) => {
  try {
    const user = req.body;
    console.log('user', user)
    const findUser = await User.findOne({email:user.email})
    console.log(findUser)
    if(!findUser){
      const plainPassword = user.password;
      console.log(plainPassword) 
      const hashPassword = async (plainPassword) => {
        try {
          const salt = await bcrypt.genSalt(saltRounds);
          const hash = await bcrypt.hash(plainPassword, salt);
          return hash;
        } catch (error) {
          throw error;
        }
      };
      const hashedPassword = await hashPassword(plainPassword)
      console.log(hashedPassword)
      user.password = hashedPassword
      userData = {...user, role:'NewUser'}
      saveUser = new User(userData)
      const result = await saveUser.save();
      console.log(result)
      res.status(201).json({
        message: "Registration Successful",
        user: result,
      });
    }else{
      res.send('User exist')
    }
  } catch (error) {
    console.error('Error adding user:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// USER ROLE CHANGE PATCH ROUTE
router.patch('/userRoleChange/:id', async(req, res) =>{
  try {
    const id = req.params.id;
    const newRole = req.body
    const result = await User.updateOne(
      {_id:id},
      {
        $set:newRole
      }
    )
    res.send(result)
  } catch (error) {
    console.error('Error updating role:', error.message);
    res.status(500).send('Internal Server Error')
  }
})

 //--- CALLER INFO GET ROUTE
 router.get('/callerInfo', async(req, res) => {
  try {
    const result = await User.find({role: 'Caller'})
    res.send(result)
  } catch (error) {
    console.log('Error in fetching caller info', error)
    res.status(500).send('Internal Server Error')
  }
 })
 //--- DEVELOPER INFO GET ROUTE
 router.get('/developerInfo', async(req, res) => {
  try {
    const result = await User.find({role: 'Developer'})
    res.send(result)
  } catch (error) {
    console.log('Error in fetching caller info', error)
    res.status(500).send('Internal Server Error')
  }
 })



module.exports = router;
