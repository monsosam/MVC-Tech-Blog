// config/middleware/auth.js

// Middleware to protect routes that require authentication
const withAuth = (req, res, next) => {
    if (!req.session.logged_in) {
      // Store intended URL for redirect after login
      req.session.intended_url = req.originalUrl;
      
      if (req.path.startsWith('/api/')) {
        return res.status(401).json({ 
          message: 'Please log in to access this resource' 
        });
      }
      return res.redirect('/login');
    }
    next();
};
  
// Middleware to redirect authenticated users away from auth pages
const redirectIfAuthenticated = (req, res, next) => {
    if (req.session.logged_in) {
      return res.redirect('/dashboard');
    }
    next();
};
  
module.exports = {
    withAuth,
    redirectIfAuthenticated
};