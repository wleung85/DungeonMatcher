const mongoose = require('mongoose');
const SearchProfile = require("../models/SearchProfile");

const AdventureSchema = new mongoose.Schema({
  gameMaster: {
    type: mongoose.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  }
},
{timestamps: true});

module.exports = SearchProfile.discriminator("Adventure", AdventureSchema);