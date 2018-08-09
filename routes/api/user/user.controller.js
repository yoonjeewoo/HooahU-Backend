const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const query = require('../common/query');

exports.getUserInfo = (req, res) => {
	conn.query(
		'SELECT * FROM Users WHERE id=?',
		[req.decoded._id],
		(err, result) => {
			if (err) throw err;
			return res.status(200).json({
				result
			})
		}
	)
};

exports.getUserInfoById = async (req, res) => {
	try {
		let result = await query.getUserByUserId(req.params.user_id);
		return res.status(200).json({
			result
		})
	} catch (err) {
		return res.status(406).json({ err })
	}
}

