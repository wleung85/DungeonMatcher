const Conversation = require("../models/Conversation");
const User = require("../models/User");
const router = require('express').Router();

// create a group conversation
// TODO: user authentication
router.post('/create', async (req, res) => {
  try {
    if (!("usersTba" in req.body) || req.body.usersTba.length === 0) {
      return res.status(500).json({message: "No passed in users to add."});
    } 

    // Remove duplicates and add calling user to list. Sort list so users in 
    // Conversation model are always listed in alphabetical order
    req.body.usersTba = [...new Set([req.body.userId, ...req.body.usersTba])].sort();
    
    if (req.body.usersTba.length < 2 || req.body.usersTba.length > 50) {
      return res.status(500).json({message: "Group conversations can have at maximum 50 members"});
    }
    
    // Check if conversation with same members already exists
    const existingConvos = await Conversation.find({users: req.body.usersTba});
    if (existingConvos !== null) {
      if (req.body.usersTba.length == 2) {
        const filteredExistingConvos = existingConvos.filter((convo) => convo.type === 'pair' && convo.active === true);
        if (filteredExistingConvos.length > 0) {
          return res.status(500).json({message: "Found existing direct conversations with same members",
                                       conversations: filteredExistingConvos[0]})
        }
      }
      else {
        return res.status(500).json({message: "Found existing group conversations with same members",
                                     conversations: existingConvos[0]})
      }
    } 

    // Verify all users are related to currentUser either through friends or in an active conversation
    const currentUser = await User.findById(req.body.userId);
    const allUserConvos = await Conversation.find({users: req.body.userId, active: true}, {users: 1})
    const relatedUsers = new Set(allUserConvos.map((convo) => convo.users.map((id) => id.toString())).flat());
    for (const userTba of req.body.usersTba) {
      if (!currentUser.friends.includes(userTba) && 
          !relatedUsers.has(userTba) &&
          userTba !== req.body.userId) {
        return res.status(500).json({message: "No relation with user found",
                                     user: userTba});
      }
    }

    // Create conversation, if pair and conversation is inactive instead 
    // make it active
    if (req.body.usersTba.length > 2) {
      const newConversation = await new Conversation({
        users: [req.body.usersTba],
        type: 'group',
        parentType: 'group'
      })
  
      const conversation = await newConversation.save();
      return res.status(200).json(conversation);
    } else if (existingConvos === null) {
      const newConversation = await new Conversation({
        users: [req.body.usersTba],
        type: 'pair',
        parentType: 'group'
      })
  
      const conversation = await newConversation.save();
      return res.status(200).json(conversation);
    } else {
      // Change pre-existing inactive conversation to active
      const conversation = await Conversation.findOneAndUpdate({users: req.body.usersTba, 
                                                                type: 'pair', 
                                                                active: false}, 
                                                               {active: true});
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