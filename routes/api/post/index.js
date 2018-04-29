const router = require('express').Router();
const controller = require('./post.controller');

router.post('', controller.createPost);
router.get('', controller.getPostList);

router.post('/comment/:post_id', controller.createComment);

module.exports = router;
