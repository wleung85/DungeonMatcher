const mongoose = require('mongoose');

const SearchProfile = new mongoose.Schema({
  matched: {
    type: Map,
    default: {},
  },
  unmatched: {
    type: Map,
    default: {},
  },
  parent: {
    type: mongoose.ObjectId,
    required: true
  },
  parentType: {
    type: String,
    enum: ['user', 'group', 'adventure'],
    required: true
  },
  lastSearchDate: {
    type: Date,
    default: () => Date.now(),
  },
  searchable: {
    type: Boolean,
    default: true
  }
},
{timestamps: true});

module.exports = mongoose.model("SearchProfile", SearchProfile);