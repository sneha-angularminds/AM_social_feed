const multer = require("multer");
const express = require("express");
const router = express.Router();
const auth = require("./../middleware/auth");
const postController = require("./../controllers/posts"); 
// const upload = multer({dest: 'posts/'});

const storage = multer.diskStorage({
  destination: "posts/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5
  // },
  fileFilter: fileFilter,
});

router.post("/", auth, upload.single("profileImg"), postController.feedPost);
router.put("/comment/:postId", auth, postController.postComment);
router.put("/like/:postId", auth, postController.postLike);
router.get("/getAllPosts", auth, postController.getAllPosts);

module.exports = router
