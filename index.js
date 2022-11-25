 const express = require("express");
 const cors = require("cors");
 const bodyParser = require("body-Parser");
 const helmet = require("helmet");
 require ("dotenv").config();
 const mongoose = require("mongoose");
 const User = require ("./models/User");
 const { connect } = require("http2");
 const { title } = require("process");


 const app = express();

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(helmet());

  const uri = process.env.DB_URI;

  mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on("connected", () => {
    console.log("Connected to database");
  });

  app.post("/user", async (req, res)=>{
    const newUser = new User ({
      email: req.body.email,
      userName: req.body.userName,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
    });
    const responseFromDB = await newUser.save();

    res.status(200).json({
      message : "User created Siccessfully",
      success: true,
      responseFromDB
    });
  });

  app.get ("/user", async (req, res)=>{
    console.log("GET request received");
    const user = await User.find();

    res.status(200).json({
      message: "User fetched successfully",
      success: true,
      user,
    });
  });

  app.put("/user/:id", async (req, res)=>{
   const id = req.params.id;

    const responseFromDB = await User.findByIdAndUpdate(id,
    { email: req.body.email,
      userName: req.body.userName,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber
    },
    { new: true,}
    
    );
    res.status(200).json({
      Massage: "User Data Updated Successfully",
      success: true,
      responseFromDB,
    });

  });

    app.delete("/user/:id", async(req, res)=>{
      const id = req.params.id;
      const responseFromDB = await User.findByIdAndDelete(id);
      res.status(200).json({
        Massage: "This Data was Deleted Successfully",
        success: true,
        responseFromDB,
      });

    });

    app.listen(4000, ()=>{
      console.log("Server is running on port http://localhost:4000");
    });
