const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    id:{
        type: Number,
        // required:true,
    },
    title:{
        type: String,
        required:true,
    },
    content:{
        type: String,
        required:true,
    },
    imagePath: { 
        type: String, 
        required: true 
    },
    creator : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }

})

module.exports = mongoose.model('Post', postSchema);; 