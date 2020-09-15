const mongoose = require('mongoose');
const UserSchema = require('./UserSchema');

const User = mongoose.model('User', UserSchema);

module.exports = User;
