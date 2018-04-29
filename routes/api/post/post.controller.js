const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);

const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new AWS.S3();

exports.createPost = (req, res) => {
	const { content, post_type, pic_list } = req.body;
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
					conn.query('INSERT INTO Images(post_id, img_url) VALUES(?, ?, ?)', [result.insertId, picUrl], (err) => {
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
				conn.query('INSERT INTO Tags(item_id, title) VALUES(?, ?)',[result.insertId, tag],(err) => {
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

exports.getPostList = (req, res) => {
	conn.query(
		`SELECT Posts.id, nickname, Posts.content, Posts.created_at FROM Posts join Users on Posts.user_id = Users.id WHERE Posts.post_type=${req.query.post_type}`,
		(err, result) => {
			if (err) throw err;
			return res.status(200).json({
				result
			})
		}
	)
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