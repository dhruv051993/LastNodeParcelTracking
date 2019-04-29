const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parcelSchema = new mongoose.Schema({
    itm_name: String,
    dlvry_date: String,
    dlvry_status: String,
    dlvry_addr: String,
    username: { type: String, ref: 'authentication' },
});
module.exports = mongoose.model('parcel', parcelSchema);