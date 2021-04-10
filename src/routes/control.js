const mongoose =  require("mongoose");
const express =  require('express');
const multer = require("multer");
const nodemailer =  require("nodemailer")
const bycript = require("bcryptjs");
const bodyParser =  require("body-parser");
const jwt = require("jsonwebtoken");
const hbs = require('hbs');
const cookieParser = require("cookie-parser");
// Authorization--------------------
const auth = require("../middleware/auth");
// item schema----------------------
const Item  =  require("../models/model");
// admin schema---------------------
const Admin  =  require("../models/admin");
// orderlist schema---------------------
const Orderlist  =  require("../models/order-list");
// Customer schema---------------------
const Customer  =  require("../models/customer");
const Demo  =  require("../models/demo");

// localStorage
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

const { rawListeners, schema } = require("../models/model");
const { handlebars } = require("hbs");
const router = express.Router();

 //  ------------------------------------helper register--------------------------------
//  customerLogged information----
 hbs.registerHelper("customerLoggedIn",  function(value, name){
       
    if(value === 1){
        return new handlebars.SafeString(` <a > <i class="far fa-user mr-2"></i>${name}<i class="fas fa-sort-down ml-2"></i>
                         </a>
                        <div class="user-login-dropdown">
                                <ul>
                                    <li><a href="customer-profile">Profile</a></li>
                                    <li><a href="history">History</a></li>
                                    <li><a href="home/logout">Log Out</a></li>
                                </ul>
                        </div>`)}
                    })
  
hbs.registerHelper("loginBox",  function(value){

    if(value === 0){
        return new handlebars.SafeString(`<div class="checkout-form col-md-6" id="CustomerLoginBox" style="display: none;">
        <form action="/admin/checkout/login" method="POST">
            <div class="form-title">
             <p>login</p>
         </div>
         <div class="form-group">
             <label>Email</label>
             <input class="form-control" placeholder="Enter Your Email" value="" name="email" type="email">
         </div>
         <div class="form-group">
             <label>Password</label>
             <input class="form-control" placeholder="Enter Your Password" value="" name="password" type="password">
         </div>
         <div class="form-group forgot-password">
             <a href="#">Forgot Password!</a>
             <a href="create-customer" class="text-primary">Don't have account yet?</a>
         </div>
         <div class="form-group form-wizard-buttons">
             <button class="btn btn-primary btn-submit" type="submit">Login Now</button>
         </div>
        </form> 
         
     </div>`)}
                    })

// Order-serial-----------------------                   
hbs.registerHelper("oderSerial", function(value) {
    return value +=1;
  });

//--------------------------------------------------------

// route for showing create-item page
router.get("/create-item", auth, async(req, res)=>{
    const succMsg = req.query.success;
    const deleteMsg = req.query.delete;

    
    try{
        const adminData = req.userData;
        const allItem = await Item.find();
        if(succMsg == 'true'){
            res.render("create-item",{allItem,adminData,succMsg});
        }
        else if(deleteMsg == 'true'){
            res.render("create-item",{allItem,adminData,deleteMsg});
        }
        else{
            res.render("create-item",{allItem,adminData});
        }
        
    }
    catch(error){
        res.render("create-item",{error})
    }
    
});


