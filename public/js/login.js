// Utility functions for form handling
const formUtils = {
  setLoading: (button, isLoading) => {
      button.disabled = isLoading;
      button.classList.toggle('btn-loading', isLoading);
      button.textContent = isLoading ? 'Please wait...' : button.dataset.originalText;
  },

  showError: (formEl, message) => {
      let errorDiv = formEl.querySelector('.form-error');
      if (!errorDiv) {
          errorDiv = document.createElement('div');
          errorDiv.className = 'form-error';
          formEl.appendChild(errorDiv);
      }
      errorDiv.textContent = message;
  },

  clearError: (formEl) => {
      const errorDiv = formEl.querySelector('.form-error');
      if (errorDiv) errorDiv.remove();
  },

  validateEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  }
};

// Login form handler
const loginFormHandler = async (event) => {
  event.preventDefault();
  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  
  if (!submitButton.dataset.originalText) {
      submitButton.dataset.originalText = submitButton.textContent;
  }

  formUtils.clearError(form);

  const email = document.querySelector("#email-login").value.trim();
  const password = document.querySelector("#password-login").value.trim();

  // Validate inputs
  if (!email || !password) {
    formUtils.showError(form, 'Please fill in all fields');
    return;
}

if (!formUtils.validateEmail(email)) {
    formUtils.showError(form, 'Please enter a valid email address');
    return;
}

try {
    formUtils.setLoading(submitButton, true);

    const response = await fetch("/api/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (response.ok) {
        window.location.href = "/";
    } else {
        formUtils.showError(form, data.message || 'Invalid email or password');
    }
} catch (error) {
    formUtils.showError(form, 'An error occurred. Please try again.');
} finally {
    formUtils.setLoading(submitButton, false);
}
};

// Signup form handler
const signupFormHandler = async (event) => {
  event.preventDefault();
  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  
  if (!submitButton.dataset.originalText) {
      submitButton.dataset.originalText = submitButton.textContent;
  }

  formUtils.clearError(form);

  const name = document.querySelector("#name-signup").value.trim();
  const email = document.querySelector("#email-signup").value.trim();
  const password = document.querySelector("#password-signup").value.trim();
  const confirmPassword = document.querySelector("#confirmPassword-signup").value.trim();

  // Validation checks
  const errors = [];
  if (!name) errors.push('Name is required');
  if (!email) errors.push('Email is required');
  if (!formUtils.validateEmail(email)) errors.push('Please enter a valid email address');
  if (!password) errors.push('Password is required');
  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!confirmPassword || password !== confirmPassword) errors.push('Passwords do not match');

  if (errors.length > 0) {
      formUtils.showError(form, errors.join('\n'));
      return;
  }

  try {
      formUtils.setLoading(submitButton, true);

      const response = await fetch("/api/users", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
          headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
          window.location.href = "/";
      } else {
          formUtils.showError(form, data.message || 'Failed to create account');
      }
  } catch (error) {
      formUtils.showError(form, 'An error occurred. Please try again.');
  } finally {
      formUtils.setLoading(submitButton, false);
  }
};

// Password strength indicator
const setupPasswordStrengthIndicator = () => {
  const passwordInput = document.querySelector("#password-signup");
  const strengthIndicator = document.createElement('div');
  strengthIndicator.className = 'password-strength';

  if (passwordInput) {
      passwordInput.parentNode.insertBefore(strengthIndicator, passwordInput.nextSibling);

      passwordInput.addEventListener('input', () => {
          const value = passwordInput.value;
          let strength = 0;
          
          if (value.length >= 8) strength++;
          if (value.match(/[a-z]/) && value.match(/[A-Z]/)) strength++;
          if (value.match(/[0-9]/)) strength++;
          if (value.match(/[^a-zA-Z0-9]/)) strength++;

          strengthIndicator.classList.remove('password-strength-weak', 'password-strength-moderate', 'password-strength-strong');
          
          let message = '';
          switch (strength) {
              case 0:
              case 1:
                  message = 'Weak';
                  strengthIndicator.classList.add('password-strength-weak');
                  break;
              case 2:
                  message = 'Moderate';
                  strengthIndicator.classList.add('password-strength-moderate');
                  break;
              case 3:
              case 4:
                  message = strength === 4 ? 'Very Strong' : 'Strong';
                  strengthIndicator.classList.add('password-strength-strong');
                  break;
          }

          strengthIndicator.textContent = `Password strength: ${message}`;
      });
  }
};

// Event listeners
document.querySelector(".login-form").addEventListener("submit", loginFormHandler);
document.querySelector(".signup-form").addEventListener("submit", signupFormHandler);

// Initialize password strength indicator
setupPasswordStrengthIndicator();
