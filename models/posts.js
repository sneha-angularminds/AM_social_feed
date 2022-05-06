const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  userId: {
    type: String,
  },
  profileImg: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  like: {
    type: Array,
    default: [],
  },
  comments: {
    type: Array,
    default: [],
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  userName: {
    type: String
  },
  pic: {
    type: String
  }
});

postSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  return next();
});

module.exports = mongoose.model("post", postSchema);
