const mongoose = require('mongoose');

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
    type: Map,
    default: {}
  },
  friendsInviteSent: {
    type: Map,
    default: {}
  },
  friendsInviteReceived: {
    type: Map,
    default: {}
  },
  blocked: {
    type: Map,
    default: {}
  },
  authoredAdventures: {
    type: Array,
    default: []
  },
  conversations: {
    type: Array,
    default: []
  },
},
{timestamps: true});

module.exports = mongoose.model("User", UserSchema);