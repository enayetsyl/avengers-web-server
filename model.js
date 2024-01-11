const mongoose = require('./db');


const changedItemSchema = new mongoose.Schema({
  propertyName: String, 
  propertyValue: mongoose.Schema.Types.Mixed
})

const leadSchema = new mongoose.Schema({
  businessName: String, 
  facebookAddress: String,
  mobileNumber: String,
  facebookPageName: String,
  businessType: String,
  websiteAvailable: Boolean,
  email: String,
  firstCallDate: Date, 
  firstMeetingDate: Date,
  converted: Boolean,
  reasonForNonConversion: String,
  ourCreatedWebsiteLink: String,
  messageSentAtFirstApproach: String,
  marketingMessageSent: Boolean,
  existingWebsiteLink: String,
  entryBy: String,
  entryDate: Date,
  changeHistory: [
    {
      userEmail: String,
      timestamp: Date,
      changedItem: mongoose.Schema.Types.Mixed,
    },
  ],
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
})

const callerSchema = new mongoose.Schema({
  businessName: String,
  facebookAddress: String,
  mobileNumber: String,
  facebookPageName: String,
  businessType: String,
  websiteAvailable: Boolean,
  email: String,
  firstCallDate: Date,
  firstMeetingDate: Date,
  converted: Boolean,
  reasonForNonConversion: String,
  websiteCreation: String,
  ourCreatedWebsiteLink: String,
  messageSentAtFirstApproach: String,
  marketingMessageSent: Boolean,
  existingWebsiteLink: String,
  entryBy: String,
  callerName: String,
  callerEmail: String,
  leadPostDate: Date,
  developerName: String,
  developerEmail: String,
  developerAssignedOn: Date,
  entryDate: Date,
  developerPostDate: Date,
  changeHistory: [
    {
      userEmail: String,
      timestamp: Date,
      changedItem: mongoose.Schema.Types.Mixed,
    },
  ],
}) 

// Developer Schema
const developerSchema = new mongoose.Schema({
  businessName: String, 
  facebookAddress: String,
  mobileNumber: String,
  facebookPageName: String,
  businessType: String,
  websiteAvailable: Boolean,
  email: String,
  firstCallDate: Date, 
  firstMeetingDate: Date,
  converted: Boolean,
  reasonForNonConversion: String,
  websiteCreation: String,
  ourCreatedWebsiteLink: String,
  messageSentAtFirstApproach: String,
  marketingMessageSent: Boolean,
  existingWebsiteLink: String,
  entryBy: String,
  leadPostDate: Date,
  developerName: String,
  developerEmail: String,
  developerAssignedOn: Date,
  entryDate: Date,
  developerPostDate: Date,
  changeHistory: [
    {
      userEmail: String,
      timestamp: Date,
      changedItem: mongoose.Schema.Types.Mixed,
    },
  ],
});


const Lead = mongoose.model('Lead', leadSchema);
const User = mongoose.model('User', userSchema);
const Caller = mongoose.model('Caller', callerSchema)
const Developer = mongoose.model('Developer', developerSchema)
 
module.exports = { Lead, User, Caller, Developer }
