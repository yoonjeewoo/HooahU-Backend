const router = require('express').Router();
const controller = require('./choice.controller');

router.post('/comment/:choice_id', controller.createComment);
router.get('/comment/:choice_id', controller.getCommentByChoiceId);
router.delete('/comment/:choice_id', controller.deleteCommentByChoiceId);

module.exports = router;
