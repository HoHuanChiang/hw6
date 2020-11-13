const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    headline:{
        type:String,
        required: [true, 'headline is required']
    },
    email:{
        type:String,
        required: [true, 'email is required']
    },
    zipcode:{
        type:Number,
        required: [true, 'zipcode is required']
    },
    dob:{
        type:String,
        required: [true, 'dob is required']
    },
    avatar:{
        type:String
    },
    following:{
        type: [String],
        require: [true, 'following is required']
    },
    created: {
        type: Date,
        required: [true, 'Created date is required']
    }
})

module.exports = userProfileSchema;
