const express = require("express");
const router = express.Router();
const checkAuth = require('../Middleware/check-auth')


// Importing the Post model
const postController = require("../controller/postController");

// to get the list of post for the post page
router.get("/get_post", postController.getAllPostList);
// to add a new post from create post
router.post(
  "/add_post",
  checkAuth,
  postController.multerUpload, // multer middleware first
  postController.savePost //then your controller
);
// to delete a post
router.delete("/delete_post/:postId", checkAuth ,postController.deletePost);
// to save the updated post
router.put(
  "/update_post/:postId",
  checkAuth,
  postController.multerUpload, // multer middleware first
  postController.updatePost
);
// to get the single post details
router.get("/get_edit_post/:postId", postController.getPostDetails);

// exported the router
module.exports = router;
