const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const query = require('../common/query');

exports.sendMessage = async (req, res) => {
	const { content } = req.body;
	const { to } = req.params;
	
	try {
		query.sendMessage(req.decoded._id, parseInt(to), content);
		
		return res.status(200).json({
			message: 'Successfully Sent'
		})
	} catch (err) {
		
		return res.status(406).json({
			err
		})
	}
}
// SELECT DISTINCT `from`, `to`, `sent_at` FROM Messages WHERE `from`=8 or `to`=8
exports.getMessageList = async(req, res) => {
	
}

exports.getMessageHistoryWithSpecificUser = async (req, res) => {

}