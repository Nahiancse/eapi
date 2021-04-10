const mongoose =  require("mongoose");
const express =  require('express');
const multer = require("multer");

// item schema----------------------
const Item  =  require("../models/model");
// doctor Schema
const Doctor = require('../models/doctor');
// user Schema
const User = require('../models/user');
// nurse Schema
const Nurse = require('../models/nurse');
// nurse Schema
const Patient = require('../models/patient');
const { rawListeners } = require("../models/model");
const apiRouter = express.Router();
// const Post = require("../models/model");
// const { rawListeners } = require("../models/model");


//============================================== DOCTOR API==================================

// DOCTOR ACCOUNT CREATION===================================
apiRouter.post('/createDoctor', async(req,res)=>{

var today = new Date();
            var dd = today.getDate();

            var mm = today.getMonth()+1; 
            var yyyy = today.getFullYear();
            if(dd<10) 
            {
                dd='0'+dd;
            } 

            if(mm<10) 
            {
                mm='0'+mm;
            } 
            today = mm+'-'+dd+'-'+yyyy;
            

    const doctor = new Doctor({
        doctorCode:req.body.doctorCode,
        doctorTitle:req.body.doctorTitle,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        dateOfBirth:req.body.dateOfBirth,
        gender:req.body.gender,
        address:req.body.address,
        phone:req.body.phone,
        email:req.body.email,
        bloodGroup:req.body.bloodGroup,
        profileImg:req.body.profileImg,
        nidCard:req.body.nidCard,
        bmdcRegistrationNumber:req.body.bmdcRegistrationNumber,
        termsAndCondition:req.body.termAndCondition,
        createDate:today
   });
   const user = new User({
    mobileNumber:req.body.phone,
   })
    try {
        const saveuser = await user.save();
        const saveddoctor= await doctor.save();
        res.json(saveddoctor);
    } catch (error) {
        res.json({message: error}) 
    }

})

// GET ALL DOCTORS DATA================================
apiRouter.get('/alldoctors',async(req,res)=>{
    try {
        const allDoctors =  await Doctor.find();
        res.json(allDoctors).statusCode(200);
        
    } catch (error) {
        res.json(error).statusCode(404);
    }

})

// GET A SPECIFIC DOCTOR BY DOCTORCODE=================
apiRouter.get('/doctor/', async(req,res)=>{
    let doctorCode =  req.query.doctorCode;
   try {
    const singleDocInfo = await Doctor.findOne({doctorCode});
    res.json(singleDocInfo).statusCode(200);
   } catch (error) {
       res.json(error).statusCode(404);
       
   }

})
// SINGLE DOCTOR INFORMATION UPDATE=====================
apiRouter.patch("/updatedoctor/", async(req,res)=>{
    var today = new Date();
            var dd = today.getDate();

            var mm = today.getMonth()+1; 
            var yyyy = today.getFullYear();
            if(dd<10) 
            {
                dd='0'+dd;
            } 

            if(mm<10) 
            {
                mm='0'+mm;
            } 
            today = mm+'-'+dd+'-'+yyyy;
    let doctorCode =  req.query.doctorCode;
    try {
     const updatedDoctor = await Doctor.updateOne({doctorCode:doctorCode},{$set:{
        doctorCode:req.body.doctorCode,
        doctorTitle:req.body.doctorTitle,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        dateOfBirth:req.body.dateOfBirth,
        gender:req.body.gender,
        address:req.body.address,
        phone:req.body.phone,
        email:req.body.email,
        bloodGroup:req.body.bloodGroup,
        profileImg:req.body.profileImg,
        nidCard:req.body.nidCard,
        bmdcRegistrationNumber:req.body.bmdcRegistrationNumber,
        termsAndCondition:req.body.termAndCondition,
        updateDate:today
        }});
     if(updatedDoctor){
         res.json( updatedDoctor).statusCode(200);
     }
    } catch (error) {
     res.json({message: error}); 
    }
 })

//DELETE A SPECIFIC DOCTOR BY DOCTORCODE=============================
apiRouter.delete("/deletedoctor/", async(req,res)=>{

    try {
     const deleteDoctor = await Doctor.deleteOne({doctorCode: req.query.doctorCode});
     if(deleteDoctor){
         res.json({message:"Doctor has been deleted!!"}).statusCode(200);
     }
    } catch (error) {
     res.json({message: error}) 
    }
 })

// ====================================NURSE API=========================================


