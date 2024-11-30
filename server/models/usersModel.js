const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
