const Conversation = require("../models/Conversation");
const User = require("../models/User");
const router = require('express').Router();

const verifyRelations = async (userId, usersTba) => {
  const currentUser = await User.findById(userId);
  const allUserConvos = await Conversation.find({users: userId, active: true}, {users: 1})
  const relatedUsers = new Set(allUserConvos.map((convo) => convo.users.map((id) => id.toString())).flat());
  for (const userTba of usersTba) {
    if (!currentUser.friends.includes(userTba) && 
        !relatedUsers.has(userTba) &&
        userTba !== req.body.userId) {
      throw {message: "No relation with user found",
             user: userTba};
    }
  }
}

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
    console.log(existingConvos);
    if (existingConvos !== null && existingConvos.length !== 0) {
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
    await verifyRelations(req.body.userId, req.body.usersTba);

    if (req.body.usersTba.length > 2) {
      // Creating group conversation
      const newConversation = await new Conversation({
        users: req.body.usersTba,
        chatAdmins: [req.body.userId],
        type: 'group',
        parentType: 'group'
      })
  
      const conversation = await newConversation.save();
      return res.status(200).json(conversation);
    } else if (existingConvos === null) {
      // Creating pair conversation
      const newConversation = await new Conversation({
        users: req.body.usersTba,
        type: 'pair',
        parentType: 'group',
      })
  
      const conversation = await newConversation.save();
      return res.status(200).json(conversation);
    } else {
      // Change pre-existing inactive pair conversation to active
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

// Add user(s) to chat
// TODO: User authentication
router.put('/:id/addUsers', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation.includes(req.body.userId)) {
      return res.status(500).json({message: "You are not a part of this conversation!"});
    } else if (conversation.type !== 'group') {
      return res.status(500).json({message: "Users can only be added to group chats."});
    } else if (conversation.anyoneCanAdd === true || 
               !conversation.chatAdmins.includes(req.body.userId)) {
      return res.status(500).json({message: "You are not allowed to add users to this covnersation."});
    } else {
      // Check if user is related to every member to be added
      await verifyRelations(req.body.userId, req.body.usersTba);

      // Check if total number of users after adding is <= 50
      const newUserArr = [new Set(...conversation.users, ...req.body.usersTba)];
      if (newUserArr.length > 50) {
        return res.status(500).json({message: "Group conversations are limited to 50 members."})
      } else {
        conversation.users = newUserArr;
        await conversation.save();

        // TODO: emit event to those added to group
        return res.status(200).json(conversation);
      }      
    }

  } catch (err) {
    return res.status(500).json({message: err.message});
  }

});

// Leave conversation
// TODO: user authentication
router.put('/:id/leave', async (req, res) => {
  try {
    const conversation = await Conversation.
      findById(req.params.id).
      populate('users', 'friends');
    if (conversation === null) {
      return res.status(500).json({message: "No conversation found."});
    } else if (!conversation.users.some((user) => user._id.toString() === req.body.userId)) {
      return res.status(500).json({message: "User not in conversation"});
    } else if (conversation.active === false) {
      return res.status(500).json({message: "Conversation is inactive"});
    } else if (conversation.type === 'solo') {
      return res.status(500).json({message: "Cannot leave solo conversation"});
    } else if (conversation.type === 'pair') {
      // Can't leave conversation if it's a pair conversation between friends
      if (conversation.users[0].friends.includes(conversation.users[1]._id)) {
        return res.status(500).json({message: "Cannot leave direct message between friends"});
      } else {
        // Leaving pair conversation by setting as inactive
        // TODO: how to rejoin such a conversation
        conversation.active = false;
        await conversation.save();
        return res.status(200).json({message: "Pair conversation made inactive"});
      }
    } else {
      await Conversation.findByIdAndUpdate(req.params.id, {$pull: {users: req.body.userId}});
      return res.status(200).json({message: "Left conversation"});
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