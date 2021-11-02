const mongoose = require('mongoose');

const SearchProfileSchema = new mongoose.Schema({
  matched: {
    type: Array,
    default: [],
  },
  unmatched: {
    type: Array,
    default: [],
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

module.exports = mongoose.model("SearchProfile", SearchProfileSchema);