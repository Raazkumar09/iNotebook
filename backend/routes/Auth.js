const express = require('express');
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'Raazkumar'
//Route 1 : Create a user using : POST "/api/auth/createuser". Doesnt require authentication
router.post('/createuser',[
    body('name', "Enter a valid Name").isLength({ min: 3 }),
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Password must be atleast 8 characters").isLength({ min: 8 }),

], async (req, res) =>{
  let success = false;
  //If there are errors,return bad requests and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    //Check wether the email exists already
    try {
      
    let user = await User.findOne({email : req.body.email});
    if(user){
      return res.status(400).json({success, error : "Sorry a user with this mail already exists"})
    }
    
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
        name: req.body.name,
        password: secPass,
        email : req.body.email
      });
    
    const data = {
      user : {
        id : user.id
      }
    }  
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({success, authToken})
      // .then(user => res.json(user))
      // .catch(err => {console.log(err)
      //  res.send({error : 'Please enter a unique value', message : err.message})})
      // console.log(jwt_data)

  } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
  }
})

//Route 2 : Authenticate a user using : POST "/api/auth/login". No login required

router.post('/login',[
  body('email', "Enter a valid Email").isEmail(),
  body('password', "Password cannot be Empty").exists(),
], async (req, res) =>{
    let success = false;
    //If there are errors,return bad requests and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    try {
      let user = await User.findOne({email});
      if(!user){
        success = false;
        return res.status(400).json({success, error: "Please try to login with correct credentials"})
      }

      const passwordcompare = await bcrypt.compare(password, user.password);
      if(!passwordcompare){
        success = false;
        return res.status(400).json({success, error: "Please try to login with correct credentials"})
      }

      const data = {
        user : {
          id : user.id
        }
      }  
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken})
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
})

//Route 3 : get logged-in user details : POST "/api/auth/getuser". login required
router.post('/getuser', fetchuser, async (req, res) =>{
try {
  userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  res.send(user);
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
}
})
module.exports = router