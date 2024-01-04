const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();
const { User } = require('./model');
const { route } = require('./leadRoutes');
const saltRounds = 10
// FOR ALL LEADS

// router.get('/allLeads', async (req, res) => {
//   try {
//     const result = await Lead.find();
//     res.send(result);
//   } catch (error) {
//     console.error('Error fetching leads:', error.message);
//     res.status(500).send('Internal Server Error');
//   }
// });

// SINGLE LEAD GET ROUTE

// DEVELOPER GET ROUTE
router.get('/developer', async(req, res) => {
  try {
    const result = await User.find({role:{$in:['developer', 'New User']}}) 
    res.send(result)
  } catch (error) {
    console.log('Error in getting developer user', error)
    res.status(500).send('Internal Server Error')
  }
})

// LEAD COLLECTOR AND CALLER GET ROUTE
router.get('/allUsers', async(req, res) => {
  console.log('user route hit')
  try{
    const result = await User.find({}, {password: 0, __v:0})
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
      userData = {...user, role:'New User'}
      console.log('user data',userData)
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
    console.log(id)
    const newRole = req.body
    console.log(newRole)
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

// // Lead PATCH ROUTE
// router.patch('/allLeads/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//   const updatedLeadData = req.body;
//   const result = await Lead.findByIdAndUpdate(
//     id,
//     { $set: updatedLeadData },
//     { new: true }
//   );
//   res.send(result);
//   } catch (error) {
//     console.error('Error updating lead:', error.message);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // FOR DELETE PRODUCT ROUTE
// router.delete('/allLeads/:id', async (req, res) => {
//   const id = req.params.id;
//   try {
//     const result = await Lead.findByIdAndDelete(id);
//     res.send(result);
//   } catch (error) {
//     console.error('Error deleting lead:', error.message);
//     res.status(500).send('Internal Server Error');
//   }
// });

module.exports = router;
