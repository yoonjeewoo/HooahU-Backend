const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const crypto = require('crypto');

exports.getLikeCount = (post_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT * FROM Likes WHERE post_id = ?",
            [post_id],
            (err, result) => {
                if (err) reject();
                resolve(result.length);
            }
        )
    })
}

exports.getCommentByPostId = (post_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT * FROM Comments WHERE post_id = ?",
            [post_id],
            (err, result) => {
                if (err) reject();
                resolve(result);
            }
        )
    })
}

exports.getUserByNickname = (nickname) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT * FROM Users WHERE nickname = ?",
            [nickname],
            (err, result) => {
                if (err) reject();
                resolve(result);
            }
        )
    })
}

exports.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT * FROM Users WHERE email = ?",
            [email],
            (err, result) => {
                if (err) reject();
                resolve(result);
            }
        )
    })
}