// create new item-------------------


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
router.post('/create-item', upload.single('itemImage') ,async(req,res)=>{
        const item = new Item({
            category:req.body.category,
            itemName:req.body.Item_Name,
            serviceProvide:[{steamWash:req.body.steamWash,dryWash:req.body.dryWash,steamIron:req.body.steamIron,dryIron:req.body.dryIron}],
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



// load create-admin page-------------------------
router.get('/create-admin',auth, (req,res)=>{
    const adminData = req.userData;
    res.render("create-admin",{adminData});
});

//create admin-----------------------------------
router.post('/create-admin', async(req,res)=>{

    const admin = new Admin({
        firstName:req.body.firstName,
        adminRole: req.body.adminRole,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        age: req.body.age,
        password: req.body.password,
   });

   
try {
    
 const savedAdmin = await admin.save();
  // call  a function for generating a jsonwebtoken --------------- 
  const token = await admin.generateAuthToken();
    
  // setting cookie in the browser--------------------
//   res.cookie("jwt",token,{
//       httpOnly:true
//   });
 res.render('create-admin',{message:"New admin has been created."});
 
} 
catch (error) {
  res.send(error)
//   res.json({message: error}) 
 }  
})





//Updations



//loading item update form
router.get('/update-item/',async(req,res,next)=>{

   const id = req.query.id;
   const singleItem =await Item.findOne({_id:id});
        res.render('update_item',{singleItem})
    })
    
// Update a specific item
router.post('/update-item/', upload.single('itemImage'), async(req,res)=>{
    const id = req.query.id;
    const myquery={_id:id}
    if(req.file){
        var newValues = { $set:{
            category:req.body.category,
            itemName:req.body.Item_Name,
            serviceProvide:[{steamWash:req.body.steamWash,dryWash:req.body.dryWash,steamIron:req.body.steamIron,dryIron:req.body.dryIron,}],
            image:req.file.filename,
            
           
            }
        }
    }
    else{
        var newValues = { $set:{
            category:req.body.category,
            itemName:req.body.Item_Name,
            serviceProvide:[{steamWash:req.body.steamWash,dryWash:req.body.dryWash,steamIron:req.body.steamIron,dryIron:req.body.dryIron,}],
          
            
           
            }
        }
       
    }
    const updateResult =  await Item.findByIdAndUpdate(myquery,newValues,{
        useFindAndModify:false
    });
    res.redirect('/admin/create-item?success=true')
   
});



//loading admin update form
router.get('/profile/', async(req,res,next)=>{

    let id = req.query.id;
    let success = req.query.success;

   const adminData =await Admin.findOne({_id: id})
   

        res.render('profile',{adminData,success})
    });


// Update admin profile
router.post('/profile/', async(req,res)=>{
    const id = req.query.id;
    const myquery = {_id:id};
        var newValues = { $set:{
            firstName:req.body.firstName,
            email:req.body.email,
            adminRole:req.body.adminRole,
            phone:req.body.phone,
            password:req.body.password,
            }
        }
    const updateResult =  await Admin.findByIdAndUpdate(myquery,newValues,{
        useFindAndModify:false
    });
    res.redirect('/admin/profile?id='+id+'&success=true')
   
});

   





//  Deletions



// Delete a specific post by id

router.get('/delete-item/',(req, res)=>{
    Item.findByIdAndDelete({_id:req.query.id}, err=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/admin/create-item?delete=true');
        }
    });
})

// Delete a specific order by id

router.get('/delete-order/',(req, res)=>{
    const OrderId =  req.query.id;

    Orderlist.findByIdAndDelete({_id:OrderId}, err=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/admin/order-list');
        }
    });
})


//--------------------------------------------Login/Logout functionality---------------------


// getting login page-------------------------
router.get('/login', (req,res)=>{
    res.render('login');
})


// login- functionality----------------
router.post("/", async(req, res)=>{
    
    const errorMsg = "Invalid Login!!";
    const wrongkeyword =  "Wrong Keywords!!";
    
    try {
        const email  = req.body.loginEmail;
        const password  = req.body.loginpassword;
        if(email === "" || password === ""){
            res.render("login",{emptyMsg:"Field is required!!"})
        }
        else{
             
             const userData = await Admin.findOne({email:email});
            // macthing database password and user input password by bycriptjs--------------------
            const isMatch = await bycript.compare(password, userData.password);
            if(isMatch){

          // call  a function for generating a jsonwebtoken  ----------------
            const token = await userData.generateAuthToken();
            // setting cookie in the browser--------------------
            res.cookie("jwt",token, {
                // expires:new Date(Date.now() + 100000000),
                httpOnly:true
            });    
           
            res.redirect("/admin?user="+ userData.firstName);
       
        }
        else{
            res.render("login",{wrongkeyword});
        }

        }
    
        
    } catch (error) {
        res.send("login",{errorMsg});
    }
});

// logout functionality--------------------

router.get("/logout", auth, async(req,res)=>{
    try {
        res.clearCookie("jwt");
        console.log("logout success...");
        // await req.userData.save();
        res.render("login");
    } catch (error) {
        res.status(500).send(error)
        
    }
});


//  ----------------------------------------------------- Order related works--------------------------------


// orderlist-route
router.get("/order-list/", auth, async(req,res)=>{
    try{
        const adminData = req.userData;
        const allOrder = await Orderlist.find();
        res.render("order-list",{allOrder, adminData});
    }
    catch(error){
        res.render("index",{error})
    }
});  
// orderview-route
router.get("/order-view/", auth, async(req,res)=>{
    try {
    const id =  req.query.id;
    let msg =  req.query.success;
    if(msg == 'true'){
        let mailSuccMessage = 'Your Mail has been sent to Customer.'
        console.log('this is success Message='+msg);
        const singleOrderData = await Orderlist.findOne({_id:id});
        const adminData = req.userData;
        res.render("order-view",{adminData,singleOrderData,mailSuccMessage});
    }
    else{
        
    const singleOrderData = await Orderlist.findOne({_id:id});
    const adminData = req.userData;
    console.log(singleOrderData);
    res.render("order-view",{adminData,singleOrderData});
    }
    
        
    } catch (error) {

        res.render("order-view",{adminData});
    }
    
});



