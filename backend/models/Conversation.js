const mongoose = require('mongoose');
const SearchProfile = require("../models/SearchProfile");

const ConversationSchema = new mongoose.Schema({
  users: {
    type: Array,
    default: [],
  },
  type: {
    type: String,
    enum: ['solo', 'pair', 'group'],
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  messages: {
    type: Array,
    default: []
  },
},
{timestamps: true});

module.exports = SearchProfile.discriminator("Conversation", ConversationSchema);