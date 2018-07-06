const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);

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
					resolve();
				})
			})
		})
	}

	async function picandtag_input(result, pic_list, tags) {
		pic_list.forEach(async (pic, index) => {
			await pic_input(result, pic, index);
		});
		await tags_input(result, tags);
		return res.status(200).json({
			message: 'done'
		})
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

function pushImages(post_id) {
	return new Promise((resolve, reject) => {
		conn.query(
			"SELECT * FROM Images WHERE post_id = ?",
			[post_id],
			(err, result) => {
				if (err) reject();
				resolve(result);
			}
		)
	});
}
function returnObject(imagesArray, e) {
	return new Promise((resolve, reject) => {
		let object = {
			id: e.id,
			profile_img: e.profile_img,
            nickname: e.nickname,
            content: e.content,
			created_at: e.created_at,
            images: imagesArray
		};
		resolve(object);
	});
}
async function createObject(ret, result) {
	for (const e of ret) {
        imagesArray = await pushImages(e.id);
        object = await returnObject(imagesArray, e);
		await result.push(object);
	}
	return result;
}
async function createPostObject(user_id, req, res) {
	result = [];
	conn.query(
        `SELECT Posts.id, profile_img, post_type, nickname, Posts.content, Posts.created_at FROM Posts join Users on Posts.user_id = Users.id WHERE Posts.post_type=${req.query.post_type} ORDER BY Posts.created_at DESC`,
        async (err, ret) => {
			if (err) throw err;
			result = await createObject(ret, result);
			await res.status(200).json({
				result
			})
		}
	)
};
async function createPostObjectAll(user_id, req, res) {
	result = [];
	conn.query(
		`SELECT Posts.id, profile_img, post_type, nickname, Posts.content, Posts.created_at FROM Posts join Users on Posts.user_id = Users.id ORDER BY Posts.created_at DESC`,
		async (err, ret) => {
			if (err) throw err;
			result = await createObject(ret, result);
			await res.status(200).json({
				result
			})
		}
	)
};

exports.getPostList = (req, res) => {
  createPostObject(req.decoded._id, req, res);
}

exports.getAllPost = (req, res) => {
	createPostObjectAll(req.decoded._id, req, res);
}

exports.createComment = (req, res) => {
	const { post_id } = req.params;
	const { content } = req.body;
	conn.query(
		'INSERT INTO Comments(user_id, content, post_id) VALUES(?, ?, ?)',
		[req.decoded._id, content, post_id],
		(err, result) => {
			if (err) throw err;
			return res.status(200).json({
				message: 'done'
			})
		}
	)
}