//create order------
router.post("/checkout", async(req,res)=>{
    
    let cart = req.body.cart;
    const orderlist = new Orderlist({ 
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email: req.body.email,
        phone: req.body.phoneNumber,
        address: req.body.address,
        city: req.body.city,
        customerId:req.body.customerId,
        paymentMethod: req.body.payment_option,
        allProductInfo:[ req.body.cart],
        cartSubTotal: req.body.cartSubtotal,
        OrderTotal: req.body.cartTotal,
       
   });

try {
    
 const saveOrder = await orderlist.save();
 console.log(saveOrder);
 res.render('checkout',{message:"New order has been created."});
 
} 
catch (error) {
  res.send(error)
//   res.json({message: error}) 
 }  
})




// profile-route
router.get("/profile", auth, (req,res)=>{
    const adminData = req.userData;
    res.render("profile",{adminData});
});



// 404-route
router.get("/404", auth, (req,res)=>{
    res.render('404')
});



//-------------------  FRONT-PAGE----------------------------------------------

// front-end-home-
router.get("/home/", async(req,res)=>{
    let value = 0;
   
    try{
       
        let token = req.cookies.jwtCustomer;
        if(token){
            value = 1;
            const verifyUser = jwt.verify(token, "amarsonerbanglaamitomayvalobasichirodintomarakashtomarbatashdawkhodacustomer");
            const userData = await Customer.findOne({_id:verifyUser._id})
            const allItem = await Item.find();
            console.log(allItem)
            res.render("home",{allItem,userData,value});  
            
        }
        else{
            const allItem = await Item.find();
            res.render("home",{allItem});  

        }

        
        
    }
    catch(error){
        res.render("home",{error})
    }
});
// front-cart view-
router.get("/cart-view", async(req,res)=>{
    let value = 0;
    
    try{
        const token = req.cookies.jwtCustomer;
        if(token){
            value = 1;
            
            const verifyUser = jwt.verify(token, "amarsonerbanglaamitomayvalobasichirodintomarakashtomarbatashdawkhodacustomer");
            const userData = await Customer.findOne({_id:verifyUser._id})
            res.render("cart-view",{userData,value});  
            
        }
        else{
            res.render("cart-view");  

        }
        
    }
    catch(error){
        res.render("cart-view",{error})
    }

});
// front-checkout-
router.get("/checkout", async(req,res)=>{
    let value = 0;
    
    try{
        const token = req.cookies.jwtCustomer;
        if(token){
            value = 1;
            const verifyUser = jwt.verify(token, "amarsonerbanglaamitomayvalobasichirodintomarakashtomarbatashdawkhodacustomer");
            const userData = await Customer.findOne({_id:verifyUser._id})
            res.render("checkout",{userData,value});  
            
        }
        else{
            value = 0;
            res.render("checkout",{value});  

        }
    }
    catch(error){
        res.render("checkout",{error})
    }
 });
 // front-create customer-
router.get("/create-customer", async(req,res)=>{
    res.render('create-customer');
 });
 // front-history-
router.get("/history", async(req,res)=>{
    res.render('history');
 });
 

//create Customer------
router.post("/create-customer/", async(req,res)=>{
    
    const customer = new Customer({ 
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        gender: req.body.gender,
        age: req.body.age,
        password:req.body.password
   });

try {
    
 const saveCustomer = await customer.save();
 // call  a function for generating a jsonwebtoken  ----------------
 const token = await saveCustomer.generateAuthToken();
 // setting cookie in the browser--------------------
 res.cookie("jwtCustomer",token, {
     // expires:new Date(Date.now() + 100000000),
     httpOnly:true
 }); 
 res.render('checkout');
 
} 
catch (error) {
  res.send(error)
 // res.json({message: error}) 
 }  
})

// customer login- functionality----------------
router.post("/checkout/login", async(req, res)=>{
    
    const errorMsg = "Invalid Login!!";
    const wrongkeyword =  "Wrong Keywords!!";
    
    try {
        const email  = req.body.email;
        const password  = req.body.password;
        if(email === "" || password === ""){
            res.render("checkout",{emptyMsg:"Field is required!!"})
        }
        else{
             
             const userData = await Customer.findOne({email:email});
            // macthing database password and user input password by bycriptjs--------------------
            const isMatch = await bycript.compare(password, userData.password);
            if(isMatch){

          // call  a function for generating a jsonwebtoken  ----------------
            const token = await userData.generateAuthToken();
            // setting cookie in the browser--------------------
            res.cookie("jwtCustomer",token, {
                // expires:new Date(Date.now() + 100000000),
                httpOnly:true
            });    
            const logSuccMsg ="welcome"
            res.redirect('/admin/home');
       
        }
        else{
            res.render("checkout",{wrongkeyword});
        }

        }
    
        
    } catch (error) {
        res.send("checkout",{errorMsg});
    }
});





