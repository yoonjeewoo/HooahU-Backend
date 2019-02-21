const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const query = require('../common/query');

const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new AWS.S3();

exports.createPost = (req, res) => {
	const { content, post_type, pic_list ,tags} = req.body;
	
	const d = new Date();
	d.setUTCHours(d.getUTCHours());

	let pic_input = (result, pic, index) => {
		return new Promise((resolve, reject) => {
			const picKey = d.getFullYear() + '_'
				+ d.getMonth() + '_'
				+ d.getDate() + '_'
				+ crypto.randomBytes(20).toString('hex') + 
				+ req.decoded._id + '.jpg';
			const picUrl = `https://s3.ap-northeast-2.amazonaws.com/hooahu/${picKey}`;
			let buf = new Buffer(pic.replace(/^data:image\/\w+;base64,/, ''), 'base64');
			s3.putObject({
				Bucket: 'hooahu',
				Key: picKey,
				Body: buf,
				ACL: 'public-read'
			}, function (err, response) {
				if (err) {
					if (err) reject(err);
				} else {
					// console.log(response)
					conn.query('INSERT INTO Images(post_id, img_url) VALUES(?, ?)', [result.insertId, picUrl], (err) => {
						if (err) reject(err);
						resolve();
					})
				}
			});
		})
	}

	let tags_input = (result, tags) => {
		return new Promise((resolve, reject) => {
			tags.forEach((tag) => {
				conn.query('INSERT INTO Tags(post_id, title) VALUES(?, ?)',[result.insertId, tag],(err) => {
					if (err) throw err;
					resolve(result.insertId);
				})
			})
		})
	}

	async function picandtag_input(result, pic_list, tags) {
		pic_list.forEach(async (pic, index) => {
			await pic_input(result, pic, index);
		});
		if (tags.length!=0) {
			let newPostId = await tags_input(result, tags);
			return res.status(200).json({
				newPostId: newPostId
			})
		} else {
			return res.status(200).json({
				newPostId: result.insertId
			})
		}
	}
	conn.query(
		'INSERT INTO Posts(user_id, content, post_type) VALUES(?, ?, ?)',
		[req.decoded._id, content, post_type],
		(err, result) => {
			if (err) throw err;
			picandtag_input(result, pic_list, tags);
		}
	)
}

exports.deletePost = async(req, res) => {
    const { post_id } = req.params;
    try {
        let result = await query.deletePostById(post_id);
        return res.status(200).json({
            message: "post deleted successfully"
        })
    } catch (err) {
        return res.status(406).json({
            err
        })
    }
    
}

exports.getPostList = async(req, res) => {
	try {
		if (req.query.rank ===1) {
			let result = await query.getPostListByPostTypeByLike(req.query.post_type, req.query.index);
			for (let i = 0; i < result.length; i++) {
				// console.log(result[i].id);
				result[i].images = await query.getImagesByPostId(result[i].id);
				result[i].comments = await query.getCommentByPostId(result[i].id);
				result[i].like_cnt = await query.getLikeCount(result[i].id);
				result[i].tags = await query.getTagsByPostId(result[i].id);
				result[i].isLiked = await query.checkIsLiked(result[i].id, req.decoded._id);
			}
			return res.status(200).json({
				nextIndex: parseInt(req.query.index) + 20,
				result
			})
		} else {
			let result = await query.getPostListByPostType(req.query.post_type, req.query.index);
			for (let i = 0; i < result.length; i++) {
				// console.log(result[i].id);
				result[i].images = await query.getImagesByPostId(result[i].id);
				result[i].comments = await query.getCommentByPostId(result[i].id);
				result[i].like_cnt = await query.getLikeCount(result[i].id);
				result[i].tags = await query.getTagsByPostId(result[i].id);
				result[i].isLiked = await query.checkIsLiked(result[i].id, req.decoded._id);
			}
			return res.status(200).json({
				nextIndex: parseInt(req.query.index) + 20,
				result
			})
		}
		
	} catch (err) {
		return res.status(406).json({
			err
		})
	}
}

exports.getUserPost = async(req, res) => {
	try {
		let result = await query.getPostListByUserId(req.params.user_id);
		for (let i = 0; i < result.length; i++) {
			// console.log(result[i].id);
			result[i].images = await query.getImagesByPostId(result[i].id);
			result[i].comments = await query.getCommentByPostId(result[i].id);
			result[i].like_cnt = await query.getLikeCount(result[i].id);
			result[i].tags = await query.getTagsByPostId(result[i].id);
			result[i].isLiked = await query.checkIsLiked(result[i].id, req.decoded._id);
		}
		return res.status(200).json({
			result
		})
	} catch (err) {
		return res.status(406).json({
			err
		})
	}
}

