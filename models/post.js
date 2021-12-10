
const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    avatar:{
        type:String
    },
    likes:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        }
    }],
    comments:[
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        } ,
        text:{
        type:String,
        required:true
        },
        name:{
            type:String,
            required:true
        },
        avatr:{
            type:String,
        },
        date:{
           type:Date,
           default:Date.now 
        }
    }
    ],
    date:{
        type:Date,
        default:Date.now 
     }

});
module.exports = Post = mongoose.model ('post',PostSchema);