// logout functionality--------------------

router.get("/home/logout", async(req,res)=>{
    try {
        res.clearCookie("jwtCustomer");
        console.log("logout success...");
        // await req.userData.save();
        res.redirect("/admin/home");
    } catch (error) {
        res.status(500).send(error)
        
    }
});

//customer Profile -------------------
router.get("/customer-profile/",  async(req,res)=>{

    let value = 0;
    
    try{
        const token = req.cookies.jwtCustomer;
        if(token){
            value = 1;
            const verifyUser = jwt.verify(token, "amarsonerbanglaamitomayvalobasichirodintomarakashtomarbatashdawkhodacustomer");
            const userData = await Customer.findOne({_id:verifyUser._id})
            res.render("customer-profile",{userData,value});  
            
        }
        else{
            value = 0;
            res.render("customer-profile",{value});  

        }
    }
    catch(error){
        res.render("customer-profile",{error})
    }
})
//customer Profile Update-----------
router.post("/customer-profile/", async(req,res)=>{
    const token = req.cookies.jwtCustomer;
    const verifyUser = jwt.verify(token, "amarsonerbanglaamitomayvalobasichirodintomarakashtomarbatashdawkhodacustomer");
    var myquery = {_id: verifyUser._id};
    var newValues = { $set:{
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        phone:req.body.phone,
        city:req.body.city,
        gender:req.body.gender,
        age:req.body.age,
        address:req.body.address,
        password:req.body.password,

        }
    }

    const updateResult =  await Customer.findByIdAndUpdate(myquery,newValues,{
        useFindAndModify:false
    });

    res.redirect('/admin/customer-profile')
})



// email sending -----------------------------------
router.get("/emailsend/" ,async(req, res)=>{

    let urlData =  req.query;
    const customerOrderId = urlData.cusId;
    let CustomerData = await Orderlist.findById(customerOrderId);
   try {

    let SENDER = 'software1.polock@gmail.com';
    console.log(SENDER);
    let RECEIVER = CustomerData.email;

 // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    service:"gmail",
    port: 465,
    secure: false,
    auth: {
      user: "taijul.polock@gmail.com", // generated ethereal user
      pass: "Barishal169169", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: SENDER, // sender address
    to: RECEIVER, // list of receivers
    subject: "Order Confirmation ✔", // Subject line
    text: `Your Order has been confirmed.`, // plain text body
    html: `<b>Patient Information</b> 
      <ul>
        <li><b>Name</b>:${CustomerData.firstname}</li>
        <li><b>Gender</b>:${CustomerData.gender}</li>
        <li><b>Phone</b>:${CustomerData.phone}</li>
        <li><b>Address</b>:${CustomerData.address}</li>
        <li><b>Problem Description</b>:${CustomerData.description}</li>
      </ul>
      <b>Service Provider Information</b> 
      <ul>
        <li><b>Name</b>:Dry Expressd</li>
        <li><b>Address</b>:68-Namronel,Banani DOHS,Dhaka.</li>
      </ul>
    `
  });

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
   res.redirect(`/admin/order-view?id=${CustomerData._id}&success=true`);
       
   } catch (error) {
       console.log("this is error part" +error)

   }
   
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

})


// demo-start--------------------------------------
router.get("/demo/", async(req,res)=>{
   res.render('demo');
});
router.get("/demo-login/", async(req,res)=>{
    res.render('demo-login');
 });
router.get("/quiz/", async(req,res)=>{
    res.render('quiz');
 });


router.post("/demo/", async(req,res)=>{
    const demo = new Demo({ 
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        password:req.body.password
   });

try {
    
 const saveDemo = await demo.save();

} 
catch (error) {
  res.send(error)
 // res.json({message: error}) 
 }  
    res.render('demo-login');
 });


 // customer login- functionality----------------
router.post("/demo-login", async(req, res)=>{
    
    const errorMsg = "Invalid Login!!";
    const wrongkeyword =  "Wrong Keywords!!";
    
    try {
        const email  = req.body.email;
        const password  = req.body.password;
        if(email === "" || password === ""){
            res.render("demo-login",{emptyMsg:"Field is required!!"})
        }
        else{
             
            const userData = await Demo.findOne({email:email});
            // macthing database password and user input password by bycriptjs--------------------
             console.log(userData.password)
            if(userData.password === password){

            const logSuccMsg ="welcome"
            res.redirect('/admin/quiz');
       
        }
        else{
            res.render("demo-login",{wrongkeyword});
        }

        }
    
        
    } catch (error) {
        res.send("checkout",{errorMsg});
    }
});

// demo-end--------------------------------------




router.get("/home")
module.exports =  router;







