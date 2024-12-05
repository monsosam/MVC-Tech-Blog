// controllers/api/index.js

const router = require('express').Router()
const userRoutes = require('./userRoutes')
const blogRoutes = require('./postRoutes')
const commentRoutes = require('./commentRoutes')


// Request logging middleware
router.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
});

// API validation middleware
router.use((req, res, next) => {
    // Ensure JSON content-type for POST/PUT requests
    if ((req.method === 'POST' || req.method === 'PUT') && 
        !req.is('application/json')) {
      return res.status(415).json({
        message: 'Content-Type must be application/json'
      });
    }
  
    // Add CORS headers if needed
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

// Session check middleware
const checkSession = (req, res, next) => {
    if (!req.session) {
      return res.status(500).json({
        message: 'Server error: Session handling is not properly configured'
      });
    }
    next();
};
  
router.use(checkSession);

// API routes
router.use('/users', userRoutes)
router.use('/blogs', blogRoutes)
router.use('/comments', commentRoutes)

// API documentation route
router.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the Blog API',
      version: '1.0',
      endpoints: {
        users: {
          base: '/api/users',
          methods: {
            POST: '/api/users - Create new user',
            'POST /login': '/api/users/login - User login',
            'POST /logout': '/api/users/logout - User logout'
          }
        },
        blogs: {
          base: '/api/blogs',
          methods: {
            GET: '/api/blogs - Get all blogs',
            'GET /:id': '/api/blogs/:id - Get single blog',
            POST: '/api/blogs - Create new blog (auth required)',
            'PUT /:id': '/api/blogs/:id - Update blog (auth required)',
            'DELETE /:id': '/api/blogs/:id - Delete blog (auth required)'
          }
        },
        comments: {
          base: '/api/comments',
          methods: {
            POST: '/api/comments - Create new comment (auth required)',
            'DELETE /:id': '/api/comments/:id - Delete comment (auth required)'
          }
        }
      }
    });
});

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(`[Error] ${err.stack}`);
    
    // Handle Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: err.errors.map(e => e.message)
      });
    }
  
    // Handle other known errors
    if (err.status && err.message) {
      return res.status(err.status).json({
        message: err.message
      });
    }
  
    // Handle unknown errors
    res.status(500).json({
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message
    });
});

// 404 handler for undefined API routes
router.use((req, res) => {
    res.status(404).json({
      message: 'API endpoint not found',
      availableEndpoints: ['/users', '/blogs', '/comments'],
      documentation: '/api'
    });
});

module.exports = router
