const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    // Generate hashed password
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      parentType: 'user',
    });

    // save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch(err) {
    res.status(500).json({message: err.message});
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user)
      return res.status(404).json({message: "User not found"});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return res.status(400).json({message: "Wrong password"});

    const accessToken = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN_SECRET);
    res.status(200).json({accessToken: accessToken});
  } catch (err) {
    console.log(err);
    res.status(500).json({message: err.message});
  }
  
})

module.exports = router;
