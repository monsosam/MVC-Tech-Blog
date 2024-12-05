const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const { withAuth } = require('../config/middleware/auth');

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Error handler
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

// Get all user's blogs for dashboard
router.get('/', withAuth, asyncHandler(async (req, res) => {
    const blogs = await Blog.findAll({
      where: {
        user_id: req.session.user_id
      },
      include: [
        {
          model: User,
          attributes: ['name']
        },
        {
          model: Comment,
          include: {
            model: User,
            attributes: ['name']
          }
        }
      ],
      order: [['date_created', 'DESC']]
    });
  
    const plainBlogs = blogs.map((blog) => blog.get({ plain: true }));
  
    res.render('dashboard', {
      blogs: plainBlogs,
      logged_in: req.session.logged_in,
      url: req.originalUrl
    });
  }));

// Get single blog for editing
router.get('/edit/:id', withAuth, asyncHandler(async (req, res) => {
    const blog = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name']
        },
        {
          model: Comment,
          include: {
            model: User,
            attributes: ['name']
          }
        }
      ]
    });
  
    if (!blog) {
      res.status(404).json({ message: 'No blog found with this id' });
      return;
    }
  
    // Verify ownership
    if (blog.user_id !== req.session.user_id) {
      res.status(403).json({ message: 'Not authorized to edit this blog' });
      return;
    }
  
    const plainBlog = blog.get({ plain: true });
  
    res.render('editblog', {
      blog: plainBlog,
      logged_in: req.session.logged_in,
      url: req.originalUrl
    });
}));

// New blog creation page
router.get('/new', withAuth, asyncHandler(async (req, res) => {
    res.render('createblog', {
      logged_in: req.session.logged_in,
      url: req.originalUrl
    });
}));

module.exports = router;
