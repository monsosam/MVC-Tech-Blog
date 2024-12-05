const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const { withAuth } = require('../config/middleware/auth');

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);


// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {},
    logged_in: req.session.logged_in
  });
});

// Home page - show all blogs
router.get('/', asyncHandler(async (req, res) => {
  const blogs = await Blog.findAll({
    include: [
      { 
        model: User,
        attributes: ['name']
      },
      {
        model: Comment,
        include: [{ 
          model: User,
          attributes: ['name']
        }]
      }
    ],
    order: [['date_created', 'DESC']]
  });

  res.render('homepage', {
    blogs: blogs.map(blog => blog.get({ plain: true })),
    logged_in: req.session.logged_in,
    userName: req.session.user_name
  });
}));

// Single blog view
router.get('/blog/:id', asyncHandler(async (req, res) => {
  const blog = await Blog.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: ['name']
      },
      {
        model: Comment,
        include: [{ 
          model: User,
          attributes: ['name']
        }],
        order: [['date_created', 'DESC']]
      }
    ]
  });

  if (!blog) {
    res.status(404).render('404', {
      message: 'Blog post not found',
      logged_in: req.session.logged_in
    });
    return;
  }

  const comments = await Comment.findAll({
    where: { blog_id: req.params.id },
    include: [
      {
        model: User,
        attributes: ['name']
      }
    ],
    order: [['date_created', 'DESC']]
  });

  res.render('blog', {
    blog: blog.get({ plain: true }),
    comments: comments.map(comment => comment.get({ plain: true })),
    logged_in: req.session.logged_in,
    userName: req.session.user_name
  });
}));

// Login page
router.get('/login', (req, res) => {
  // If already logged in, redirect to home
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('login', {
    title: 'Login',
    layout: 'auth' // Assuming you have a separate layout for auth pages
  });
});

// Signup page
router.get('/signup', (req, res) => {
  // If already logged in, redirect to home
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('signup', {
    title: 'Sign Up',
    layout: 'auth'
  });
});

module.exports = router;