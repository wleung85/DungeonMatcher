const router = require('express').Router();
const User = require("../models/User");
const UserToken = require("../models/UserToken");
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
    { userId: user.userId, isAdmin: user.isAdmin }, 
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m"});
}

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.userId, isAdmin: user.isAdmin }, 
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

    const userPayload = {userId: user._id, isAdmin: user.isAdmin}
    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);
    UserToken.create({ userId: user._id, refreshToken: refreshToken }, (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(200).json({accessToken: accessToken, refreshToken: refreshToken});
    });    
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
  if (!refreshToken) return res.status(400);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(403);
    const userTokenDoc = await UserToken.findOne({ refreshToken: refreshToken });
    if (!userTokenDoc) return res.status(404).json({message: "No refresh token on server found"});
    if (userTokenDoc.userId.toString() !== user.userId) return res.status(403).json({message: "Refresh token does not belong to passed in UserId"});
    
    // If everything is okay, create new access token
    const newAccessToken = generateAccessToken(user);
    res.status(200).json({accessToken: newAccessToken});
  })
});

// LOGOUT
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Delete all refresh tokens that belong to user
    await UserToken.deleteMany({user: req.user.userId});

    res.status(200).json("Successfully logged out");
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

module.exports = router;
