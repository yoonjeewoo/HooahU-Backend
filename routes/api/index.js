const router = require('express').Router();
const auth = require('./auth');
const user = require('./user');
const choice = require('./choice');
const post = require('./post');
const authMiddleware = require('../../middlewares/auth');

router.use('/auth', auth);

router.use('/user', authMiddleware);
router.use('/user', user);

router.use('/choice', authMiddleware);
router.use('/choice', choice);

router.use('/post', authMiddleware);
router.use('/post', post);

module.exports = router;
