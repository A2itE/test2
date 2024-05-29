
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const app = express();
app.use(express.json())

const PORT = 8080

mongoose.connect(process.env.MONGODBURI).then(()=>{console.log("connected to the database")}).catch((err)=>{console.log("error while connecting to the database", err)});


const userSchema = mongoose.Schema({
    
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        password: {
            type: String,
            require: true
        },
        city: {
            type: String,
            require: true
        },
        isAdmin:{
            type: Boolean,
            default: false
        }
    
    }, {
        timestamps: true
    })

    const userModel = mongoose.model("users", userSchema);



// register 
app.post(("/signup"), async(req, res, next)=>{
    
    try {
      //getting all the data from the user
      const { name, email, password, city, isAdmin } = req.body;
 
      //checking if the user is already present in the database or not!!
      const user = await userModel.findOne({email: email});
  
      //if user already present
      if(user){
          return res.send("user already registered, Try again with different email");
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const newUser = new userModel({
          name: name,
          email: email,
          password: hashPassword,
          city: city,
          isAdmin: isAdmin
      });
      await newUser.save();
      return res.json({
          message: "User regestered Successfully",
          data : newUser,
          status: "success"
      })
  
  
    } catch (error) {
     return res.status(500).send("Regester error" + error);
    }
 
 }
 )  
 
 //server
app.get(("/"), (req, res)=>{
    return res.send("conected to the server ! goood!!!1")
})
app.listen(PORT, (req, res)=>{
   
    console.log("server is running")
});