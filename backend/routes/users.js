const User = require("../models/User");
const router = require('express').Router();
const bcrypt = require('bcrypt');

// TODO: We want only user logging in to be able to update and delete

// update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account")
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account")
  }
});

// get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const {password, updatedAt, ...other} = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// friend a user
router.put("/:id/friend", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.friends.has(req.body.userId)) {
        res.status(403).json("You are already friends with this user");
      } else if (user.friendsInviteSent.has(req.body.userId)) {
        // Accepting friend request
        user.friendsInviteSent.delete(req.body.userId);
        user.friends.set(req.body.userId, "");
        await user.save();
        
        currentUser.friendsInviteReceived.delete(req.params.id);
        currentUser.friends.set(req.params.id, "");
        await currentUser.save();

        // TODO: Create pairConversation if doesn't already exist, set active if it does
        res.status(200).json("Friend added");
      } else if (currentUser.friendsInviteSent.has(req.params.id)) {
        res.status(403).json("Friend invite already sent");
      } else {
        // Add to friends pending
        currentUser.friendsInviteSent.set(req.params.id, "");
        await currentUser.save();
        
        if (!user.blocked.has(req.body.userId)) 
          user.friendsInviteReceived.set(req.body.userId, "");
          await user.save();
        res.status(200).json("Friend invite sent");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't friend yourself");
  }
});

// unfriend a user
// TODO try using set
router.put("/:id/unfriend", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (currentUser.friendsInviteSent.has(req.params.id)) {
        currentUser.friendsInviteSent.delete(req.params.id);
        user.friendsInviteReceived.delete(req.body.userId);
        await currentUser.save();
        await user.save();
        res.status(200).json("Removed friend invite");
      } else if (user.friendsInviteSent.has(req.body.userId)) {
        await user.friendsInviteSent.delete(req.params.id);
        await currentUser.friendsInviteReceived.delete(req.body.userId);
        await currentUser.save();
        await user.save();
        res.status(200).json("Rejected friend request");
      } else if (user.friends.has(req.body.userId)) {
        await user.friends.delete(req.body.userId);
        await currentUser.friends.delete(req.params.id);
        await currentUser.save();
        await user.save();
        // TODO: mark pairConversation as inactive
        res.status(200).json("Removed friend");
      } else {
        res.status(403).json("User is not (pending) friend.");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't unfriend yourself");
  }
});

// block a user
router.put("/:id/block", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (currentUser.blocked.has(req.params.id)) {
        res.status(403).json("User already blocked");
      } else if (currentUser.friends.has(req.params.id) || 
          currentUser.friendsInviteSent.has(req.params.id)) {
        res.status(403).json("You cannot block a friend or someone who a friend invite was sent. Unblock user first.")
      } else {
        await currentUser.blocked.set(req.params.id);
        // TODO: Remove user from friends and set pairConversation as inactive
        await currentUser.save();
        res.status(200).json("User blocked");
      } 
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't block yourself");
  }
})


module.exports = router;
