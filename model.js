const mongoose = require('./db');

const leadSchema = new mongoose.Schema({
  name: String, 
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
});



const Lead = mongoose.model('Lead', leadSchema);


module.exports = { Lead }
