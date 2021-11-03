const mongoose = require('mongoose');
const SearchProfile = require("../models/SearchProfile");
const Schema = mongoose.Schema;

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
    type: [{type: Schema.Types.ObjectId, ref: 'User'}],
  },
  friendsInviteSent: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}],
  },
  friendsInviteReceived: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}],
  },
  blocked: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}],
  },
  authoredAdventures: {
    type: [{type: Schema.Types.ObjectId, ref: 'Adventure'}],
  },
  conversations: {
    type: [{type: Schema.Types.ObjectId, ref: 'Conversation'}],
  },
});

module.exports = SearchProfile.discriminator("User", UserSchema);