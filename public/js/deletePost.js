const postId = document.querySelector('input[name="post-id"]').value;
console.log("testing");
console.log(postId);

const deleteClickHandler = async () => {
    await fetch(`/api/post/${postId}`, {
      method: 'DELETE'
    });
  
    document.location.replace('/dashboard');
};

document
  .querySelector('#delete-btn')
  .addEventListener('click', deleteClickHandler);