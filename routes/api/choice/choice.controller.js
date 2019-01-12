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
			if (err) return res.status(406).json({ err });
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
			if (err) return res.status(406).json({ err });
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
			if (err) return res.status(406).json({ err });
			return res.status(200).json({
				message: 'success'
			})
		}
	)
}
exports.isChoiceLiked = (req, res) => {
    const { choice_id } = req.params;
    conn.query(
        "SELECT * FROM ChoiceLikes WHERE user_id = ? and choice_id = ?",
        [req.decoded._id, choice_id],
        (err, result) => {
            if (err) return res.status(406).json({ err });
            if (result.length === 0) {
                return res.status(200).json({
                    isChoiceLiked: false
                })
            } else {
                return res.status(200).json({
                    isChoiceLiked: true
                })
            }
        }
    )
}

exports.getChoiceLikedCount = (req, res) => {
    const { choice_id } = req.params;
    conn.query(
        "SELECT * FROM ChoiceLikes WHERE choice_id = ?",
        [choice_id],
        (err, result) => {
            if (err) return res.status(406).json({ err });
            return res.status(200).json({
                likeCount: result.length
            })
        }
    )
}   

exports.likeChoice = (req, res) => {
    const { choice_id } = req.params;
    conn.query(
        "INSERT INTO ChoiceLikes(choice_id, user_id) VALUES(?, ?)",
        [choice_id, req.decoded._id],
        (err, result) => {
            if (err) return res.status(406).json({ err });
            return res.status(200).json({
                message: 'success'
            })
        }
    )
}

