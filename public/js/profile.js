// Get the create modal
var createModal = document.getElementById("createPostModal");

// Get the edit modal
var editModal = document.getElementById("editPostModal");

// Get the button that opens the create modal
var newButton = document.getElementById("new-button");

// Get the button that opens the edit modal
var editButtons = document.querySelectorAll(".edit-button");

// Get the <span> elements that close the modals
var createModalClose = createModal.getElementsByClassName("close")[0];
var editModalClose = editModal.getElementsByClassName("close")[0];

// When the user clicks on the button to create a new post, open the create modal
newButton.onclick = function () {
    createModal.style.display = "block";
}

// When the user clicks on <span> (x) in the create modal, close the create modal
createModalClose.onclick = function () {
    createModal.style.display = "none";
}

// When the user clicks on <span> (x) in the edit modal, close the edit modal
editModalClose.onclick = function () {
    editModal.style.display = "none";
}

// When the user clicks anywhere outside of the modals, close them
window.onclick = function (event) {
    if (event.target == createModal) {
        createModal.style.display = "none";
    }
    if (event.target == editModal) {
        editModal.style.display = "none";
    }
}

const newPostHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#title-post').value.trim();
    const content = document.querySelector('#content-post').value.trim();

    if (title && content) {
        const response = await fetch('./api/posts', {
            // Create new post using the posts route
            method: 'POST',
            body: JSON.stringify({ title, content }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            document.location.replace('/profile');
        } else {
            alert('Failed to create post')
        }
    }
};

const editPostHandler = async (event, postId) => {
    event.preventDefault();

    // Fetch post data based on post ID
    const response = await fetch(`./api/posts/${postId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const postData = await response.json();

        // Populate the edit modal fields with the fetched data
        document.querySelector('#edit-title-post').value = postData.title;
        document.querySelector('#edit-content-post').value = postData.content;

        // Open the edit modal
        editModal.style.display = 'block';

        const saveChangesHandler = async (event) => {
            event.preventDefault();

            const title = document.querySelector('#edit-title-post').value.trim();
            const content = document.querySelector('#edit-content-post').value.trim();

            if (title && content) {
                const response = await fetch(`./api/posts/${postId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ title, content }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    document.location.replace('/profile');
                } else {
                    alert('Failed to edit post')
                }
            }
        };

        document
            .querySelector('#saveChangesButton')
            .addEventListener('click', saveChangesHandler);
    } else {
        alert('Failed to fetch post data');
    }
};

const delButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');

        const response = await fetch(`/api/posts/${id}`, {
            // Use the delete method to remove the post and refresh the page
            method: 'DELETE',
        });

        if (response.ok) {
            document.location.replace('/profile');
        } else {
            alert('Failed to delete post')
        }
    }
}

// add event listeners for the respective buttons
editButtons.forEach(function (button) {
    button.onclick = function () {
        const postId = button.getAttribute('data-post-id');
        editPostHandler(event, postId);
    };
});

document
    .querySelector('#newPostButton')
    .addEventListener('click', newPostHandler);

document
    .querySelector('.delete-button')
    .addEventListener('click', delButtonHandler);