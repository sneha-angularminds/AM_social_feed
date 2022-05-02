const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const Scehma = mongoose.Schema;

const postSchema = new Scehma({
  profileImg: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  like: {
    type: Boolean,
  },
  comment: {
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
});

postSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  return next();
});

module.exports = mongoose.model("post", postSchema);
