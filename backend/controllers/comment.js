const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

// @desc    Get comments for a post
// @route   GET /api/v1/posts/:postId/comments
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: {
        postId: req.params.postId,
        parentCommentId: null,
        status: "active",
      },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "avatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create comment
// @route   POST /api/v1/posts/:postId/comments
// @access  Private
