const Adventure = require("../models/Adventure");
const User = require("../models/User");
const router = require('express').Router();
const { authenticateToken } = require('../middleware/authenticate');

// create an adventure
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const newAdventure = await new Adventure({
      gameMaster: req.user.userId,
      name: req.body.adventureName,
      description: req.body.adventureDescription,
      parentType: 'adventure',
    });

    const adventure = await newAdventure.save();
    await User.findByIdAndUpdate(req.user.userId, {$push: {authoredAdventures: adventure._id}});
    return res.status(200).json(adventure);
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
});

// get an adventure
router.get('/:id', async (req, res) => {
  try {
    const adventure = await Adventure.findById(req.params.id);
    if (adventure === null) {
      return res.status(404).json({message: "Specified adventure not found"});
    }
    else {
      return res.status(200).json(adventure);
    }
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// delete an adventure
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const adventure = await Adventure.findByIdAndDelete(req.params.id);
    if (adventure == null) return res.status(401).json({message: 'No adventure found'});
    if (adventure.gameMaster.toString() !== req.user.userId && !req.user.isAdmin) return res.status(500).json({message: 'User is not author of adventure'});
    await User.findByIdAndUpdate(adventure.gameMaster, {$pull: {authoredAdventures: adventure._id}})
    return res.status(200).json(adventure);
  } catch (err) {
    console.log(err);
    res.status(500).json({message: err.message});
  }
})

// update an adventure
// TODO: user authentication, check if calling user is author of adventure or isAdmin
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.body.gameMaster) {
      // Not allowed to change game Master
      delete req.body.gameMaster;
    }
    const adventure = await Adventure.findById(req.params.id);
    if (adventure == null) return res.status(401).json({message: 'No adventure found'});
    if (adventure.gameMaster.toString() !== req.user.userId && !req.user.isAdmin) return res.status(500).json({message: 'User is not author of adventure'});

    // May be better way to do this by updating adventure and using .save()
    await Adventure.findByIdAndUpdate(req.params.id, {
      $set: req.body
    });
    
    res.status(200).json({message: "Adventure has been updated"});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
})


module.exports = router;