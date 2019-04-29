const jwt = require('jsonwebtoken');
const app = require('./index');

const common = {};

common.generateToken = function(req) {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: { username: req.body.username, role: req.role }
    }, req.app.get('secretKey'));
}

common.verifyToken = function(req, cb) {
    jwt.verify(req.header('x-auth-token'), req.app.get('secretKey'), function(err, decoded) {
        if (err) {
            console.error(err)
            cb(false);
        } else {
            if (decoded.data.username != req.header('loginusername')) cb(false);
            else cb(decoded);
        }
    });
}

common.isEmpty = function(item) {
    if (item == '' || item == ' ' || item == null || item == undefined) return true;
    return false;
}

module.exports = common;