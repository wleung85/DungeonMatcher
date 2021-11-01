const mongoose = require('mongoose');

const Adventure = new mongoose.Schema({
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

module.exports = mongoose.model("Adventure", Adventure);