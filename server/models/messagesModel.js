const mongoose  = require('mongoose');

const messageSchema = new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isStarred:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const messageModel = mongoose.model('messages', messageSchema);

module.exports = messageModel;