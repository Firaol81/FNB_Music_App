// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
  // Check if Firebase is initialized
  if (!firebase.apps.length) {
    console.error('Firebase not initialized!');
    return;
  }

  // Check for logged-in user
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // User is signed in
      console.log('Logged in as:', user.displayName);
      document.getElementById('user-name').textContent = user.displayName;
      document.getElementById('user-photo').src = user.photoURL;
    } else {
      // No user is signed in
      console.log('No user signed in. Redirecting to login...');
      window.location.href = 'index.html'; // redirect to login page
    }
  });

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      firebase.auth().signOut().then(() => {
        console.log('User signed out');
        window.location.href = 'index.html';
      });
    });
  }
});
