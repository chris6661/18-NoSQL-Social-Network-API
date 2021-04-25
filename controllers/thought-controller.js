const {
    Thought,
    User
} = require('../models');
const thoughtController = {

    //get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            //remvoe _v from visuals
            .select('-__v')
            .sort({
                _id: -1
            })
            .then(dbThoughtData => res.json(dbThoughtsData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    //get one thought by id
    getThoughtsById({
        params
    }, res) {
        Thought.findOne({
                _id: params.thoughtId
            })
            .select('-__v')
            .sort({
                _id: -1
            })
            .then(dbThoughtsData => {
                if (!dbThoughtsData) {
                    res.status(404).json({
                        message: 'No thought found with id.'
                    });
                    return;
                }
                res.json(dbThoughtsData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    //create thought
    createThoughts({
        body
    }, res) {
        Thought.create(body)
            .then((ThoughtsData) => {
                return User.findOneAndUpdate(
                    //create a thought using current user
                    {
                        _id: body.userId
                    }, {
                        $addToSet: {
                            thoughts: ThoughtsData._id
                        }
                    }, {
                        new: true
                    }
                );
            })
            .then(dbUsersData => {
                if (!dbUsersData) {
                    res.status(404).json({
                        message: 'No user found id.'
                    });
                    return;
                }
                res.json(dbUsersData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    //update thought by id
    updateThoughts({
        params,
        body
    }, res) {
        Thought.findOneAndUpdate({
                _id: params.thoughtId
            }, body, {
                new: true,
                runValidators: true
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({
                        message: 'No thought found with this id.'
                    });
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch(err => res.status(400).json(err));
    },

    //delete thought
    deleteThoughts({
        params
    }, res) {
        Thought.findOneAndDelete({
                _id: params.thoughtId
            })
            .then(dbThoughtsData => {
                if (!dbThoughtsData) {
                    return res.status(404).json({
                        message: 'No thought found this id.'
                    });
                }
                return User.findOneAndUpdate({
                    username: dbThoughtsData.username
                }, {
                    $pull: {
                        thoughts: params.thoughtId
                    }
                }, {
                    new: true
                })
            })
            .then(dbUsersData => {
                if (!dbUsersData) {
                    res.status(404).json({
                        message: 'No user found this id.'
                    });
                    return;
                }
                res.json(dbUsersData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    //create reactions
    createReactions({
        params,
        body
    }, res) {
        Thought.findOneAndUpdate({
                _id: params.thoughtId
            }, {
                $addToSet: {
                    reactions: body
                }
            }, {
                new: true
            })
            .then(dbUsersData => {
                if (!dbUsersData) {
                    res.status(404).json({
                        message: 'No user found with id.'
                    });
                    return;
                }
                res.json(dbUsersData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // Delete a reaction
    deleteReactions({
        params
    }, res) {
        Thought.findOneAndUpdate({
                    _id: params.thoughtId
                },
                //allows to remove the reaction by id
                {
                    $pull: {
                        reactions: {
                            reactionId: params.reactionId
                        }
                    }
                }, {
                    new: true
                }
            )
            .then(dbUsersData => res.json(dbUsersData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    }
}

module.exports = thoughtController;