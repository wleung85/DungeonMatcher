const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/authenticate');

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

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin }, 
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m"});
}

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin }, 
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d"});
}

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user)
      return res.status(404).json({message: "User not found"});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return res.status(400).json({message: "Wrong password"});

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    // TODO: push refresh token to database
    res.status(200).json({accessToken: accessToken, refreshToken: refreshToken});
  } catch (err) {
    console.log(err);
    res.status(500).json({message: err.message});
  }
  
})

// Refresh token
router.post('/token', async (req, res) => {
  // Take refresh token from user
  const refreshToken = req.body.token;

  // Send error if there is no token or is invalid
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    // TODO: if refresh token is not in database, return error

    // If everything is okay, create new access token
    const newAccessToken = generateAccessToken(user);
    res.status(200).json({accessToken: newAccessToken});
  })
});

// LOGOUT
router.post('/logout', authenticateToken, (req, res) => {
  // TODO: find and delete refresh token in database
  res.status(200).json("Successfully logged out");
});

module.exports = router;
