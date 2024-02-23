const router = require("express").Router();
const User = require("../model/User");
const { registerValidation } = require("../validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



router.post("/register",async (req,res)=>{

    const { error } = registerValidation(req.body);

    if(error){
       return res.sendStatus(400).json({error: error.details[0].message})
    }

    const isEmailExist = await User.findOne({email:req.body.email});

    if(isEmailExist){
        return res.sendStatus(400).json({ error: "Email already exists" });
    }

   const salt = await bcrypt.genSalt(10);
   const password = await bcrypt.hash(req.body.password,salt);


    const user = new User({
        email:req.body.email,
        password
    });
   try {
       const savedUser = await user.save();
       res.json({error:null,data:{userId: savedUser._id}});
   } catch(error){
    res.sendStatus(400).json({error});
   }
});

router.post("/login", async(req,res)=>{

    const { error } = registerValidation(req.body);

    if(error){
      return res.sendStatus(400).json({error:error.details[0].message });
    }

    const user = await User.findOne({email:req.body.email});

    if(!user){
     return res.sendStatus(400).json({error:"Email is wrong"});
    }

    const validPassword = await bcrypt.compare(req.body.password,user.password);

    if(!validPassword) {
        return res.status(400).json({ error: "Password is wrong" });
    }

    const token = jwt.sign(
        // payload data
        {
          name: user.name,
          id: user._id,
        },
        process.env.TOKEN_SECRET
      );
      res.header("auth-token", token).json({
        error: null,
        data: {
          token,
        },
      });

    // res.json({
    //     error: null,
    //     data: {
    //       message: "Login successful",
    //     },
    //   });
    });



module.exports = router;