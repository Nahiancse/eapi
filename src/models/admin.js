const mongoose = require("mongoose");
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const adminSchema = new mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    age:{
        type:Number
    },
   
    gender:{
        type:String
    },
    phone:{
        type:String
    },
    email:{
        type:String,
        required:true,
    },
    adminRole:{
        type:Number
    },
    phone:{
        type:Number
    },
    password:{
        type:String
    },
    //auto-token-generation
   tokens:[{
    token:{
     type: String,
    }
}]

})

// middleware for generating webtoken---------------
adminSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()}, "amarsonerbanglaamitomayvalobasichirodintomarakashtomarbatashdawkhoda");
        this.tokens =  this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        response.send(`the error part:${error}`);
    }
}

// middleware plane text to hash----(for the purpose of making password secured before storing in the database)--------------
adminSchema.pre("save", async function(next){
    if(this.isModified('password')){
       this.password =  await bycript.hash(this.password,10);
    //    ignoring confirmpassword store in the database
    //    this.confirmpassword =  await bycript.hash(this.confirmpassword,10);
    }
    next();
})

module.exports = new mongoose.model('Admin',adminSchema);

