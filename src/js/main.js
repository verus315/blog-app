import { renderLogin } from './auth/login.js';
import { renderRegister } from './auth/register.js';
import { renderHome } from './pages/home.js';
import { renderUserDashboard } from './pages/userDashboard.js';
import { renderAdminDashboard } from './pages/adminDashboard.js';
import { renderModeratorDashboard } from './pages/moderatorDashboard.js';
import { renderAbout } from './pages/static/about.js';
import { renderHelp } from './pages/static/help.js';
import { renderPrivacy } from './pages/static/privacy.js';
import { renderTerms } from './pages/static/terms.js';
import { renderGuidelines } from './pages/static/guidelines.js';
import { initThemeToggle } from './utils/theme.js';
import { isAuthenticated, getUserRole } from './utils/auth.js';

// Function to setup routes
function setupRoutes() {
  const app = document.querySelector('#app');
  const currentPath = window.location.hash.substring(1) || '/';
  
  // Clear app container
  app.innerHTML = '';
  
  // Check authentication status
  const authenticated = isAuthenticated();
  const userRole = authenticated ? getUserRole() : null;
  
  // Simple client-side router
  switch(currentPath) {
    case '/':
      renderHome(app);
      break;
    case '/login':
      if (authenticated) {
        navigateToDashboard(userRole);
      } else {
        renderLogin(app);
      }
      break;
    case '/register':
      if (authenticated) {
        navigateToDashboard(userRole);
      } else {
        renderRegister(app);
      }
      break;
    case '/dashboard':
      if (!authenticated) {
        window.location.hash = '#/login';
        return;
      }
      navigateToDashboard(userRole);
      break;
    case '/user-dashboard':
      if (!authenticated) {
        window.location.hash = '#/login';
        return;
      }
      renderUserDashboard(app);
      break;
    case '/admin-dashboard':
      if (!authenticated || userRole !== 'admin') {
        window.location.hash = '#/login';
        return;
      }
      renderAdminDashboard(app);
      break;
    case '/moderator-dashboard':
      if (!authenticated || userRole !== 'moderator') {
        window.location.hash = '#/login';
        return;
      }
      renderModeratorDashboard(app);
      break;
    // Static pages
    case '/about':
      renderAbout(app);
      break;
    case '/help':
      renderHelp(app);
      break;
    case '/privacy':
      renderPrivacy(app);
      break;
    case '/terms':
      renderTerms(app);
      break;
    case '/guidelines':
      renderGuidelines(app);
      break;
    default:
      app.innerHTML = `
        <div class="container mt-5 text-center">
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <a href="#/" class="btn btn-primary">Go Home</a>
        </div>
      `;
  }
}

// Navigate to the appropriate dashboard based on role
function navigateToDashboard(role) {
  switch(role) {
    case 'admin':
      window.location.hash = '#/admin-dashboard';
      break;
    case 'moderator':
      window.location.hash = '#/moderator-dashboard';
      break;
    default:
      window.location.hash = '#/user-dashboard';
  }
}

// Initialize the application
function initApp() {
  // Set up the router
  window.addEventListener('hashchange', setupRoutes);
  
  // Initialize theme toggle functionality
  initThemeToggle();
  
  // Load initial route
  setupRoutes();
}

// Start the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);