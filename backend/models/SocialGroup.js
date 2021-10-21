const mongoose = require('mongoose');

const SocialGroup = new mongoose.Schema({
  users: {
    type: Array,
    required: true,
    max: 20
  },
  matches: {
    type: Map,
    default: {},
  },
  matchesPending: {
    type: Map,
    default: {},
  },
  unmatched: {
    type: Map,
    default: {},
  },
  socialType: {
    type: String,
    enum: ['userSolo', 'userPair', 'group', 'adventure'],
    required: True
  },
  conversation: {
    type: ObjectId,
  },
  lastSearchDate: {
    type: Date,
  }
},
{timestamps: true});

module.exports = mongoose.model("SocialGroup", SocialGroup);