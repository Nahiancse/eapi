const mongoose = require("mongoose");
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const userSchema = new mongoose.Schema({
   mobileNumber:String
   
})


module.exports = new mongoose.model('User',userSchema);

