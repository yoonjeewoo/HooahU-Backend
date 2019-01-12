const router = require('express').Router();
const controller = require('./choice.controller');

router.post('/comment/:choice_id', controller.createComment);
router.get('/comment/:choice_id', controller.getCommentByChoiceId);
router.delete('/comment/:choice_id', controller.deleteCommentByChoiceId);

router.post('/like/:choice_id', controller.likeChoice);
router.get('/check/:choice_id', controller.isChoiceLiked);
router.get('/like/count/:choice_id', controller.getChoiceLikedCount);

module.exports = router;
