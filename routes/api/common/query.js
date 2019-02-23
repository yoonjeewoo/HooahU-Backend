const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const crypto = require('crypto');
const request = require('request');
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new AWS.S3();
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
            `SELECT * FROM Users WHERE nickname LIKE '${nickname}%'`,
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
            "SELECT id, full_name, nickname, email, type, c_type, w_type, camp, area, reason, profile_img FROM Users WHERE id = ?",
            [user_id],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.getPostListByPostType = (post_type, startIndex) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT Posts.id, profile_img, post_type, user_id, nickname, Posts.content, Posts.created_at FROM Posts join Users on Posts.user_id = Users.id WHERE Posts.post_type=${post_type} ORDER BY Posts.created_at DESC LIMIT 20 offset ${parseInt(startIndex)}`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.getPostListByPostTypeByLike = (post_type, startIndex) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT Posts.id, profile_img, post_type, user_id, nickname, Posts.content, Posts.created_at FROM Posts join Users on Posts.user_id = Users.id WHERE Posts.post_type=${post_type} ORDER BY Posts.like_cnt DESC, Posts.created_at DESC LIMIT 20 offset ${parseInt(startIndex)}`,
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

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

exports.getTwoRandomPackages = () => {
    return new Promise((resolve, reject) => {
        randomIndex1 = getRandomInt(26) + 1;
        randomIndex2 = getRandomInt(26) + 1;
        randomIndex3 = getRandomInt(26) + 1;
        randomIndex4 = getRandomInt(26) + 1;
        conn.query(
            "SELECT * FROM PackageTrip WHERE id = ? or id = ? or id = ? or id = ?",
            [randomIndex1, randomIndex2, randomIndex3, randomIndex4],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.getPostByPostId = (post_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT Posts.id, profile_img, post_type, user_id, nickname, Posts.content, Posts.created_at FROM Posts join Users on Posts.user_id = Users.id WHERE Posts.id = ?",
            [post_id],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    });
}

exports.getAllPostList = (startIndex) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT Posts.id, profile_img, post_type, user_id, nickname, Posts.content, Posts.created_at FROM Posts join Users on Posts.user_id = Users.id ORDER BY Posts.created_at DESC LIMIT 20 OFFSET ${parseInt(startIndex)}`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.getAllPostListByLike = (startIndex) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT Posts.id, profile_img, post_type, user_id, nickname, Posts.content, Posts.created_at FROM Posts join Users on Posts.user_id = Users.id ORDER BY Posts.like_cnt DESC, Posts.created_at DESC LIMIT 20 OFFSET ${parseInt(startIndex)}`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.getImageByPackageId = (trip_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT * FROM PackageImage WHERE trip_id = ?`,
            [trip_id],
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
            (err) => {
                if (err) reject(err);
                conn.query(
                    "UPDATE Posts SET like_cnt = like_cnt + 1 WHERE id = ?",
                    [post_id],
                    (err, result) => {
                        if (err) reject(err);
                        resolve(result);
                    }
                )
            }
        )
    });
}

exports.decreaseLikeCount = (post_id, user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "DELETE FROM Likes WHERE user_id = ? and post_id = ?",
            [user_id, post_id],
            (err) => {
                if (err) reject(err);
                conn.query(
                    "UPDATE Posts SET like_cnt = like_cnt - 1 WHERE id = ?",
                    [post_id],
                    (err, result) => {
                        if (err) reject(err);
                        resolve(result);
                    }
                )
            }
        )
    });
}

exports.getPostListByTagName = (title, startIndex, post_type) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT * FROM Posts JOIN Tags ON Posts.id = Tags.post_id WHERE Tags.title = ? and post_type = ? LIMIT 20 OFFSET ?",
            [title, post_type, parseInt(startIndex)],
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

exports.sendMessage = (from, to, content) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "INSERT INTO Messages(`from`, `to`, `content`) VALUES(?, ?, ?)",
            [from, to, content],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.getUsersByTagName = (title) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT DISTINCT user_id FROM Posts JOIN Tags ON Posts.id = Tags.post_id WHERE title='${title}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.getImagesByTagName = (title, all) => {
    return new Promise((resolve, reject) => {
        if (parseInt(all) == 1) {
            conn.query(
                `SELECT * FROM (SELECT Posts.id FROM Posts JOIN Tags ON Posts.id = Tags.post_id WHERE Tags.title = '${title}' ORDER BY created_at DESC) as A \
                JOIN Images ON A.id = Images.post_id LIMIT 6;`,
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            )
        } else {
            conn.query(
                `SELECT * FROM (SELECT Posts.id FROM Posts JOIN Tags ON Posts.id = Tags.post_id WHERE Tags.title = '${title}' ORDER BY created_at DESC) as A \
                JOIN Images ON A.id = Images.post_id;`,
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            )
        }
    })
}

exports.searchTag = (query) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT Tags.title, count(Tags.title) as C FROM Posts JOIN Tags ON Posts.id = Tags.post_id WHERE Tags.title\
             LIKE '#${query}%' GROUP BY Tags.title ORDER BY C DESC;`,
             (err, result) => {
                 if (err) reject(err);
                 resolve(result);
             }
        )
    })   
}

