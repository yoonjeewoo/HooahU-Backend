const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const query = require('../common/query');
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new AWS.S3();
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
	const { nickname, area } = req.body;
	try {
		await query.updateUserNickname(nickname, req.decoded._id);
		await query.updateUserArea(area, req.decoded._id);
		// await query.updateUserProfileImage(base64, req.decoded._id);
		return res.status(200).json({
			message: "updated user profile successfully"
		})
	} catch (err) {
		return res.status(406).json({ err });
	}
}
exports.updateProfileImage = async (req, res) => {
	const { base64 } = req.body;
	const user_id = req.decoded._id;
	const d = new Date();
	d.setUTCHours(d.getUTCHours());
	const picKey = d.getFullYear() + '_'
		+ d.getMonth() + '_'
		+ d.getDate() + '_'
		+ crypto.randomBytes(20).toString('hex') +
		+ req.decoded._id + '.jpg';
	const picUrl = `https://s3.ap-northeast-2.amazonaws.com/hooahu/${picKey}`;
	let buf = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
	s3.putObject({
			Bucket: 'hooahu',
			Key: picKey,
			Body: buf,
			ACL: 'public-read'
	}, function (err) {
			if (err) {
				return res.status(406).json({err});
			} else {
					conn.query(
					    "UPDATE Users SET profile_img = ? WHERE id = ?",
					    [picUrl, user_id],
					    (err, result) => {
								if (err) return res.status(406).json({ err });
								return res.status(200).json({
                  message: picUrl
                });
					    }
					)
			}
	});
}
exports.updatePassword = async (req, res) => {
	const { old_pass, new_pass } = req.body;
	
	try {
		let checked = await query.checkPassword(old_pass, req.decoded._id);
		if (checked.length === 0) {
			return res.status(200).json({
				message: "password_is_wrong"
			})
		} else {
			await query.updatePassword(old_pass, new_pass, req.decoded._id);
			return res.status(200).json({
				message: "updated user profile successfully"
			})
		}
	} catch (err) {
		return res.status(406).json({ err });
	}
}

