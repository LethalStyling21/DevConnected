const express = require("express");
const router = express.Router();
const request = require("request");
const config = require("config");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Post = require('../../models/post');
const Profile = require("../../models/profile");
const User = require("../../models/user");




//@route GET api/profile/me
// get current users profile
//access private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res
        .status(400)
        .json({ message: "there is no profile for this user" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});
//@route Post api/profile
// desc / create or update profile
//access private
router.post(
  "/",
  [
    auth,
    [
      check("status", "status required").not().isEmpty(),
      check("skills", "skills required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;
    //build prof object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills
        .toString()
        .split(",")
        .map((skill) => skill.trim());
    }
    //building social obj
    profileFields.social = {};
    if (twitter) profileFields.social.twitter = twitter;
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }
      // create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);
//@route get api/profiles
// desc / all profile
//access public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});
//@route get api/profile/user/:user_id
// desc / get profile by id
//access public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile)
      return res.status(400).json([{ message: "profile not found" }]);
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == "ObjectId") {
      res.status(400).json([{ message: "profile not found" }]);
    }
    res.status(500).send("server error");
  }
});
//@route delete api/profile
// desc / delete profile , user , post
//access private
router.delete("/", auth, async (req, res) => {
  try {
    // removing post
    await Post.deleteMany({user:req.user.id})
    // removing profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ message: "user deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});
//@route put api/profile/experience
// desc add experience
//access private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "title required").not().isEmpty(),
      check("company", "company required").not().isEmpty(),
      check("from", " from date required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } =
      req.body;
    const newxp = { title, company, location, from, to, current, description };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newxp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);
//@route delete api/profile/experience
// desc delete experience
//access private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    //get profile
    const profile = await Profile.findOne({ user: req.user.id });
    //get experience index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
    // removing experience
    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});
//@route put api/profile/education
// desc add educatin
//access private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "school required").not().isEmpty(),
      check("degree", "degree required").not().isEmpty(),
      check("from", " from date required").not().isEmpty(),
      //check('to','  date required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { school, degree, from, to, fieldofstudy, current, description } =
      req.body;
    const edu = {
      school,
      degree,
      from,
      to,
      fieldofstudy,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(edu);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);
//@route delete api/profile/education/edu_id
// desc delete education
//access private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    //get profile
    const profile = await Profile.findOne({ user: req.user.id });
    //get experience index
    const removeIndex = profile.education.map((item) => item.id).indexOf(req.params.edu_id);
    // removing experience
    profile.education.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});
//@route get api/profile/github/:username
// desc get github profile
//access public
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:
            asc&client_id=${config.get(
              "githubClientId"
            )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
      }

      if (response.statusCode !== 200) {
        res.status(404).json({ message: "profile not found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});
module.exports = router;
