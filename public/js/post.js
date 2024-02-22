// Get the create modal
var commentModal = document.getElementById("createCommentModal");

// Get the button that opens the create modal
var commentButton = document.getElementById("comment-button");

// Get the <span> elements that close the modals
var commentModalClose = commentModal.getElementsByClassName("close")[0];

// When the user clicks on the button to create a new post, open the create modal
commentButton.onclick = function () {
    commentModal.style.display = "block";
}

// When the user clicks on <span> (x) in the create modal, close the create modal
commentModalClose.onclick = function () {
    commentModal.style.display = "none";
}

// When the user clicks anywhere outside of the modals, close them
window.onclick = function (event) {
    if (event.target == commentModal) {
        commentModal.style.display = "none";
    }
}

// use an element to retrive the current post for the comment
const currentPost = document.querySelector('#currentPost').textContent

const newCommentHandler = async (event) => {
    event.preventDefault();

    const content = document.querySelector('#add-comment').value.trim();

    if (content) {
        const response = await fetch(`/api/comments/${currentPost}`, {
            method: 'POST',
            body: JSON.stringify({ content }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            document.location.replace(`/post/${currentPost}`);
            console.log('Successful comment creation');
        } else {
            alert('Failed to create comment');
        }
    }
};

document
    .querySelector('#newCommentButton')
    .addEventListener('click', newCommentHandler);