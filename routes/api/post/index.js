const router = require('express').Router();
const controller = require('./post.controller');


router.get('', controller.getPostList);
router.post('', controller.createPost);
router.get('/all', controller.getAllPost);

router.post('/like/:post_id', controller.likePost);
router.get('/like/:post_id', controller.isLiked);

router.post('/comment/:post_id', controller.createComment);

module.exports = router;
