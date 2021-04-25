const router = require('express').Router();

const {
    getAllThoughts,
    getThoughtsById,
    createThoughts,
    updateThoughts,
    deleteThoughts,
    createReactions,
    deleteReactions
} = require('../../controllers/thought-controller');

//set up GET all and POST at api/thoughts

router
    .route('/thought')
    .get(getAllThoughts)
    .post(createThoughts);

//GET one, PUT, DELETE at api/thoughts/:id

router
    .route('/thought/:thoughtId')
    .get(getThoughtsById)
    .put(updateThoughts)
    .delete(deleteThoughts);

router
    .route('/thought/:thoughtId/reactions')
    .post(createReactions);

router
    .route('/thought/:thoughtId/reactions/:reactionId')
    .delete(deleteReactions);

module.exports = router;