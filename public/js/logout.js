const logoutButton = document.querySelector('#logout');

// Create a notification element
const createNotification = (message, isError = false) => {
  const notification = document.createElement('div');
  notification.className = `notification ${isError ? 'notification-error' : 'notification-success'}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
}, 3000);
};

const logout = async (event) => {
  event.preventDefault();

  // Disable the logout button and show loading state
  const originalText = logoutButton.textContent;
  logoutButton.disabled = true;
  logoutButton.classList.add('btn-loading');
  logoutButton.textContent = 'Logging out...';

  try {
      const response = await fetch('/api/users/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
          createNotification('Successfully logged out');
          // Small delay to show the success message before redirecting
          setTimeout(() => {
            window.location.replace('/login');
        }, 1000);
    } else {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText || 'Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
    createNotification(error.message || 'Failed to logout. Please try again.', true);
      
      // Reset button state
      logoutButton.disabled = false;
      logoutButton.classList.remove('btn-loading');
      logoutButton.textContent = originalText;
  }
};

// Add event listener if the logout button exists
if (logoutButton) {
  logoutButton.addEventListener('click', logout);
} else {
  console.warn('Logout button not found in the document');
}