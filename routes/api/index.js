const router = require('express').Router();
const auth = require('./auth');
const user = require('./user');
const authMiddleware = require('../../middlewares/auth');

router.use('/auth', auth);
router.use('/user', authMiddleware)
router.use('/user', user);

module.exports = router;