// NURSE ACCOUNT CREATION===================================
apiRouter.post('/createNurse', async(req,res)=>{
    var today = new Date();
            var dd = today.getDate();

            var mm = today.getMonth()+1; 
            var yyyy = today.getFullYear();
            if(dd<10) 
            {
                dd='0'+dd;
            } 

            if(mm<10) 
            {
                mm='0'+mm;
            } 
            today = mm+'-'+dd+'-'+yyyy;
            

    const nurse = new Nurse({
        nurseCode:req.body.nurseCode,
        nurseTitle:req.body.nurseTitle,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        dateOfBirth:req.body.dateOfBirth,
        gender:req.body.gender,
        address:req.body.address,
        phone:req.body.phone,
        email:req.body.email,
        bloodGroup:req.body.bloodGroup,
        profileImg:req.body.profileImg,
        nidCard:req.body.nidCard,
        registrationNumber:req.body.registrationNumber,
        termsAndCondition:req.body.termsAndCondition,
        createDate:today
   });
   const user = new User({
    mobileNumber:req.body.phone,
   })
    try {
        const saveuser = await user.save();
        const savednurse= await nurse.save();
        res.json(savednurse);
    } catch (error) {
        res.json({message: error}) 
    }

})

// GET ALL NURSES DATA================================
apiRouter.get('/allnurses',async(req,res)=>{
    try {
        const allnurses =  await Nurse.find();
        res.json(allnurses).statusCode(200);
        
    } catch (error) {
        res.json(error).statusCode(404);
    }

})

// GET A SPECIFIC NURSE BY DOCTORCODE=================
apiRouter.get('/nurse/', async(req,res)=>{
    let nurseCode =  req.query.nurseCode;
   try {
    const singleNurseInfo = await Nurse.findOne({nurseCode});
    res.json(singleNurseInfo).statusCode(200);
   } catch (error) {
       res.json(error).statusCode(404);
       
   }

})
// SINGLE NURSE INFORMATION UPDATE=====================
apiRouter.patch("/updatenurse/", async(req,res)=>{
    var today = new Date();
            var dd = today.getDate();

            var mm = today.getMonth()+1; 
            var yyyy = today.getFullYear();
            if(dd<10) 
            {
                dd='0'+dd;
            } 

            if(mm<10) 
            {
                mm='0'+mm;
            } 
            today = mm+'-'+dd+'-'+yyyy;
    let nurseCode =  req.query.nurseCode;
    try {
     const updatedNurse = await Nurse.updateOne({nurseCode:nurseCode},{$set:{
        nurseCode:req.body.nurseCode,
        nurseTitle:req.body.nurseTitle,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        dateOfBirth:req.body.dateOfBirth,
        gender:req.body.gender,
        address:req.body.address,
        phone:req.body.phone,
        email:req.body.email,
        bloodGroup:req.body.bloodGroup,
        profileImg:req.body.profileImg,
        nidCard:req.body.nidCard,
        registrationNumber:req.body.registrationNumber,
        termsAndCondition:req.body.termsAndCondition,
         updateDate:today
        }});
     if(updatedNurse){
         res.json( updatedNurse).statusCode(200);
     }
    } catch (error) {
     res.json({message: error}); 
    }
 })

//DELETE A SPECIFIC NURSE BY NURSECODE=============================
apiRouter.delete("/deletenurse/", async(req,res)=>{

    try {
     const deleteNurse = await Nurse.deleteOne({nurseCode: req.query.nurseCode});
     if(deleteNurse){
         res.json({message:"NURSE has been deleted!!"}).statusCode(200);
     }
    } catch (error) {
     res.json({message: error}) 
    }
 })



 // ====================================PATIENT API=========================================


// PATIENT ACCOUNT CREATION===================================
apiRouter.post('/createpatient', async(req,res)=>{

   var today = new Date();
            var dd = today.getDate();

            var mm = today.getMonth()+1; 
            var yyyy = today.getFullYear();
            if(dd<10) 
            {
                dd='0'+dd;
            } 

            if(mm<10) 
            {
                mm='0'+mm;
            } 
            today = mm+'-'+dd+'-'+yyyy;

    const patient = new Patient({
        patientCode:req.body.patientCode,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        dateOfBirth:req.body.dateOfBirth,
        gender:req.body.gender,
        address:req.body.address,
        phone:req.body.phone,
        email:req.body.email,
        bloodGroup:req.body.bloodGroup,
        profileImg:req.body.profileImg,
        nidCard:req.body.nidCard,
        termsAndCondition:req.body.termsAndCondition,
         createDate:today
   });
   const user = new User({
    mobileNumber:req.body.phone,
   })
    try {
        const saveuser = await user.save();
        const savedpatient= await patient.save();
        res.json(savedpatient);
    } catch (error) {
        res.json({message: error}) 
    }

})

