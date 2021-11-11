const mongoose = require('mongoose');
const SearchProfile = require("../models/SearchProfile");
const Schema = mongoose.Schema;

const AdventureSchema = new mongoose.Schema({
  gameMaster: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  storyHook: {
    type: String,
  },
  ttSystem: {
    type: String,
    enum: ['D&D 5e', 'D&D 3.5e', 'Pathfinder 1', 'Pathfinder 2e', 
    'Call of Cthulu', 'Shadowrun', 'Starfinder', 'Star Wars RPG', 
    'Blades in the Dark', 'Vampire: The Masquerade', 'Other'],
  },
  minPlayers: {
    type: Number,
    default: 1
  },
  maxPlayers: {
    type: Number
  },
  numSessions: {
    type: Number,
    default: 1
  },
  costPer: {
    type: Number,
    default: 0
  },
  costPerType: {
    type: String,
    enum: ['session', 'adventure'],
    default: "session"
  },
},
{timestamps: true});

module.exports = SearchProfile.discriminator("Adventure", AdventureSchema);