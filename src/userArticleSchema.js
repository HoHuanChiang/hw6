const mongoose = require('mongoose');

const userArticleSchema = new mongoose.Schema({
    pid: {
        type: Number,
    },
    author:{
        type:String,
        required: [true, 'author is required']
    },
    text:{
        type:String,
        required: [true, 'text is required']
    },
    date:{
        type:Date,
        required: [true, 'date is required']
    },
    comments:{
        type: [JSON],
        required: [true, 'comments is required']
    }
})

module.exports = userArticleSchema;
