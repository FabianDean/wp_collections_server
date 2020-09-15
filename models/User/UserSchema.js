const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    premium: {
        type: Boolean,
        required: true
    },
    collection_ids: {
        type: [ObjectId]
    },
    date_created: String
});

module.exports = UserSchema;
