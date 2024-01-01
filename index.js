const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId} = require ('mongodb')
const mongoose = require('./db')
require ('dotenv').config()
const { corsOptions, errorHandler } = require('./middleware')
const { Lead } = require('./model');
const leadRoutes = require('./leadRoutes')
const userRoutes = require('./userRoutes')

const app = express()
const port = process.env.PORT || 5000;

// Middleware

app.use(cors(corsOptions))
app.use(express.json())

// Routes 
 app.use('/api/v1', leadRoutes);
 app.use('/api/v1', userRoutes);


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