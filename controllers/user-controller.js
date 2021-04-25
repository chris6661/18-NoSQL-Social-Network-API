const {
    User
} = require('../models');
const Thought = require('../models/Thought');
const {
    db
} = require('../models/User');

const userController = {

    //get all users
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                //allows to remove __v from visuals
                select: ('-__v -username')
            })
            .populate({
                path: 'friends',
                select: ('-__v -thoughts')
            })
            .select('-__v')
            .then(dbUsersData => res.json(dbUsersData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    //get one user by id
    getUserById({
        params
    }, res) {
        User.findOne({
                _id: params.id
            })
            .populate({
                path: 'friends',
                select: '-__v -username'
            })
            .populate({
                path: 'thoughts',
                select: '-__v -thoughts'
            })
            .select('-__v')
            .then(dbUsersData => {
                if (!dbUsersData) {
                    res.status(404).json({
                        message: 'No user found with this id.'
                    });
                    return;
                }
                res.json(dbUsersData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    },

    //create user
    createUsers({
        body
    }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUsersData))
            .catch(err => res.status(400).json(err));
    },

    //update user by id
    updateUsers({
        params,
        body
    }, res) {
        User.findOneAndUpdate({
                _id: params.userId
            }, body, {
                new: true,
                runValidators: true
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: 'No user found with this id.'
                    });
                    return;
                }
                res.json(dbUsersData);
            })
            .catch(err => res.status(400).json(err));
    },

    //delete user
    deleteUsers({
        params
    }, res) {
        User.findOneAndDelete({
                _id: params.userId
            })
            .then(dbUsersData => {
                if (!dbUsersData) {
                    res.status(404).json({
                        message: 'No user found with this id.'
                    });
                    return;
                }
                return dbUsersData;
            })
            .then(dbUsersData => {
                User.updateMany({
                        _id: {
                            $in: dbUsersData.friends
                        }
                    }, {
                        $pull: {
                            friends: params.userId
                        }
                    })
                    .then(() => {
                        //deletes user's thought associated with id
                        Thought.deleteMany({
                                username: dbUsersData.username
                            })
                            .then(() => {
                                res.json({
                                    message: 'User deleted successfully'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400).json(err);
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json(err);
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    //add friends
    createFriends({
        params
    }, res) {
        User.findOneAndUpdate({
                    _id: params.userId
                },
                // adds new friend to user id, new friend only belongs to that  user
                {
                    $addToSet: {
                        friends: params.friendsId
                    }
                }, {
                    new: true,
                }
            )
            .then(dbUsersData => {
                if (!dbUsersData) {
                    res.status(404).json({
                        message: 'No user found with this id.'
                    });
                    return;
                }
                res.json(dbUsersData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    //delete friend
    deleteFriends({
        params
    }, res) {
        User.findOneAndUpdate({
                _id: params.userId
            }, {
                $pull: {
                    friends: params.friendsId
                }
            }, {
                new: true
            })
            .then(dbUsersData => {
                if (!dbUsersData) {
                    res.status(404).json({
                        message: 'No user found with that id.'
                    });
                    return;
                }
                res.json(dbUsersData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            })
    }
};

module.exports = userController;