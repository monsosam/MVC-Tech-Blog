const logout = async () => {
  try {
    const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    
    if (response.ok) {
        document.location.replace('/');
    } else {
        throw new Error(`Logout failed: ${response.statusText}`);
    }
} catch (error) {
    console.error('Logout error:', error);
    alert('An error occurred while logging out');
}
};
  
document.querySelector('#logout').addEventListener('click', logout);