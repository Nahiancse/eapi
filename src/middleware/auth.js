const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");


const auth = async (req, res, next) =>{
    
    try {
        
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, "amarsonerbanglaamitomayvalobasichirodintomarakashtomarbatashdawkhoda");
        const userData = await Admin.findOne({_id:verifyUser._id})
        req.token =  token;
        req.userData =  userData;
        next()
        
    } catch (error) {
        res.status(401).render("login")
    }
}

module.exports =  auth;