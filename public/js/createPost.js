const createFormHandler = async function(event) {
    event.preventDefault();
  
    const postTitle = document.querySelector('input[name="post-title"]').value;
    const postContent = document.querySelector('textarea[name="post-body"]').value;
  
    console.log(postTitle);
    console.log(postContent);
  
    await fetch(`/api/post`, {
      method: 'POST',
      body: JSON.stringify({
        postTitle,
        postContent,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
  
    // document.location.replace('/dashboard');
};
  
document
    .querySelector('#create-post-form')
    .addEventListener('submit', createFormHandler);