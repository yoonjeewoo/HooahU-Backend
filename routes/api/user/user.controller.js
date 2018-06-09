const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);

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