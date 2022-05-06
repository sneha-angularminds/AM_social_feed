const User = require("./../models/register");
const Posts = require("./../models/posts");
// const { find } = require("./../models/posts");

exports.feedPost = async (req, res, next) => {
  const { caption } = req.body;
  let user = await User.findOne({ _id: req.user.id });
  console.log(user);
  let post;
  if (user) {
    post = new Posts({
      profileImg: req.file.path,
      caption,
      userName: `${user.firstName} ${user.lastName}`,
      createdBy: user._id,
    });
  }
  try {
    await post.save();
    // const token = getSignedToken(newUser);
    res.status(200).json({ post });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.postComment = async (req, res, next) => {
  const { comment } = req.body;
  let user = await User.findOne({ _id: req.user.id });
  const com = {
    comment: comment,
    userId: req.user.id,
    userName: `${user.firstName} ${user.lastName}`,
  };
  // const posts = await Posts.findOne({ _id: req.params.postId });
  try {
    await Posts.findByIdAndUpdate(
      { _id: req.params.postId },
      { $push: { comments: com } }
    );
    const postsComment = await Posts.findOne({ _id: req.params.postId });
    // console.log("comment",postsComment);
    // console.log("user",user);
    res.status(200).json({ postsComment});
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.postLike = async (req, res, next) => {
  const post = await Posts.findOne({ _id: req.params.postId });
  try {
    if (post.like.includes(req.user.id)) {
      const postLike = post.like.filter((p) => p !== req.user.id);
       await Posts.updateOne(
         { _id: req.params.postId },
         { like: postLike }
         // {$pull: { like: req.user.id }}
       );
      const postsLike = await Posts.findOne({ _id: req.params.postId });
        // console.log(post)
        res.status(200).json({ postsLike });
    } else {
      // post.like.push(req.user.id);
      // console.log("else",post);
      await Posts.updateOne(
        { _id: req.params.postId },
        {
          $push: { like: req.user.id },
        }
      );
      const postsLike = await Posts.findOne({ _id: req.params.postId });
      // console.log(post)
      res.status(200).json({ postsLike });
    }
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

// exports.getAllPosts = async (req, res, next) => {
//   var pageNo = parseInt(req.query.page);
//   var size = parseInt(req.query.size);
//   var query = {};
//   if (pageNo < 0 || pageNo === 0) {
//     response = {
//       error: true,
//       message: "invalid page number, should start with 1",
//     };
//     return res.status(400).json(response);
//   }
//   query.skip = size * (pageNo - 1);
//   query.limit = size;
//   console.log(query)
//   // Find some documents
//   Posts.find({}, {}, query, function (err, data) {
//     // Mongo command to fetch all data from collection.
//     if (err) {
//       response = { error: true, message: "Error fetching data" };
//     } else {
//       response = { posts: data };
//       console.log(response)
//     }
//     res.status(200).json(response);
//   });
// };

exports.getAllPosts = async (req, res, next) => {
  const { page, size } = req.query;
  var mysort = { createdOn: -1 };    
    const posts = await Posts.find()
      .sort(mysort)
      .limit(size * 1)
      .skip((page - 1) * size);
    try {
      res.status(200).json({ posts });
    } catch (err) {
      err.status = 400;
      next(err);
    }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    await Posts.findByIdAndRemove(postId);
    res.status(200).json({ success: true });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
