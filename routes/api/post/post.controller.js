const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);

exports.createPost = (req, res) => {
	const { content, post_type } = req.body;
	conn.query(
		'INSERT INTO Posts(user_id, content, post_type) VALUES(?, ?, ?)',
		[req.decoded._id, content, post_type],
		(err, result) => {
			if (err) throw err;
			return res.status(200).json({
				message: 'done'
			})
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