exports.getTagsByTitle = (title) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT * FROM Tags WHERE title = '#${title}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.getTagsAndPosts = (title) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT * FROM (SELECT Posts.id, profile_img, post_type, user_id, nickname, Posts.content, Posts.created_at FROM Posts join Users on Posts.user_id = Users.id) as A JOIN Tags ON A.id = Tags.post_id WHERE title = '#${title}';`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.getPackageTrip = (title) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT * FROM PackageTrip WHERE name LIKE '%${title}%'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.searchPostByTagName = (tagName) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT * FROM Tags WHERE Tags.title='#${tagName}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.facebookTokenCheck = (access_token) => {
    return new Promise((resolve, reject) => {
        request(`https://graph.facebook.com/me?access_token=${access_token}`, function (error, response, body) {
            console.log(response)
            if (response.statusCode != 200) {
                resolve(false);
            } else {
                resolve(JSON.parse(body).id);
            }
        });
    })
}

exports.deletePostById = (post_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "DELETE FROM Posts WHERE id = ?",
            [post_id],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.updateUserNickname = (nickname, user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "UPDATE Users SET nickname = ? WHERE id = ?",
            [nickname, user_id],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.updateUserProfileImage = (base64, user_id) => {
    
    return new Promise((resolve, reject) => {
        const d = new Date();
        d.setUTCHours(d.getUTCHours());
        const picKey = d.getFullYear() + '_'
            + d.getMonth() + '_'
            + d.getDate() + '_'
            + crypto.randomBytes(20).toString('hex') +
            + req.decoded._id + '.jpg';
        const picUrl = `https://s3.ap-northeast-2.amazonaws.com/hooahu/${picKey}`;
        
        resolve(picUrl);
        // let buf = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        // s3.putObject({
        //     Bucket: 'hooahu',
        //     Key: picKey,
        //     Body: buf,
        //     ACL: 'public-read'
        // }, function (err, response) {
        //     if (err) {
        //         console.log(err)
        //         // if (err) reject(err);
        //     } else {
        //         console.log(response)
        //         // conn.query(
        //         //     "UPDATE Users SET profile_img = ? WHERE id = ?",
        //         //     [picUrl, user_id],
        //         //     (err, result) => {
        //         //         if (err) reject(err);
        //         //         resolve(result);
        //         //     }
        //         // )
        //         // resolve(response);
        //     }
        // });
    })
}

exports.updateUserArea = (area, user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "UPDATE Users SET area = ? WHERE id = ?",
            [area, user_id],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

exports.checkPassword = (password, user_id) => {
    return new Promise((resolve, reject) => {
        const encrypted = crypto.createHmac('sha1', config.secret)
            .update(password)
            .digest('base64');
        conn.query(
            `SELECT * FROM Users WHERE id = ${user_id} and password = '${encrypted}'`,
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    });
}

exports.updatePassword = (old_pass, new_pass, user_id) => {
    return new Promise((resolve, reject) => {
        const old_encrypted = crypto.createHmac('sha1', config.secret)
            .update(old_pass)
            .digest('base64');
        const new_encrypted = crypto.createHmac('sha1', config.secret)
            .update(new_pass)
            .digest('base64');
        conn.query(
            "UPDATE Users SET password = ? WHERE id = ? and password = ?",
            [new_encrypted, user_id, old_encrypted],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        )
    })
}

//////////////
// Comments //
//////////////

exports.getCommentByCommentId = (comment_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT * FROM Comments WHERE id = ?",
            [comment_id],
            (err, result) => {
                if (err) reject(err);
                resolve(result[0]);
            }
        )
    })  
}

exports.deleteCommentByCommentId = async(comment_id, user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "DELETE FROM Comments WHERE id = ? and user_id = ?",
            [comment_id, user_id],
            (err, result) => {
                if (err) reject (err);
                resolve(result);
            }
        )
    })
}