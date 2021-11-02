const mongoose = require('mongoose');
const SearchProfile = require("../models/SearchProfile");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 15
  },
  profilePicture: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  friends: {
    type: Array,
    default: []
  },
  friendsInviteSent: {
    type: Array,
    default: []
  },
  friendsInviteReceived: {
    type: Array,
    default: []
  },
  blocked: {
    type: Array,
    default: []
  },
  authoredAdventures: {
    type: Array,
    default: []
  },
  conversations: {
    type: Array,
    default: []
  },
});

module.exports = SearchProfile.discriminator("User", UserSchema);