const router = require('express').Router();
const { Blog, User, Comment } = require('../../models');
const { withAuth } = require('../../config/middleware/auth');

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(`[Blog Route Error]: ${err.stack}`);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'An error occurred processing the blog request'
  });
});

// Get all blogs
router.get('/', asyncHandler(async (req, res) => {
  const blogs = await Blog.findAll({
    include: [
      {
        model: User,
        attributes: ['name']
      },
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: ['name']
          }
        ]
      }
    ],
    order: [['date_created', 'DESC']]
  });

  res.json(blogs);
}));

// Get single blog
router.get('/:id', asyncHandler(async (req, res) => {
  const blog = await Blog.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: ['name']
      },
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: ['name']
          }
        ],
        order: [['date_created', 'DESC']]
      }
    ]
  });

  if (!blog) {
    res.status(404).json({ message: 'Blog not found' });
    return;
  }

  res.json(blog);
}));

// Create new blog
router.post('/', withAuth, asyncHandler(async (req, res) => {
  // Validate required fields
  if (!req.body.title || !req.body.content) {
    res.status(400).json({ message: 'Title and content are required' });
    return;
  }

  const blog = await Blog.create({
    title: req.body.title,
    content: req.body.content,
    user_id: req.session.user_id,
    date_created: new Date()
  });

  // Fetch the created blog with user data
  const blogWithUser = await Blog.findByPk(blog.id, {
    include: [
      {
        model: User,
        attributes: ['name']
      }
    ]
  });

  res.status(201).json(blogWithUser);
}));

// Update blog
router.put('/:id', withAuth, asyncHandler(async (req, res) => {
  // Validate required fields
  if (!req.body.title && !req.body.content) {
    res.status(400).json({ message: 'Title or content is required for update' });
    return;
  }

  const blog = await Blog.findOne({
    where: {
      id: req.params.id,
      user_id: req.session.user_id
    }
  });

  if (!blog) {
    res.status(404).json({ message: 'Blog not found or you do not have permission to update' });
    return;
  }

  // Update only provided fields
  if (req.body.title) blog.title = req.body.title;
  if (req.body.content) blog.content = req.body.content;
  
  await blog.save();

  // Return updated blog with associations
  const updatedBlog = await Blog.findByPk(blog.id, {
    include: [
      {
        model: User,
        attributes: ['name']
      },
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: ['name']
          }
        ],
        order: [['date_created', 'DESC']]
      }
    ]
  });

  res.json(updatedBlog);
}));

// Delete blog
router.delete('/:id', withAuth, asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({
    where: {
      id: req.params.id,
      user_id: req.session.user_id
    }
  });

  if (!blog) {
    res.status(404).json({ message: 'Blog not found or you do not have permission to delete' });
    return;
  }

  await blog.destroy();
  
  res.json({
    message: 'Blog successfully deleted',
    id: req.params.id
  });
}));

// Get user's blogs
router.get('/user/posts', withAuth, asyncHandler(async (req, res) => {
  const blogs = await Blog.findAll({
    where: { user_id: req.session.user_id },
    include: [
      {
        model: User,
        attributes: ['name']
      },
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: ['name']
          }
        ],
        order: [['date_created', 'DESC']]
      }
    ],
    order: [['date_created', 'DESC']]
  });

  res.json(blogs);
}));

module.exports = router