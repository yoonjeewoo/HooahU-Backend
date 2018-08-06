const router = require('express').Router();
const controller = require('./user.controller');

router.get('/me', controller.getUserInfo);
router.get('/info/:user_id', controller.getUserInfoById);

module.exports = router;
