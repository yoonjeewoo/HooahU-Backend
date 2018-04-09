const router = require('express').Router();
const auth = require('./auth');
const authMiddleware = require('../../middlewares/auth');

router.use('/auth', auth);

module.exports = router;
