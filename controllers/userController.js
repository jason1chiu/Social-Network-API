const { User, Thought } = require('../models');

module.exports = {
  // GET users
  getUsers(req, res) {
    User.find()
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err))
  },

  // GET single user by its _id, populated with thought & friend data 
  getUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate('thoughts')
      .populate('friends')
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with that id' });
        }
        return res.json(user);
      })
      .catch((err) => {
        console.error("Error in getUser:", err);
        res.status(500).json(err);
      });
  },

  // POST a new user
  createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        res.status(500).json(err)
      });
  },

  // UPDATE a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' });
        }
        // Fetch the updated user with populated data
        User.findOne({ _id: req.params.userId })
          .populate('thoughts')
          .populate('friends')
          .then((updatedUser) => {
            if (!updatedUser) {
              return res.status(404).json({ message: 'No updated user found with that ID' });
            }
            res.json(updatedUser);
          })
          .catch((err) => {
            console.error("Error in fetching updated user:", err);
            res.status(500).json(err);
          });
      })
      .catch((err) => {
        console.error("Error in updateUser:", err);
        res.status(500).json(err);
      });
  },

  // DELETE a user by its _id BONUS: removed a user's associated thoughts when deleted
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'No user with that ID' });
          return;
        }
        // Remove the user from their friends' friend lists
        User.updateMany(
          { friends: req.params.userId },
          { $pull: { friends: req.params.userId } }
        )
          .then(() => {
            // Remove the user's associated thoughts
            return Thought.deleteMany({ _id: { $in: user.thoughts } });
          })
          .then(() => {
            res.json({ message: 'User and associated thoughts deleted!' });
          })
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500).json(err));
  },


  // POST a new friend to user's friend list
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // DELETE friend from user's friend list
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  }
};







