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

// match a user
router.put("/:id/match", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.friends.includes(req.body.userId)) {
        res.status(403).json("You are already friends with this user");
      } else if (user.matches.includes(req.body.userId)) {
        res.status(403).json("You have already matched this user");
      } else if (currentUser.matchesPending.includes(req.params.id)) {
        res.status(403).json("You have already tried to match this user");
      } else if (user.matchesPending.includes(req.body.userId)) {
        // Matching user found in other user's matchesPending, move to matches
        await user.updateOne({$pull: {matchesPending: req.body.userId},
                              $push: {matches: req.body.userId}});
        await currentUser.updateOne({$push: {matches: req.params.id}});
        res.status(200).json("Match found");
      } else {
        // Add to matches pending
        await currentUser.updateOne({$push: {matchesPending: req.params.id}});
        res.status(200).json("Attempted match processed");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't match yourself");
  }
});

// unmatch a user
router.put("/:id/unmatch", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (currentUser.unmatched.includes(req.params.id)) {
        res.status(403).json("User is already unmatched");
      } else {
        await user.updateOne({$pull: {matches: req.body.userId}});
        await currentUser.updateOne({$pull: {matchesPending: req.params.id,
                                           matches: req.params.id},
                                     $push: {unmatched: req.params.id}});
      }
      res.status(200).json("Unmatched user");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't unmatch yourself");
  }
});

// friend a user
router.put("/:id/friend", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.friends.includes(req.body.userId)) {
        res.status(403).json("You are already friends with this user");
      } else if (user.friendsPending.includes(req.body.userId)) {
        // Matching user found in other user's friendsPending, move to friends
        await user.updateOne({$pull: {matches: req.body.userId,
                                      matchesPending: req.body.userId,
                                      friendsPending: req.body.userId},
                              $push: {friends: req.body.userId}})
        await currentUser.updateOne({$pull: {matches: req.params.id,
                                             matchesPending: req.params.id},
                                     $push: {friends: req.params.id}})
        res.status(200).json("Friend added");
      } else if (currentUser.friendsPending.includes(req.params.id)) {
        res.status(403).json("Friend request already sent");
      } else {
        // Add to friends pending
        await currentUser.updateOne({$push: {friendsPending: req.params.id}});
        res.status(200).json("Attempted friend processed");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't friend yourself");
  }
});

// unfriend a user
router.put("/:id/unfriend", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (currentUser.friendsPending.includes(req.params.id)) {
        await currentUser.updateOne({$pull: {friendsPending: req.params.id}});
        res.status(200).json("Removed pending friend");
      } else if (user.friends.includes(req.body.userId)) {
        await user.updateOne({$pull: {friends: req.body.userId}});
        await currentUser.updateOne({$pull: {friends: req.params.id}});
        res.status(200).json("Removed friend");
      } else {
        res.status(403).json("User is not (pending) friend.");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't unfriend yourself");
  }
});


module.exports = router;
