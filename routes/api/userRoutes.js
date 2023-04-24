const router = require('express').Router();

const {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend
} = require('../../controllers/userController');

// /api/users
router.route('/')
  .get(getUsers)
  .post(addUser);

// /api/users/:userId
router.route('/:userId')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(deleteFriend);

module.exports = router;