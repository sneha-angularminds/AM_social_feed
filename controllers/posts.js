const User = require("./../models/register");
const validate = require("./../validation");
const Posts = require("./../models/posts");

exports.feedPost = async (req, res, next) => {
    const { caption } = req.body;
    let user = await User.findOne({ _id: req.user.id });
    let newPost;
    if (user)
    {   
        newPost = new Posts({ profileImg: req.file.path, caption });
    }
    try {
      await newPost.save();
      // const token = getSignedToken(newUser);
      res.status(200).json({ newPost });
    } catch (err) {
      err.status = 400;
      next(err);
    }
}
