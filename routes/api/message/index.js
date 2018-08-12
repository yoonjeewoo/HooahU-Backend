const router = require('express').Router();
const controller = require('./message.controller');

router.post('/:to', controller.sendMessage);
router.get('', controller.getMessageList);
router.get('/:user_id', controller.getMessageHistoryWithSpecificUser);

module.exports = router;