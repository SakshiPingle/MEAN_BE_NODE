// --------------------------------------------------
// creating a server using Express.js
// --------------------------------------------------
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies
let httpServer = http.createServer(app);

// Middleware function to log the request
app.use('/get_post',(req,res,next)=>{
  const post = [{
    id: 1,
    title: "Post 1",
    content: "This is the content of post 1"
  },
  {
    id: 2,
    title: "Post 2",
    content: "This is the content of post 2"
  }];
  res.status(200).json({
    message: "Posts fetched successfully",
    posts: post
  });
});

app.post('/add_post',(req,res,next)=>{
  console.log("New post added", req.body);
  // res.status(201).json({
  //   message: "Post added successfully",
  //   post: req.body
  // });
  res.status(201).json({
    message: "Post added successfully"
  });
})

httpServer.listen(process.env.PORT || 3000, () => {
  console.log('Server is listening on port 3000');
});

module.exports = app;