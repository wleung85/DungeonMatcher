const User = require("../models/User");
const router = require('express').Router();
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/authenticate');


// update user
router.put("/:id", authenticateToken, async (req, res) => {
  if (req.user.userId === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json({message: err.message});
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json({message: "Account has been updated"});
    } catch (err) {
      return res.status(500).json({message: err.message});
    }
  } else {
    return res.status(403).json({message: "You can update only your account"});
  }
});

// delete user
router.delete("/:id", authenticateToken, async (req, res) => {
  if (req.user.userId === req.params.id || req.user.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json({message: "Account has been deleted"});
    } catch (err) {
      console.log(err);
      return res.status(500).json({message: err.message});
    }
  } else {
    return res.status(403).json({message: "You can delete only your account"});
  }
});

// get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user === null) {
      return res.status(404).json({message: "Specified user not found"});
    }
    else {
      const {password, updatedAt, blocked, conversations, matched, unmatched, 
        parentType, ...other} = user._doc;
      res.status(200).json(other);
    }
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// friend a user
// TODO: check if user is blocked
router.put("/:id/friend", authenticateToken, async (req, res) => {
  if (req.user.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.userId);
      if (user.friends.includes(req.user.userId)) {
        res.status(403).json({message: "You are already friends with this user"});
      } else if (currentUser.blocked.includes(req.user.userId)) {
        res.status(403).json({message: "Cannot send friend request to blocked user"});
      } else if (user.friendsInviteSent.includes(req.user.userId)) {
        // Accepting friend request
        // Matching user found in other user's matchesPending, move to matches
        await user.updateOne({$pull: {friendsInviteSent: req.user.userId},
          $push: {friends: req.user.userId}});
        
        await currentUser.updateOne({$push: {friends: req.params.id}});

        // TODO: Create pairConversation if doesn't already exist, set active if it does
        res.status(200).json({message: "Friend added"});
      } else if (currentUser.friendsInviteSent.includes(req.params.id)) {
        res.status(403).json({message: "Friend invite already sent"});
      } else {
        // Add to friends pending
        await currentUser.updateOne({$push: {friendsInviteSent: req.params.id}})
        
        if (!user.blocked.includes(req.user.userId)) 
          await user.updateOne({$push: {friendsInviteReceived: req.user.userId}});
        res.status(200).json({message: "Friend invite sent"});
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({message: err.message});
    }
  } else {
    res.status(403).json({message: "You can't friend yourself"});
  }
});

// unfriend a user
router.put("/:id/unfriend", authenticateToken, async (req, res) => {
  if (req.user.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.userId);
      if (currentUser.friendsInviteSent.includes(req.params.id)) {
        await currentUser.updateOne({$pull: {friendsInviteSent: req.params.id}});
        await user.updateOne({$pull: {friendsInviteReceived: req.user.userId}});
        res.status(200).json({message: "Removed friend invite"});
      } else if (user.friendsInviteSent.includes(req.user.userId)) {
        await user.updateOne({$pull: {friendsInviteSent: req.params.id}});
        await currentUser.updateOne({$pull: {friendsInviteReceived: req.user.userId}});
        res.status(200).json({message: "Rejected friend request"});
      } else if (user.friends.includes(req.user.userId)) {
        await user.updateOne({$pull: {friends: req.user.userId}});
        await currentUser.updateOne({$pull: {friends: req.params.id}});
        // TODO: mark pairConversation as inactive
        res.status(200).json({message: "Removed friend"});
      } else {
        res.status(403).json({message: "User is not (pending) friend."});
      }
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  } else {
    res.status(403).json({message: "You can't unfriend yourself"});
  }
});

// block a user
router.put("/:id/block", authenticateToken, async (req, res) => {
  if (req.user.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.userId);
      if (currentUser.blocked.includes(req.params.id)) {
        res.status(403).json({message: "User already blocked"});
      } else if (currentUser.friends.includes(req.params.id) || 
          currentUser.friendsInviteSent.includes(req.params.id)) {
        res.status(403).json({message: "You cannot block a friend or someone who a friend invite was sent. Unblock user first."});
      } else {
        await currentUser.updateOne({$push: {blocked: req.params.id}});
        res.status(200).json({message: "User blocked"});
      } 
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  } else {
    res.status(403).json({message: "You can't block yourself"});
  }
})


module.exports = router;
