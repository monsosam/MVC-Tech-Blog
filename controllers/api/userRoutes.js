const router = require('express').Router();
const { User, Blog, Comment } = require('../../models');
const { withAuth } = require('../../config/middleware/auth');

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(`[User Route Error]: ${err.stack}`);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'An error occurred processing the user request'
  });
});

// Input validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validateUserInput = (name, email, password) => {
  const errors = [];
  if (!name) errors.push('Name is required');
  if (!email) errors.push('Email is required');
  else if (!validateEmail(email)) errors.push('Invalid email format');
  if (!password) errors.push('Password is required');
  else if (!validatePassword(password)) errors.push('Password must be at least 8 characters long');
  return errors;
};

// Session management helper
const saveSession = (req, userData) => {
  return new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) {
        reject(err);
        return;
      }
      req.session.user_id = userData.id;
      req.session.user_name = userData.name;
      req.session.logged_in = true;
      resolve();
    });
  });
};

// Create new user
router.post('/', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  const validationErrors = validateUserInput(name, email, password);
  if (validationErrors.length > 0) {
    res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    return;
  }

  // Check if email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    res.status(409).json({ message: 'Email already registered' });
    return;
  }

  const userData = await User.create({ name, email, password });
  await saveSession(req, userData);

  // Remove password from response
  const { password: _, ...userWithoutPassword } = userData.get({ plain: true });
  
  res.status(201).json({
    user: userWithoutPassword,
    message: 'User registered successfully'
  });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  // Find user and verify password
  const userData = await User.findOne({ where: { email } });
  if (!userData) {
    res.status(401).json({ message: 'Incorrect email or password' });
    return;
  }

  const validPassword = await userData.checkPassword(password);
  if (!validPassword) {
    res.status(401).json({ message: 'Incorrect email or password' });
    return;
  }

  await saveSession(req, userData);

  // Remove password from response
  const { password: _, ...userWithoutPassword } = userData.get({ plain: true });
  
  res.json({
    user: userWithoutPassword,
    message: 'Login successful'
  });
}));

// Logout
router.post('/logout', asyncHandler(async (req, res) => {
  if (req.session.logged_in) {
    await new Promise(resolve => req.session.destroy(resolve));
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful' });
  } else {
    res.status(400).json({ message: 'Not logged in' });
  }
}));

// Get current user profile
router.get('/profile', withAuth, asyncHandler(async (req, res) => {
  const userData = await User.findByPk(req.session.user_id, {
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Blog,
        attributes: ['id', 'title', 'date_created'],
        include: [
          {
            model: Comment,
            attributes: ['id']
          }
        ]
      }
    ]
  });

  if (!userData) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const user = userData.get({ plain: true });
  user.blogs = user.blogs.map(blog => ({
    ...blog,
    commentCount: blog.comments.length
  }));

  res.json(user);
}));

// Update user profile
router.put('/profile', withAuth, asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const updateData = {};

  // Validate and build update object
  if (name) updateData.name = name;
  if (email) {
    if (!validateEmail(email)) {
      res.status(400).json({ message: 'Invalid email format' });
      return;
    }
    // Check if new email is already taken
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser && existingUser.id !== req.session.user_id) {
      res.status(409).json({ message: 'Email already in use' });
      return;
    }
    updateData.email = email;
  }
  if (password) {
    if (!validatePassword(password)) {
      res.status(400).json({ message: 'Password must be at least 8 characters long' });
      return;
    }
    updateData.password = password;
  }

  // Update user
  await User.update(updateData, {
    where: { id: req.session.user_id },
    individualHooks: true // Ensure password hashing hooks run
  });

  // Fetch updated user data
  const userData = await User.findByPk(req.session.user_id, {
    attributes: { exclude: ['password'] }
  });

  res.json({
    user: userData,
    message: 'Profile updated successfully'
  });
}));

module.exports = router;
