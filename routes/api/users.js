const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const config=require('config');

const {check,validationResult} = require('express-validator');

const User = require ('../../models/user');
//@route Post api/users
//@desc register user
//access public
router.post('/', 
[check('name', 'Names is required')
.not()
.isEmpty(),
check('email', 'enter a valid email').isEmail(),
check('password', '6 characters at least').isLength({min : 6})
],
async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {name , email , password , } = req.body ; 
 // see if user exists 
    try {
    let user = await User.findOne({email})    ;
    if (user){
        res.status(400).json({errors : [{message : 'USer already exists'}]});  
        
    }
   
   

    //get user gravatar 
    const avatar = gravatar.url(email,{
        s:'200',
        r:'pg',
        d:'mm'
    })
    user = new User({
        name ,
        email,
        avatar,
        password
    })

    //encrypt password 
const salt = await bcrypt.genSalt(10);
user.password= await bcrypt.hash(password, salt);
await user.save();
    //return token 
    const payload = {
        user:{
            id : user.id
        }
    }
    jwt.sign(payload, 
    config.get('jwtToken'),
    {expiresIn:360000},
    (err, token)=> {
        if (err) throw err ;
        res.json({token});
    }
    );

} catch (error) {
      console.error(error.message)  ;
      res.status(500).send('SERVER error');
}
});


module.exports  = router;