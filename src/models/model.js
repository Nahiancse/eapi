const mongoose = require("mongoose");
// service provide option-----------------------
const service = mongoose.Schema({
    steamWash:{
        type:Number
    },
    dryWash:{
        type:Number
    },
    dryIron:{
        type:Number
    },
    steamIron:{
        type:Number
    }
}) 
// Add Item Shema------------------------
const ItemSchema =  mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    ItemName:{
        type:String
    },
    serviceProvide:[service],
    image:{
        type:String,
    }
});

module.exports =  mongoose.model('Item',ItemSchema);