exports.getAllPost = async(req, res) => {
	try {
		if (req.query.rank === 1) {
			let result = await query.getAllPostListByLike(req.query.index);

			for (let i = 0; i < result.length; i++) {
				result[i].images = await query.getImagesByPostId(result[i].id);
				result[i].comments = await query.getCommentByPostId(result[i].id);
				result[i].like_cnt = await query.getLikeCount(result[i].id);
				result[i].tags = await query.getTagsByPostId(result[i].id);
				result[i].isLiked = await query.checkIsLiked(result[i].id, req.decoded._id);
			}

			// let randomPackage = await query.getTwoRandomPackages();
			// for (let i = 0; i < randomPackage.length; i++) {
			// 	randomPackage[i].images = await query.getImageByPackageId(randomPackage[i].id);
			// }
			return res.status(200).json({
				nextIndex: parseInt(req.query.index) + 20,
				result
				// randomPackage
			})
		} else {
			let result = await query.getAllPostList(req.query.index);

			for (let i = 0; i < result.length; i++) {
				result[i].images = await query.getImagesByPostId(result[i].id);
				result[i].comments = await query.getCommentByPostId(result[i].id);
				result[i].like_cnt = await query.getLikeCount(result[i].id);
				result[i].tags = await query.getTagsByPostId(result[i].id);
				result[i].isLiked = await query.checkIsLiked(result[i].id, req.decoded._id);
			}

			// let randomPackage = await query.getTwoRandomPackages();
			// for (let i = 0; i < randomPackage.length; i++) {
			// 	randomPackage[i].images = await query.getImageByPackageId(randomPackage[i].id);
			// }
			return res.status(200).json({
				nextIndex: parseInt(req.query.index) + 20,
				result
				// randomPackage
			})
		}
		
	} catch (err) {
		return res.status(406).json({
			err
		})
	}
}

exports.getPostListByTagName =  async(req, res) => {
	try {
		let result = await query.getPostListByTagName('#'+req.query.title, req.query.index, req.query.post_type);
		for (let i = 0; i < result.length; i++) {
			result[i].images = await query.getImagesByPostId(result[i].post_id);
			result[i].comments = await query.getCommentByPostId(result[i].post_id);
			result[i].like_cnt = await query.getLikeCount(result[i].post_id);
			result[i].tags = await query.getTagsByPostId(result[i].post_id);
			result[i].isLiked = await query.checkIsLiked(result[i].post_id, req.decoded._id);
			result[i].user = await query.getUserByUserId(result[i].user_id);
		}
		return res.status(200).json({
			nextIndex: parseInt(req.query.index)+20,
			result
		})
	} catch (err) {
		return res.status(406).json({
			err
		})
	}
}

exports.getTagsRanking = async(req, res) => {
	try {
		let result = await query.getTagsRanking();
		return res.status(200).json({
			result
		})
	} catch (err) {
		return res.status(406).json({
			err
		})
	}
}

exports.createComment = (req, res) => {
	const { post_id } = req.params;
	const { content } = req.body;
	conn.query(
		'INSERT INTO Comments(user_id, content, post_id) VALUES(?, ?, ?)',
		[req.decoded._id, content, post_id],
		(err) => {
			if (err) throw err;
			return res.status(200).json({
				message: 'done'
			})
		}
	)
}

// 좋아요
exports.likePost = async (req, res) => {
	const { post_id } = req.params;
	try {
		await query.increaseLikeCount(post_id, req.decoded._id);
		return res.status(200).json({
			message: 'liked successfully'
		})
	} catch (err) {
		return res.status(406).json({ err });
	}
}

// 좋아요 취소
exports.dislikePost = async (req, res) => {
	const { post_id } = req.params;
	try {
		await query.decreaseLikeCount(post_id, req.decoded._id);
		return res.status(200).json({
			message: 'disliked successfully'
		})
	} catch (err) {
		return res.status(406).json({ err });
	}
}

exports.getImagesByTagName = async (req, res) => {
	try {
		let result = await query.getImagesByTagName('#'+req.query.title, req.query.all);
		return res.status(200).json({
			result
		})
	} catch (err) {
		return res.status(406).json({ err });
	}
}

exports.searchTag = async (req, res) => {
	try {
		let result = await query.searchTag(req.query.title);
		return res.status(200).json({
			result
		})
	} catch (err) {
		return res.status(406).json({ err });
	}
}

exports.searchPackageTrip = async (req, res) => {
	try {
		let result = await query.getPackageTrip(req.query.title);
		return res.status(200).json({
			result
		})
	} catch (err) {
		return res.status(406).json({ err });
	}
}

exports.searchTagTotal = async (req, res) => {
	// let result = [];
	try {
		let result = await query.getTagsAndPosts(req.query.title);
		for (let i = 0; i < result.length; i++) {
			// console.log(result[i].id);
			result[i].images = await query.getImagesByPostId(result[i].id);
			result[i].comments = await query.getCommentByPostId(result[i].id);
			result[i].like_cnt = await query.getLikeCount(result[i].id);
			result[i].tags = await query.getTagsByPostId(result[i].id);
			result[i].isLiked = await query.checkIsLiked(result[i].id, req.decoded._id);
		}
		return res.status(200).json({
			result
		})
	} catch (err) {
		return res.status(406).json({ err });
	}
}

exports.searchUsers = async (req, res) => {
	try {
		let result = await query.getUserByNickname(req.query.title);
		return res.status(200).json({
			result
		})
	} catch (err) {
		return res.status(406).json({ err });
	}
}