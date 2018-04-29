const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);

exports.createComment = (req, res) => {
	const { choice_id } = req.params;
	const { comment } = req.body;
	conn.query(
		'INSERT INTO ChoiceComment(user_id, choice_id, comment) VALUES(?, ?, ?)',
		[req.decoded._id, choice_id, comment],
		(err, result) => {
			if (err) throw err;
			return res.status(200).json({
				message: 'success'
			})
		}
	)
}

exports.getCommentByChoiceId = (req, res) => {
	const { choice_id } = req.params;
	conn.query(
		'SELECT C.id, U.id as user_id, U.nickname, C.choice_id, C.`comment`, C.`created_at` FROM ChoiceComment as C join Users as U on U.id = C.user_id WHERE C.choice_id = ?',
		[choice_id],
		(err, result) => {
			if (err) throw err;
			return res.status(200).json({
				result
			})
		}
	)
}

exports.deleteCommentByChoiceId = (req, res) => {
	const { choice_id } = req.params;
	conn.query(
		'DELETE FROM ChoiceComment WHERE choice_id = ?',
		[choice_id],
		(err, result) => {
			if (err) throw err;
			return res.status(200).json({
				message: 'success'
			})
		}
	)
}