// GET ALL PATIENT DATA================================
apiRouter.get('/allpatients',async(req,res)=>{
    try {
        const allpatients =  await Patient.find();
        res.json(allpatients).statusCode(200);
        
    } catch (error) {
        res.json(error).statusCode(404);
    }

})

// GET A SPECIFIC PATIENT BY DOCTORCODE=================
apiRouter.get('/patient/', async(req,res)=>{
    let patientCode =  req.query.patientCode;
   try {
    const singlepatientInfo = await Patient.findOne({patientCode});
    res.json(singlepatientInfo).statusCode(200);
   } catch (error) {
       res.json(error).statusCode(404);
       
   }

})
// SINGLE PATIENT INFORMATION UPDATE=====================
apiRouter.patch("/updatepatient/", async(req,res)=>{
    var today = new Date();
            var dd = today.getDate();

            var mm = today.getMonth()+1; 
            var yyyy = today.getFullYear();
            if(dd<10) 
            {
                dd='0'+dd;
            } 

            if(mm<10) 
            {
                mm='0'+mm;
            } 
            today = mm+'-'+dd+'-'+yyyy;
    let patientCode =  req.query.patientCode;

    try {
     const updatedpatient = await Patient.updateOne({patientCode:patientCode},{$set:{
        patientTitle:req.body.patientTitle,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        dateOfBirth:req.body.dateOfBirth,
        gender:req.body.gender,
        address:req.body.address,
        phone:req.body.phone,
        email:req.body.email,
        bloodGroup:req.body.bloodGroup,
        profileImg:req.body.profileImg,
        nidCard:req.body.nidCard,
        termsAndCondition:req.body.termsAndCondition,
        updateDate:today
        }});
     if(updatedpatient){
         res.json( updatedpatient).statusCode(200);
     }
    } catch (error) {
     res.json({message: error}); 
    }
 })

//DELETE A SPECIFIC PATIENT BY NURSECODE=============================
apiRouter.delete("/deletepatient/", async(req,res)=>{

    try {
     const deletepatient = await Patient.deleteOne({nurseCode: req.query.nurseCode});
     if(deleteNurse){
         res.json({message:"PATIENT has been deleted!!"}).statusCode(200);
     }
    } catch (error) {
     res.json({message: error}) 
    }
 })

// GET ALL NUMBERS FROM USER TABLE========================================

apiRouter.get('/allNumbers',async(req,res)=>{
    try {
        const allNumbers =  await User.find();
        res.json(allNumbers).statusCode(200);
        
    } catch (error) {
        res.json(error).statusCode(404);
    }

})




















































//------------------------------------ demo-api--------------------------------------------

// file-uploading-functionality
var storage = multer.diskStorage({
    destination: function(req, res,cb){
        // cb= callback
        cb(null,'public/uploads/item')
    },
    filename:function(req, file, cb){
        cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({storage: storage})
// creating-new item-------------------------------------------
apiRouter.post('/create-item', upload.single('itemImage') ,async(req,res)=>{
        const item = new Item({
            category:req.body.category,
            serviceProvide:[{steamWash:req.body.steamWash,dryWash:req.body.dryWash,steamIron:req.body.steamIron,dryIron:req.body.dryIron,}],
            image:req.file.filename, 
       });
   try {
     const savedItem = await item.save();
    //  const allItem = await Item.find();
    //  console.log(allItem);
     res.render('create-item',{message:"New Item has been created."});
   } catch (error) {

    res.json({message: error}) 
   }
});


// uploading file-routing
// app.post('/fileup', upload.single('proimg'), function(req, res, next){
//     var fileinfo =  req.file.filename;
//     console.log(fileinfo);
//     res.send(fileinfo)
// })




// get a specific post by id
apiRouter.get("/post/:postId", async(req,res)=>{
    console.log(req.params.postId);
   try {
    const singlePost = await Post.findById(req.params.postId);
    res.json(singlePost);
   } catch (error) {
    res.json({message: error}) 
   }
})
// Delete a specific post by id
apiRouter.delete("/post/:postId", async(req,res)=>{
   try {
    const deletePost = await Post.deleteOne({_id: req.params.postId});
    if(deletePost){
        res.json({message:"Post has been deleted!!"});
    }
   } catch (error) {
    res.json({message: error}) 
   }
})
// Update a specific post
apiRouter.patch("/post/:postId", async(req,res)=>{
    try {
     const updatedPost = await Post.updateOne({_id: req.params.postId},{$set:{title:req.body.title,description:req.body.description}});
     if(deletePost){
         res.json({message:"Post has been Updated!!"});
     }
    } catch (error) {
     res.json({message: error}) 
    }
 })

module.exports =  apiRouter;