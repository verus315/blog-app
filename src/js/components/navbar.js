import { isAuthenticated, getUser, logout } from '../utils/auth.js';
import { Events, subscribe, unsubscribe } from '../utils/events.js';

let navbarInitialized = false;

// Event handlers
const eventHandlers = {
  handleLogin: () => {
    renderNavbar();
  },
  handleLogout: () => {
    renderNavbar();
  }
};

// Render navigation bar
export function renderNavbar() {
  // Subscribe to auth events if not already initialized
  if (!navbarInitialized) {
    subscribe(Events.AUTH_LOGIN, eventHandlers.handleLogin);
    subscribe(Events.AUTH_LOGOUT, eventHandlers.handleLogout);
    navbarInitialized = true;
  }
  
  const authenticated = isAuthenticated();
  const user = authenticated ? getUser() : null;
  
  const nav = document.createElement('nav');
  nav.className = 'navbar navbar-expand-lg navbar-dark bg-primary';
  
  nav.innerHTML = `
    <div class="container">
      <a class="navbar-brand" href="#/">
        <i class="fas fa-blog me-2"></i>SocialBlog
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" 
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link" href="#/">Home</a>
          </li>
          ${authenticated ? `
            <li class="nav-item">
              <a class="nav-link" href="#/dashboard">Dashboard</a>
            </li>
          ` : ''}
        </ul>
        <div class="d-flex align-items-center">
          <!-- Theme toggle -->
          <div class="form-check form-switch me-3">
            <input class="form-check-input" type="checkbox" id="themeToggle">
            <label class="form-check-label text-light" for="themeToggle">
              <i class="fas fa-moon"></i>
            </label>
          </div>
          
          ${authenticated ? `
            <div class="dropdown">
              <a class="nav-link dropdown-toggle text-light" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random" 
                     class="avatar avatar-sm me-2" alt="${user.username}'s avatar">
                ${user.username}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#/dashboard"><i class="fas fa-tachometer-alt me-2"></i>Dashboard</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
              </ul>
            </div>
          ` : `
            <a href="#/login" class="btn btn-outline-light me-2">Sign In</a>
            <a href="#/register" class="btn btn-light">Sign Up</a>
          `}
        </div>
      </div>
    </div>
  `;
  
  // Remove any existing navbar
  const existingNavbar = document.querySelector('.navbar');
  if (existingNavbar) {
    existingNavbar.remove();
  }
  
  // Append the navbar to the document body
  document.body.prepend(nav);
  
  // Add event listeners
  if (authenticated) {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      logout();
      window.location.hash = '#/';
      window.location.reload();
    });
  }
  
  // Set up theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  if (currentTheme === 'dark') {
    themeToggle.checked = true;
    document.body.setAttribute('data-bs-theme', 'dark');
  }
  
  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      document.body.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}