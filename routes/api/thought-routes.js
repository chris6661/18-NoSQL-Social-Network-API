const router = require('express').Router(); 

const {
    getAllThought, 
    getThoughtById, 
    createThought, 
    updateThought, 
    deleteThought, 
    createReaction, 
    deleteReaction
} = require('../../controllers/thought-controller'); 

//set up GET all and POST at api/thoughts

router
.route('/')
.get(getAllThought)
.post(createThought)

//GET one, PUT, DELETE at api/thoughts/:id

router
.route(':/id')
.get(getThoughtById)
.put(updateThought)
.delete(deleteThought)

router
.route('/:thoughtId/reactions')
.post(createReaction)

router
.route('/:thoughtId/reactions/:reactionId')
.delete(deleteReaction); 

module.exports = router; 