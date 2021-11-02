const mongoose = require('mongoose');
const SearchProfile = require("../models/SearchProfile");

const AdventureSchema = new mongoose.Schema({
  gameMaster: {
    type: ObjectId,
    required: True
  },
  name: {
    type: String,
    required: True
  }
},
{timestamps: true});

module.exports = SearchProfile.discriminator("Adventure", AdventureSchema);