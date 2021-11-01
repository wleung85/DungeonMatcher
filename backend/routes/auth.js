const router = require('express').Router();
const User = require("../models/User");
const SearchProfile = require("../models/SearchProfile");
const bcrypt = require('bcrypt');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    // Generate hashed password
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    // save user and respond
    const user = await newUser.save();

    const newSearchProfile = await new SearchProfile({
      parent: user._id,
      parentType: 'user'
    });
    await newSearchProfile.save();

    res.status(200).json(user);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user)
      return res.status(404).json("User not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return res.status(400).json("Wrong password");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
  
})

module.exports = router;
