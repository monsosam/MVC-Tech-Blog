const createModal = document.getElementById("createPostModal");
const editModal = document.getElementById("editPostModal");
const newButton = document.getElementById("new-button");
const editButtons = document.querySelectorAll(".edit-button");
const createModalClose = createModal.querySelector(".close");
const editModalClose = editModal.querySelector(".close");

// When the user clicks on the button to create a new post, open the create modal
newButton.addEventListener("click", () => {
  createModal.style.display = "block";
});

// When the user clicks on <span> (x) in the create modal, close the create modal
createModalClose.addEventListener("click", () => {
  createModal.style.display = "none";
});

// When the user clicks on <span> (x) in the edit modal, close the edit modal
editModalClose.addEventListener("click", () => {
  editModal.style.display = "none";
});

// When the user clicks anywhere outside of the modals, close them
window.addEventListener("click", (event) => {
  if (event.target === createModal) {
    createModal.style.display = "none";
  }
  if (event.target === editModal) {
    editModal.style.display = "none";
  }
});

const newPostHandler = async (event) => {
  event.preventDefault();
  const title = document.querySelector("#title-post").value.trim();
  const content = document.querySelector("#content-post").value.trim();
  if (title && content) {
    const response = await fetch("./api/posts", {
      method: "POST",
      body: JSON.stringify({ title, content }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      document.location.replace("/profile");
    } else {
      alert("Failed to create post");
    }
  }
};

const editPostHandler = async (postId) => {
  const response = await fetch(`./api/posts/${postId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const postData = await response.json();
    document.querySelector("#edit-title-post").value = postData.title;
    document.querySelector("#edit-content-post").value = postData.content;
    editModal.style.display = "block";
    const saveChangesHandler = async (event) => {
      event.preventDefault();
      const title = document.querySelector("#edit-title-post").value.trim();
      const content = document.querySelector("#edit-content-post").value.trim();
      if (title && content) {
        const response = await fetch(`./api/posts/${postId}`, {
          method: "PUT",
          body: JSON.stringify({ title, content }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          document.location.replace("/profile");
        } else {
          alert("Failed to edit post");
        }
      }
    };
    document
      .querySelector("#saveChangesButton")
      .addEventListener("click", saveChangesHandler);
  } else {
    alert("Failed to fetch post data");
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute("data-id")) {
    const id = event.target.getAttribute("data-id");
    const response = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      document.location.replace("/profile");
    } else {
      alert("Failed to delete post");
    }
  }
};

// add event listeners for the respective buttons
editButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const postId = button.getAttribute("data-id");
    editPostHandler(postId);
  });
});

document
  .querySelector("#newPostButton")
  .addEventListener("click", newPostHandler);

document
  .querySelector("#deletePostButton")
  .addEventListener("click", delButtonHandler);
