const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CollectionSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    name: String,
    owner_id: {
        type: ObjectId,
        required: true,
    },
    date_created: String,
    type: {
        type: String,
        enum: ['PLUGIN', 'THEME', 'MIXED'],
        default: 'MIXED',
    },
    plugins: [
        {
            name: String,
            author: String,
            slug: String,
            homepage: String,
            downloads: Number,
            rating: Number,
            ratings: {
                one: Number,
                two: Number,
                three: Number,
                four: Number,
                five: Number,
            },
        },
    ],
    themes: [
        {
            name: String,
            author: String,
            slug: String,
            homepage: String,
            description: String,
            downloads: Number,
            rating: Number,
            screenshot_url: String,
            preview_url: String,
        },
    ],
});

// validate URL
// CollectionSchema.path('themes/preview_url').validate((val) => {
//     urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
//     return urlRegex.test(val);
// }, 'Invalid URL.');

module.exports = CollectionSchema;
