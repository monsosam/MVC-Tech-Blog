const commentForm = document.getElementById("comment");
const submitButton = commentForm.querySelector('button[type="submit"]');
let originalButtonText;

function showError(message) {
  // Create or update error message element
  let errorDiv = document.getElementById('comment-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'comment-error';
        errorDiv.className = 'form-error';
        commentForm.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function clearError() {
  const errorDiv = document.getElementById('comment-error');
  if (errorDiv) {
      errorDiv.remove();
  }
}

function setLoading(isLoading) {
  if (isLoading) {
      originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Posting...';
      submitButton.disabled = true;
      submitButton.classList.add('btn-loading');
  } else {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      submitButton.classList.remove('btn-loading');
  }
}

function validateComment(content) {
  if (!content || content.trim().length === 0) {
      throw new Error('Comment cannot be empty');
  }
  if (content.length > 500) {
      throw new Error('Comment is too long (maximum 500 characters)');
  }
  return content.trim();
}

commentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
    clearError();

    const { content: contentInput } = event.target.elements;
    const blogId = event.target.dataset.blogid;

  try {
      // Validate input
      const validatedContent = validateComment(contentInput.value);

      // Prepare comment data
      const commentData = {
        content: validatedContent,
        blog_id: blogId
    };

      // Show loading state
      setLoading(true);

      // Submit comment
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
    });

      // Handle response
      if (response.ok) {
        window.location.href = `/blog/${blogId}`;
    } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post comment');
    }
} catch (error) {
    showError(error.message);
    setLoading(false);
}
});

// Character counter
const contentInput = commentForm.querySelector('textarea[name="content"]');
if (contentInput) {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    contentInput.parentNode.insertBefore(counter, contentInput.nextSibling);

    contentInput.addEventListener('input', () => {
        const remaining = 500 - contentInput.value.length;
        counter.textContent = `${remaining} characters remaining`;
        counter.classList.toggle('near-limit', remaining < 50);
    });
}
