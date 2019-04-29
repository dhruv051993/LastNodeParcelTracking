const mongoose = require('mongoose');

const authenticationSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
});
module.exports = mongoose.model('authentications', authenticationSchema);