const router = require('express').Router();
const controller = require('./post.controller');

router.post('', controller.createPost);
router.get('', controller.getPostList);
router.get('/all', controller.getAllPost);

router.post('/comment/:post_id', controller.createComment);

module.exports = router;
