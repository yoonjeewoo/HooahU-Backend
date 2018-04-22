const router = require('express').Router();
const controller = require('./user.controller');

router.get('/me', controller.getUserInfo);

module.exports = router;
