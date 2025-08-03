// --------------------------------------------------
// creating a server using Express.js
// --------------------------------------------------
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
// connecting mongoDB
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const { ObjectId } = mongodb;
// Importing the Post model
const Post = require('./models/postModel'); 
const mongodb_URI = 'mongodb+srv://sakshipingle603:sakshi603@awscluster.wqpjelm.mongodb.net/mean-learning';
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies
let httpServer = http.createServer(app);

// Middleware function to log the request
app.get('/get_post',(req,res,next)=>{
  // Here you would typically fetch posts from the database
  Post.find().then(result => {
    res.status(200).json({
    message: "Posts fetched successfully",
    post: result
  });
  }).catch(err => {
    console.error("Error fetching posts:", err);
    return res.status(500).json({
      message: "Error fetching posts"
    });
  });
 
});

app.post('/add_post',(req,res,next)=>{
  // Here you would typically save the post to the database
  // For now, we will just log it to the console
  // console.log("New post added", req.body);
  // save the post to the database
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content
  })
  newPost.save()
  .then((result) => {
    console.log("Post saved successfully");
    return res.status(201).json({
      message: "Post added successfully",
      postId: result._id
    });
  }).catch(err => {
    console.error("Error saving post:", err);
    return res.status(500).json({
      message: "Error saving post"
    });
  });
})

app.delete('/delete_post/:postId',(req,res,next)=>{
  const postId = req.params.postId;
  console.log("Post ID to delete:", postId);
  // Here you would typically delete the post from the database
  Post.findByIdAndDelete({_id : postId}).then((result)=>{
    console.log("post deleted successfully");
    return res.status(200).json({
      message: "Post deleted successfully"
    });
  }).catch(err => {
    console.error("Error deleting post:", err);
    return res.status(500).json({
      message: "Error deleting post"
    });
  })
  })

mongoose.connect( mongodb_URI, {
}).then(() => {
  console.log('Connected to MongoDB successfully');
}
).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

httpServer.listen(process.env.PORT || 3000, () => {
  console.log('Server is listening on port 3000');
});

module.exports = app;