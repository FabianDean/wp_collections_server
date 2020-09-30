const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
    facebook_id: String,
    premium: Boolean,
    collection_ids: [String],
    date_created: String,
});

module.exports = UserSchema;
