const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');


router.use('/', userRoutes);
router.use('/', thoughtRoutes);

module.exports = router;