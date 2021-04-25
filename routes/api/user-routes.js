const router = require('express').Router();

const {
    getAllUsers,
    getUsersById,
    createUsers,
    updateUsers,
    deleteUsers,
    addFriends,
    deleteFriends
} = require('../../controllers/user-controller');

//set up GET all and POST at api/users

//api/users

router
    .route('/users')
    .get(getAllUsers)
    .post(createUsers);

//set up GET, POST, DELETE 

//api/users/:id
router
    .route('/users/:userid')
    .get(getUsersById)
    .put(updateUsers)
    .delete(deleteUsers);

//POST and DELETE for friends

router
    .route('/users/:userId/friends/:friendsId')
    .post(addFriends)
    .delete(deleteFriends);

module.exports = router;