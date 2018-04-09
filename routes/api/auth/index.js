const router = require('express').Router();
const controller = require('./auth.controller');
/**
 * @api {post} /auth/register Register
 * @apiName Register
 * @apiGroup Authentication
 *
 * @apiParam {String} username username of user.
 * @apiParam {String} password password of user.
 * @apiParam {String} email email address of user.
 * @apiParam {String} profile_img profile img (base64) of user.
 * @apiParam {String} github url of user.
 *
 *
 * @apiSuccessExample {json} Success-Response
 * JSON 200 OK
 * {
 *   "message": "registered in successfully",
 *   "token": "sadfsadfklads;fn;ovnqovwneoinwoi124o31;nl3n21;53nlk5nlknl;asdnf;fknaslfn"
 * }
 *
 * @apiErrorExample {json} Error-Response
 * JSON 406 FORBIDDEN
 * {
 *   "message": "'user email exists'"
 * }
 */
router.post('/register', controller.register);
/**
 * @api {post} /auth/login Login
 * @apiName Login
 * @apiGroup Authentication
 *
 * @apiParam {String} email email address of user.
 * @apiParam {String} password password of user.
 *
 *
 *
 * @apiSuccessExample {json} Success-Response
 * JSON 200 OK
 * {
 *   "message": "logged in successfully",
 *   "token": "sadfsadfklads;fn;ovnqovwneoinwoi124o31;nl3n21;53nlk5nlknl;asdnf;fknaslfn"
 * }
 *
 * @apiErrorExample {json} Error-Response
 * JSON 403 FORBIDDEN
 * {
 *   "message": "login failed"
 * }
 */
router.post('/login', controller.login);
/**
 * @api {post} /auth/login Login
 * @apiName Login
 * @apiGroup Authentication
 *
 * @apiParam {String} email email address of user.
 * @apiParam {String} password password of user.
 *
 *
 *
 * @apiSuccessExample {json} Success-Response
 * JSON 200 OK
 * {
 *   "message": "logged in successfully",
 *   "token": "sadfsadfklads;fn;ovnqovwneoinwoi124o31;nl3n21;53nlk5nlknl;asdnf;fknaslfn"
 * }
 *
 * @apiErrorExample {json} Error-Response
 * JSON 403 FORBIDDEN
 * {
 *   "message": "login failed"
 * }
 */
router.get('/username/test', controller.testUsername);

module.exports = router;
