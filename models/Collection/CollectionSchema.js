const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CollectionSchema = new Schema({
    _id: ObjectId,
    name: String,
    data: [{
        name: String,
        description: String,
        url: String,
    }],
});

// validate URL
CollectionSchema.path('url').validate((val) => {
    urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(val);
}, 'Invalid URL.');

module.exports = CollectionSchema;
