const mongoose = require('mongoose');

const Conversation = new mongoose.Schema({
  users: {
    type: Map,
    default: {},
  },
  type: {
    type: String,
    enum: ['solo', 'pair', 'group'],
    required: True
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

module.exports = mongoose.model("Conversation", Conversation);