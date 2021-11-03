const mongoose = require('mongoose');
const SearchProfile = require("../models/SearchProfile");
const Schema = mongoose.Schema;

const ConversationSchema = new mongoose.Schema({
  users: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}],
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