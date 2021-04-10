const mongoose = require("mongoose");

// creating connection with database
mongoose.connect("mongodb://localhost:27017/e-call",{
    useCreateIndex :  true,
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then( ()=>{
    console.log("Mongo connection successfull...");
}).catch(()=>{
    console.log("connection failed!!");
})