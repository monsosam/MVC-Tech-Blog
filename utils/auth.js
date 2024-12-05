// utils/auth.js

// Helper function to check if a password meets requirements
const validatePassword = (password) => {
  const minLength = 8;
  return password.length >= minLength;
};

// Helper function to sanitize user input
const sanitizeUser = (userData) => {
  return {
    ...userData,
    email: userData.email.toLowerCase().trim(),
    name: userData.name.trim()
  };
};

// Helper function to check for valid email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validatePassword,
  sanitizeUser,
  validateEmail
};