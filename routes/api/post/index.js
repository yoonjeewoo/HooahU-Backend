const router = require('express').Router();
const controller = require('./post.controller');


router.get('', controller.getPostList);
router.post('', controller.createPost);
router.get('/all', controller.getAllPost);
router.get('/user/:user_id', controller.getUserPost);

router.post('/like/:post_id', controller.likePost);
router.delete('/like/:post_id', controller.dislikePost);

router.post('/comment/:post_id', controller.createComment);

module.exports = router;
