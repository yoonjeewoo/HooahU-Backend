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

exports.getUsersByTagName = async (req, res) => {
	try {
        let user_ids = await query.getUsersByTagName('#'+req.query.title);
        // print(user_ids)
        let result = [];
        for (let i = 0; i < user_ids.length; i++) {
            let user = await query.getUserByUserId(user_ids[i].user_id);
            // console.log(user)
            result.push(user[0]);
        }
		return res.status(200).json({
			result
		})
	} catch (err) {
		return res.status(406).json({ err });
	}
}

exports.updateProfile = async (req, res) => {
	const { nickname, area, base64 } = req.body;
	try {
		await query.updateUserNickname(nickname, req.decoded._id);
		await query.updateUserArea(area, req.decoded._id);
		await query.updateUserProfileImage(base64, req.decoded._id);
		return res.status(200).json({
			message: "updated user profile successfully"
		})
	} catch (err) {
		return res.status(406).json({ err });
	}
}