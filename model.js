const mongoose = require('./db');

const leadSchema = new mongoose.Schema({
  businessName: String, 
  facebookAddress: String,
  mobileNumber: String,
  facebookPageName: String,
  businessType: String,
  websiteAvailable: Boolean,
  email: String,
  websiteAddress: String,
  firstCallDate: String, 
  firstMeetingDate: Date,
  converted: Boolean,
  reasonForNonConversion: String,
  websiteCreation: String,
  ourCreatedWebsiteLink: String,
  messageSentAtFirstApproach: String,
  marketingMessageSent: Boolean,
  existingWebsiteLink: String
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
})

const Lead = mongoose.model('Lead', leadSchema);
const User = mongoose.model('User', userSchema);


module.exports = { Lead, User }
