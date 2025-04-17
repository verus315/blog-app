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
exports.createComment = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = await Comment.create({
      ...req.body,
      postId: req.params.postId,
      authorId: req.user.id
    });
    
    // Get author information
    const author = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'avatar']
    });

    res.status(201).json({
      success: true,
      data: { ...comment.toJSON(), author }
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating comment'
    });
  }
};

// @desc    Update a comment
// @route   PUT /api/v1/comments/:id
// @access  Private
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);