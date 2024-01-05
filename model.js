const mongoose = require('./db');

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
  websiteCreation: String,
  ourCreatedWebsiteLink: String,
  messageSentAtFirstApproach: String,
  marketingMessageSent: Boolean,
  existingWebsiteLink: String,
  entryBy: String,
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
  websiteAvailabe: Boolean,
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
  developerName: String,
  developerEmail: String,
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
  developerName: String,
  developerEmail: String,
});


const Lead = mongoose.model('Lead', leadSchema);
const User = mongoose.model('User', userSchema);
const Caller = mongoose.model('Caller', callerSchema)
const Developer = mongoose.model('Developer', developerSchema)
 
module.exports = { Lead, User, Caller, Developer }
