const router = require('express').Router();
const auth = require('./auth');
const user = require('./user');
const choice = require('./choice');
const authMiddleware = require('../../middlewares/auth');

router.use('/auth', auth);

router.use('/user', authMiddleware);
router.use('/user', user);

router.use('/choice', authMiddleware);
router.use('/choice', choice);

module.exports = router;
