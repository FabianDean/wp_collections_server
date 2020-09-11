const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
    _id: ObjectId,
    name: String,
});

module.exports = UserSchema;
