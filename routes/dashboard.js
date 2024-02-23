const router = require("express").Router();
  


router.get('/',(req,res)=>{
    res.json({
        error: null,
        data: {
          user: req.user, // token payload information
        },
      });
    });


 module.exports = router;