const Conversation = require("../models/Conversation");
const User = require("../models/User");
const router = require('express').Router();

// create a group conversation
// TODO: user authentication
router.post('/create', async (req, res) => {
  try {
    if (!("usersTba" in req.body)) {
      return res.status(500).json({message: "No passed in users to add."});
    } else {
      req.body.usersTba = [...new Set(req.body.usersTba)];
      const currUserIdx = req.body.usersTba.indexOf(req.body.userId);
      if (currUserIdx > -1) {
        req.body.usersTba.splice(currUserIdx, 1);
      }
    }
    
    if (req.body.usersTba.length < 2) {
      return res.status(500).json({message: "Group conversation can only be created with at least 3 members"});
    } else if (req.body.usersTba.length > 49) {
      return res.status(500).json({message: "Group conversations can have at maximum 50 members"});
    } else {
      const existingConvos = await Conversation.find({users: {$all: [req.body.userId, ...req.body.usersTba]}})
      if (existingConvos !== null) {
        const filteredExistingConvos = existingConvos.filter((convo) => convo.users.length === (req.body.usersTba.length + 1));
        if (filteredExistingConvos.length > 0)
          return res.status(500).json({message: "Found existing group conversations with same members",
                                       conversations: filteredExistingConvos})
      } 

      // Verify all users are related to currentUser either through friends or in an active conversation
      const currentUser = await User.findById(req.body.userId);
      const allUserConvos = await Conversation.find({users: req.body.userId}, {users: 1})
      const relatedUsers = new Set(allUserConvos.map((convo) => convo.users.map((id) => id.toString())).flat());
      for (const userTba of req.body.usersTba) {
        if (!currentUser.friends.includes(userTba) && !relatedUsers.has(userTba)) {
          return res.status(500).json({message: "No relation with user found",
                                       user: userTba});
        }
      }

      const newConversation = await new Conversation({
        users: [req.body.userId, ...req.body.usersTba],
        type: 'group',
        parentType: 'group'
      })

      const conversation = await newConversation.save();
      return res.status(200).json(conversation);
    }
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
});

router.post('/debugCreate', async (req, res) => {
  try {
    const newConversation = await new Conversation({
      users: req.body.usersTba,
      type: 'group',
      parentType: 'group'
    });

    const conversation = await newConversation.save();
    return res.status(200).json(conversation);

  } catch (err) {
    return res.status(500).json({message: err.message})
  }
});

module.exports = router;