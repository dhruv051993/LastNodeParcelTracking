const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authTokenSchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'authentication' },
    username: String,
    auth_token: String,
    date_created: { type: Date, default: Date.now }
})

module.exports = mongoose.model('userToken', authTokenSchema);