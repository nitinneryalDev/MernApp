const { error } = require("console");
const express = require("express");
const User = require("../models/userSchema");
const jwt = require('jsonwebtoken')


const bcrypt = require('bcrypt')
const router = express.Router();
const app = express();
const authenticate = require("../middlwear/authenticate") 

require("../db/conn");



router.post("/register", async (req, res) => {
  const { name, email, password, phone, work, cpassword } = req.body;

  if (!name || !email || !password || !phone || !work || !cpassword) {
    return res.status(422).json({ error: "PLZ fill the field property" });
  }

  try {
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      return res.status(422).json({ error: "Email already Exists" });
    } else if ( password !== cpassword ) {
      return  res.status(422).json({error:"password are not matching"})
    } else {
        const user = new User({ name, email, phone, work, password, cpassword }); 
        await user.save();
        res.status(201).json({ message: "User rejistered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});


// login route 
router.post('/signin' ,async (req , res) => {
try{
   let token;
    const { email , password  } = req.body; 
if(!email || !password) {
    return res.status(400).json({error:"Plz fill the data "})
}
const userLogin = await  User.findOne({email:email});
 
if(userLogin) {
    const isMatch = await bcrypt.compare(password , userLogin.password );
    token = await userLogin.generateAuthToken();
    res.cookie("jwtoken" , token , {
        expires:new Date(Date.now() + 25892000000 ) ,
        httpOnly:true
    } )
    if(!isMatch) { 
        res.status(400).json({ error: 'Invalid Credentials' });
    }else {
        res.json({ message: 'user signin successfully' });
    
    }  }  else {
        res.status(400).json({ error: 'Invalid Credentials' });

    } } catch(err) {
        console.log(err)
    }
})

// About Us Page
router.get("/about", authenticate ,(req, res) => {
  res.send(req.rootUser);
});

// getting user Data for contact us and home Page
router.get("/getData", authenticate ,(req, res) => {
  console.log('Hello getData  '  , req.rootUser)
  res.send(req.rootUser);
});


//  contact us and  Page
router.post("/contact", authenticate , async (req, res) => {

 try {
   const {name , email , phone , message  } = req.body;

   console.log ('from inside the contact route in auth', req.body)

       if(!name || !email || !phone || !message   ) {

    return res.status(400).json({error:"plzz filled the contact form"})
}

const userContact  = await User.findOne({_id:req.userID});

if(userContact){
  const userMessage = await userContact.addMessage(name , email , phone , message) ;
  await userContact.save();

  res.status(201).json( {message:"user Contact successfully"})
} else {
  return res.status(404).json({error:"User not Found"})
}



 } catch(error) {
     console.log("Error in the contact route" , error )
     return res.status(500).json({error:"Internal Server Error"})
 }
});


// Logout  Page
router.get("/logout",(req, res) => {
  console.log('user Logout')
  res.clearCookie("jwtoken" , {path:"/"})
  res.status(200).send("User Logout");
});




module.exports = router;


