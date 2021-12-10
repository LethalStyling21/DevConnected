const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

//@route GET api/auth
//access public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});
//@route Post api/auth
//@desc auth user & get token
//access public
router.post(
  "/",
  [
    check("password", "Password required ").notEmpty(),
    check("email", "enter a valid email").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const { email, password } = req.body;
    // see if user exists
    try {
      let user = await User.findOne({ email });
      if (!user) {
        //  const errors = [{message:"invalid cridentials"}]
        //return res.status(400).json({ errors: errors.array() });
      return  res.status(400).json({ errors: [{ message: "Invalid Cridentials" }] });
    }

      //matching pass

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        //using the same message invalid cridential , is a security feature , so someone cannot identify if the password is
        //incorrect or the user does not exist
      //  const errors = [{message:"invalid cridentials"}]
       //return res.status(400).json({ errors: errors.array() });
       return res.status(400).json({ errors: [{ message: "Invalid Cridentials" }] });
      }
      //return token
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtToken"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
     return  res.status(500).send("SERVER error");
    }
  }
);
module.exports = router;
