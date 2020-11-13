const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  salt:{
    type:String,
    required: [true, 'salt is required']
  },
  hashPassword:{
    type:String,
    required: [true, 'password is required']
  },
  created: {
    type: Date,
    required: [true, 'Created date is required']
  }
})

module.exports = userSchema;
