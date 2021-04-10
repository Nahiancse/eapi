const mongoose = require("mongoose");
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const doctorSchema = new mongoose.Schema({
    doctorCode:String,
    doctorTitle:String,
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    dateOfBirth:{
        type:String
    },
    gender:{
        type:String
    },
    address:String,
    phone:{
        type:String,
    },
    email:{
        type:String,
    },
    bloodGroup:{
        type:String
    },
    profileImg:String,
    nidCard:String,
    bmdcRegistrationNumber:String,
    termsAndCondition:Boolean,
    createDate:{
        type:String,
         
    },
    updateDate:{
        type:String,
        

    },
   
})

module.exports = new mongoose.model('Doctor',doctorSchema);

