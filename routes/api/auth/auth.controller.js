const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const query = require('../../api/common/query');
const passport = require('passport');

exports.register = (req, res) => {
	const secret = req.app.get('jwt-secret');
	const { first_name, last_name, nickname, email, password, type, c_type, w_type, camp, area, reason, facebook_id, is_facebook_login } = req.body;
	const d = new Date();
	d.setUTCHours(d.getUTCHours());
	if (is_facebook_login) {
		conn.query('SELECT * from Users WHERE email=?', [email], (err, rows) => {
			if (err) throw err;
			if (rows.length == 0) {
				conn.query(
					'INSERT INTO Users(first_name, last_name, nickname, email, password, type, c_type, w_type, camp, area, reason, facebook_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
					[first_name, last_name, nickname, email, password, type, c_type, w_type, camp, area, reason, facebook_id],
					(err, result) => {
						if (err) throw err;
						console.log(result);
						jwt.sign(
							{
								_id: result.insertId,
								email: email
							},
							secret,
							{
								// expiresIn: '',
								issuer: 'rebay_admin',
								subject: 'userInfo'
							}, (err, token) => {
								if (err) return res.status(406).json({ message: 'register failed' });
								return res.status(200).json({
									message: 'registered successfully',
									token
								});
							});
					});
			} else {
				return res.status(406).json({
					message: 'user email or username exists'
				})
			}
		});
	} else {
		const encrypted = crypto.createHmac('sha1', config.secret)
		.update(password)
		.digest('base64');
		conn.query('SELECT * from Users WHERE email=?', [email], (err, rows) => {
			if (err) throw err;
			if (rows.length == 0) {
				conn.query(
					'INSERT INTO Users(first_name, last_name, nickname, email, password, type, c_type, w_type, camp, area, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
					[first_name, last_name, nickname, email, encrypted, type, c_type, w_type, camp, area, reason],
					(err, result) => {
						if (err) throw err;
						console.log(result);
						jwt.sign(
							{
								_id: result.insertId,
								email: email
							},
							secret,
							{
								// expiresIn: '',
								issuer: 'rebay_admin',
								subject: 'userInfo'
							}, (err, token) => {
								if (err) return res.status(406).json({ message: 'register failed' });
								return res.status(200).json({
									message: 'registered successfully',
									token
								});
							});
					});
			} else {
				return res.status(406).json({
					message: 'user email or username exists'
				})
			}
		});
	}
};

exports.login = (req, res) => {
	const { email, password } = req.body;
	const secret = req.app.get('jwt-secret');
	const encrypted = crypto.createHmac('sha1', config.secret)
		.update(password)
		.digest('base64');
	conn.query(
		'SELECT * from Users WHERE email=? and password=?',
		[email, encrypted],
		(err, result) => {
			if (err) throw err;
			if (result.length == 0) {
				return res.status(406).json({ message: 'login failed' });
			} else {
				jwt.sign(
					{
						_id: result[0].id,
						email: result[0].email,
					},
					secret,
					{
						// expiresIn: '30000',
						issuer: 'rebay_admin',
						subject: 'userInfo'
					}, (err, token) => {
						if (err) return res.status(406).json({ message: 'login failed' });
						return res.status(200).json({
							message: 'logged in successfully',
							token
						});
					});
			}
		}
	)
};

exports.testUsername = async (req, res) => {
	let user = await query.getUserByNickname(req.query.nickname);
	if (user.length == 0) {
		return res.status(200).json({
			isExists: false
		})
	} else {
		return res.status(200).json({
			isExists: true
		})
	}
}

exports.testEmail = async (req, res) => {
	let user = await query.getUserByEmail(req.query.email);
	if (user.length == 0) {
		return res.status(200).json({
			isExists: false
		})
	} else {
		return res.status(200).json({
			isExists: true
		})
	}
}