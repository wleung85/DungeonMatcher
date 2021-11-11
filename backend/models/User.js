const mongoose = require('mongoose');
const SearchProfile = require("../models/SearchProfile");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Can't be blank"],
    min: 3,
    max: 20,
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    index: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Can't be blank"],
    max: 50,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 4,
    max: 20
  },
  profilePicture: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  friends: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}],
  },
  friendsInviteSent: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}],
  },
  friendsInviteReceived: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}],
  },
  blocked: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}],
  },
  authoredAdventures: {
    type: [{type: Schema.Types.ObjectId, ref: 'Adventure'}],
    max: 20,
  },
  conversations: {
    type: [{type: Schema.Types.ObjectId, ref: 'Conversation'}],
  },
  availability: {
    type: Array,
  },
  apLanguages: {
    type: [String],
    enum: ['english', '简体中文', '繁體中文', 'español', 'français'],
    default: ['english']
  },
  apTtSystems: {
    type: [String],
    enum: ['D&D 5e', 'D&D 3.5e', 'Pathfinder 1', 'Pathfinder 2e', 
    'Call of Cthulu', 'Shadowrun', 'Starfinder', 'Star Wars RPG', 
    'Blades in the Dark', 'Vampire: The Masquerade', 'Other'],
    max: 3,
  },
  apAlignments: {
    type: [String],
    enum: ['lawful good', 'neutral good', 'chaotic good', 'lawful neutral', 
    'true neutral', 'chaotic neutral', 'lawful evil', 'neutral evil', 
    'chaotic evil', 'any'],
    max: 3,
  },
  apClasses: {
    type: [String],
    enum: ['spellcaster', 'fighter', 'support', 'cleric', 'tinkerer', 
    'rogue', 'ranger', 'any'],
    max: 3,
  },
  apPlaystyles: {
    type: [String],
    enum: ['actor', 'explorer', 'leader', 'brawler', 'optimizer', 
    'storyteller', 'observer'],
    max: 3,
  },
  apShortBio: {
    type: String
  },
  apAboutMe: {
    type: String
  }
});

module.exports = SearchProfile.discriminator("User", UserSchema);