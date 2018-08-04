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
                if (err) reject(err);
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
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.getPostListByPostType = (post_type) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT Posts.id, profile_img, post_type, nickname, Posts.content, Posts.created_at FROM Posts join Users on Posts.user_id = Users.id WHERE Posts.post_type=${post_type} ORDER BY Posts.created_at DESC`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.getAllPostList = () => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT Posts.id, profile_img, post_type, nickname, Posts.content, Posts.created_at FROM Posts join Users on Posts.user_id = Users.id ORDER BY Posts.created_at DESC`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.getImagesByPostId = (post_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT * FROM Images WHERE post_id = ?",
            [post_id],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            } 
        )
    })
}