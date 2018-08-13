const router = require('express').Router();
const controller = require('./user.controller');

router.get('/me', controller.getUserInfo);
router.get('/info/:user_id', controller.getUserInfoById);
router.get('/tag', controller.getUsersByTagName);

module.exports = router;
