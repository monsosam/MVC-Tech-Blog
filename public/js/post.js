const commentModal = document.getElementById("createCommentModal");
const commentButton = document.getElementById("comment-button");
const commentModalClose = commentModal.querySelector(".close");

// When the user clicks on the button to create a new post, open the create modal
commentButton.addEventListener("click", () => {
  commentModal.style.display = "block";
});

// When the user clicks on <span> (x) in the create modal, close the create modal
commentModalClose.addEventListener("click", () => {
  commentModal.style.display = "none";
});

// When the user clicks anywhere outside of the modals, close them
window.addEventListener("click", (event) => {
  if (event.target === commentModal) {
    commentModal.style.display = "none";
  }
});

// Use an element to retrive the current post for the comment
const currentPost = document.querySelector("#currentPost").textContent;

const newCommentHandler = async (event) => {
  event.preventDefault();
  const content = document.querySelector("#add-comment").value.trim();
  if (content) {
    const response = await fetch(`/api/comments/${currentPost}`, {
      method: "POST",
      body: JSON.stringify({ content }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      document.location.replace(`/post/${currentPost}`);
      console.log("Comment added");
    } else {
      alert("Failed to comment");
    }
  }
};

const newFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value;
  const content = document.querySelector('input[name="content"]').value;

  const response = await fetch(`/api/posts`, {
    method: "POST",
    body: JSON.stringify({
      title,
      content,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  response.ok
    ? document.location.replace("/homepage")
    : alert(response.statusText);
};

document
  .querySelector("#newCommentButton")
  .addEventListener("click", newCommentHandler);

document
  .querySelector("#new-post-form")
  .addEventListener("submit", newFormHandler);
