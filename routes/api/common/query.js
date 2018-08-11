const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const crypto = require('crypto');

// GET
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
            "SELECT Comments.id, user_id, nickname, profile_img, post_id, content, created_at FROM Comments JOIN Users ON Comments.user_id = Users.id WHERE post_id = ?",
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

exports.getUserByUserId = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT * FROM Users WHERE id = ?",
            [user_id],
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
            `SELECT Posts.id, profile_img, post_type, user_id, nickname, Posts.content, Posts.created_at FROM Posts join Users on Posts.user_id = Users.id WHERE Posts.post_type=${post_type} ORDER BY Posts.created_at DESC`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.getPostListByUserId = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT Posts.id, profile_img, post_type, user_id, nickname, Posts.content, Posts.created_at FROM Posts join Users on Posts.user_id = Users.id WHERE Posts.user_id=${user_id} ORDER BY Posts.created_at DESC`,
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
            `SELECT Posts.id, profile_img, post_type, user_id, nickname, Posts.content, Posts.created_at FROM Posts join Users on Posts.user_id = Users.id ORDER BY Posts.created_at DESC`,
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

exports.getTagsByPostId = (post_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT * FROM Tags WHERE post_id = ?",
            [post_id],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.checkIsLiked = (post_id, user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT * FROM Likes WHERE user_id = ? and post_id = ?",
            [user_id, post_id],
            (err, result) => {
                if (err) reject(err);
                if (result.length == 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }
        )
    });
}

exports.increaseLikeCount = (post_id, user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "INSERT INTO Likes(user_id, post_id) VALUES(?, ?)",
            [user_id, post_id],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    });
}

exports.decreaseLikeCount = (post_id, user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "DELETE FROM Likes WHERE user_id = ? and post_id = ?",
            [user_id, post_id],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    });
}

exports.getPostListByTagName = (title) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT * FROM Posts JOIN Tags ON Posts.id = Tags.post_id WHERE Tags.title = ?",
            [title],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.getTagsRanking = () => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT title, count(title) as counted_value FROM Posts JOIN Tags ON Posts.id = Tags.post_id GROUP BY title ORDER BY counted_value DESC",
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )       
    })
}  