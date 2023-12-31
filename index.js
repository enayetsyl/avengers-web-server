const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId} = require ('mongodb')
const mongoose = require('./db')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { corsOptions, errorHandler } = require('./middleware')
const { Lead, User, Caller, Developer } = require('./model');
const leadRoutes = require('./leadRoutes')
const userRoutes = require('./userRoutes')
const callerRoutes = require('./callerRoutes')
const developerRoutes = require('./developerRoutes')
const jwtRoutes = require('./jwtRoutes')

const app = express()
const port = process.env.PORT || 5000;

// Middleware

app.use(cors(corsOptions))
app.use(express.json())

// Routes 
 app.use('/api/v1', leadRoutes);
 app.use('/api/v1', userRoutes);
 app.use('/api/v1', callerRoutes);
 app.use('/api/v1', developerRoutes);
 app.use('/api/v1', jwtRoutes);


//  Error handling Middleware
app.use(errorHandler)
 
// Home route 
app.get('/', (req, res) => {
  res.send('Avengers web server is running!')
})

// Server listening
app.listen(port, () => {
  console.log(`Server is running at PORT: ${port}`)
})

