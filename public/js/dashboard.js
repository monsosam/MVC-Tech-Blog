const createPostButton = document.getElementById('grabPost');

const navigateToCreatePost = (event) => {
  event.preventDefault();

  // Visual feedback while navigating
  createPostButton.disabled = true;
  createPostButton.classList.add('btn-loading');
  createPostButton.textContent = 'Loading...';

  // Navigate to create blog page
  window.location.href = '/createblog';
};

// Add event listener if the create post button exists
if (createPostButton) {
  createPostButton.addEventListener('click', navigateToCreatePost);
} else {
  console.warn('Create post button not found in the document');
}
