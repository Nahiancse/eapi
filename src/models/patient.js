const mongoose = require("mongoose");
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const patientSchema = new mongoose.Schema({
    patientCode:String,
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
        required:true
    },
    email:{
        type:String,
    },
    profileImg:String,
    bloodGroup:String,
    termsAndCondition:Boolean,
    createDate:{
        type:String,
      
    },
    updateDate:{
        type:String,
        

    },
   
})


module.exports = new mongoose.model('Patient',patientSchema);

