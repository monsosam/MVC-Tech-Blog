const router = require('express').Router()
const { Comment, User, Blog } = require('../../models');
const { withAuth } = require('../../config/middleware/auth');

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(`[Comment Route Error]: ${err.stack}`);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ 
    message: err.message || 'An error occurred with comment processing'
  });
});

// Get all comments for a blog
router.get('/blog/:blog_id', asyncHandler(async (req, res) => {
  const comments = await Comment.findAll({
    where: { blog_id: req.params.blog_id },
    include: [
      {
        model: User,
        attributes: ['name']
      }
    ],
    order: [['date_created', 'DESC']]
  });

  res.json(comments);
}));

// Create new comment
router.post('/', withAuth, asyncHandler(async (req, res) => {
  // Validate required fields
  if (!req.body.content || !req.body.blog_id) {
    res.status(400).json({ message: 'Content and blog ID are required' });
    return;
  }

  // Verify blog exists
  const blog = await Blog.findByPk(req.body.blog_id);
  if (!blog) {
    res.status(404).json({ message: 'Blog not found' });
    return;
  }

  const comment = await Comment.create({
    content: req.body.content,
    blog_id: req.body.blog_id,
    user_id: req.session.user_id,
    date_created: new Date()
  });

  // Fetch the created comment with user data
  const commentWithUser = await Comment.findByPk(comment.id, {
    include: [
      {
        model: User,
        attributes: ['name']
      }
    ]
  });

  res.status(201).json(commentWithUser);
}));

// Update comment
router.put('/:id', withAuth, asyncHandler(async (req, res) => {
  // Validate content
  if (!req.body.content) {
    res.status(400).json({ message: 'Comment content is required' });
    return;
  }

  const comment = await Comment.findOne({
    where: {
      id: req.params.id,
      user_id: req.session.user_id
    }
  });

  if (!comment) {
    res.status(404).json({ message: 'Comment not found or you do not have permission to edit' });
    return;
  }

  comment.content = req.body.content;
  await comment.save();

  // Return updated comment with user data
  const updatedComment = await Comment.findByPk(comment.id, {
    include: [
      {
        model: User,
        attributes: ['name']
      }
    ]
  });

  res.json(updatedComment);
}));

// Delete comment
router.delete('/:id', withAuth, asyncHandler(async (req, res) => {
  const comment = await Comment.findOne({
    where: {
      id: req.params.id,
      user_id: req.session.user_id
    }
  });

  if (!comment) {
    res.status(404).json({ message: 'Comment not found or you do not have permission to delete' });
    return;
  }

  await comment.destroy();
  res.status(200).json({ 
    message: 'Comment deleted successfully',
    id: req.params.id
  });
}));

// Get user's comments
router.get('/user', withAuth, asyncHandler(async (req, res) => {
  const comments = await Comment.findAll({
    where: { user_id: req.session.user_id },
    include: [
      {
        model: User,
        attributes: ['name']
      },
      {
        model: Blog,
        attributes: ['title', 'id']
      }
    ],
    order: [['date_created', 'DESC']]
  });

  res.json(comments);
}));

module.exports = router
