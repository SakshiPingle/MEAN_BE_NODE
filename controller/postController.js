const Post = require("../models/postModel");
// for creating self made validation
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "./images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

exports.getAllPostList = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.currentpage;
  const postQuery = Post.find();
  let fetchPost;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((result) => {
      fetchPost = result;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        count: count,
        post: fetchPost,
      });
    }).catch(err=>{
      return res.status(500).json({
        message : "Error In fetching the post"
      })
    });

  // Here you would typically fetch posts from the database
  // Post.find().then(result => {
  //   res.status(200).json({
  //   message: "Posts fetched successfully",
  //   post: result
  // });
  // }).catch(err => {
  //   console.error("Error fetching posts:", err);
  //   return res.status(500).json({
  //     message: "Error fetching posts"
  //   });
  // });
};

exports.multerUpload = multer({ storage: storage }).single("image");

exports.savePost = (req, res, next) => {
  // Here you would typically save the post to the database
  // For now, we will just log it to the console
  // console.log("New post added", req.body);
  // save the post to the database
  const url = req.protocol + "://" + req.get("host");
  console.log(url + "/images/" + req.file.filename);
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator : req.userData.userId
  });
  newPost
    .save()
    .then((result) => {
      console.log("result", result);
      console.log("Post saved successfully");
      return res.status(201).json({
        message: "Post added successfully",
        post: {
          ...result,
          id: result._id,
        },
      });
    })
    .catch((err) => {
      console.error("Error saving post:", err);
      return res.status(500).json({
        message: "Error saving post",
      });
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  console.log("Post ID to delete:", postId);
  // Here you would typically delete the post from the database
  Post.findByIdAndDelete({ _id: postId,creator : req.userData.userId  })
    .then((result) => {
      if(result.n > 0){
        console.log("post deleted successfully");
        return res.status(200).json({
          message: "Post deleted successfully",
        });
      }else{
        return res.status(401).json({
          message: "Not authorised to delete",
        });
      }
    })
    .catch((err) => {
      console.error("Error deleting post:", err);
      return res.status(500).json({
        message: "Error deleting post",
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.params.postId,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator:req.userData.userId
  });
  // Here you would typically update the post in the database
  console.log("post", post);
  Post.updateOne({ _id: req.params.postId , creator : req.userData.userId }, post)
    .then((result) => {
      if(result.nModified > 0){
        console.log("Post updated successfully",result);
        return res.status(200).json({
          message: "Post updated successfully",
        });
      }else{
        return res.status(500).json({
          message: "Not Authorised to Edit",
        });
      }
    })
    .catch((err) => {
      console.error("Error updating post:", err);
      return res.status(500).json({
        message: "Error updating post",
      });
    });
};

exports.getPostDetails = (req, res, next) => {
  const postId = req.params.postId;
  console.log("Post ID to edit:", postId);
  // Here you would typically fetch the post from the database
  Post.findById(postId)
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: "Post not found",
        });
      }
      console.log("result", result);
      console.log("Post fetched successfully for editing");
      return res.status(200).json({
        message: "Post fetched successfully",
        post: result,
      });
    })
    .catch((err) => {
      console.error("Error fetching post for editing:", err);
      return res.status(500).json({
        message: "Error fetching post for editing",
      });
    });
};
