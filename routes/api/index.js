const router = require('express').Router();
const auth = require('./auth');
const user = require('./user');
const choice = require('./choice');
const post = require('./post');
const message = require('./message');

const authMiddleware = require('../../middlewares/auth');

router.use('/auth', auth);

router.use('/user', authMiddleware);
router.use('/user', user);

router.use('/choice', authMiddleware);
router.use('/choice', choice);

router.use('/message', authMiddleware);
router.use('/message', message);

router.use('/post', authMiddleware);
router.use('/post', post);

router.use('/message', authMiddleware);
router.use('/message', message);

module.exports = router;
