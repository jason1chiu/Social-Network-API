const router = require('express').Router();

const {
  getAllThoughts,
  createSingleThought,
  getSingleThought,
  updateSingleThought,
  deleteSingleThought,
  createReaction,
  deleteReaction
} = require('../../controllers/thoughtController');

// /api/thoughts
router.route('/')
  .get(getAllThoughts)
  .post(createSingleThought);

// /api/thoughts/:thoughtId
router.route('/:thoughtId')
  .get(getSingleThought)
  .put(updateSingleThought)
  .delete(deleteSingleThought);

router.route('/:thoughtId/reactions')
  .post(createReaction);

router.route('/:thoughtId/reactions/:reactionId')
  .delete(deleteReaction);

module.exports = router;