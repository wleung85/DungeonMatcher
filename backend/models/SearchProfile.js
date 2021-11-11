const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SearchProfileSchema = new mongoose.Schema({
  matched: {
    type: [{type: Schema.Types.ObjectId, ref: 'SearchProfile'}],
  },
  unmatched: {
    type: [{type: Schema.Types.ObjectId, ref: 'SearchProfile'}],
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
    default: false
  }
},
{timestamps: true});

module.exports = mongoose.model("SearchProfile", SearchProfileSchema);