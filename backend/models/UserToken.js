const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserTokenSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("UserToken", UserTokenSchema);