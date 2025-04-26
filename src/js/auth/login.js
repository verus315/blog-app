import { login, validateEmail } from '../utils/auth.js';
import { renderNavbar } from '../components/navbar.js';

// Render login form
export function renderLogin(container) {
  // Render navbar
  renderNavbar();
  
  // Create login form
  const loginForm = document.createElement('div');
  loginForm.className = 'container mt-5';
  loginForm.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Sign In</h2>
            <form id="loginForm">
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" required>
                <div class="invalid-feedback">Please enter a valid email address.</div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" required>
                <div class="invalid-feedback">Please enter your password.</div>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Sign In</button>
              </div>
            </form>
            <div class="text-center mt-3">
              <p>Don't have an account? <a href="#/register">Sign Up</a></p>
            </div>
            <div id="errorMessage" class="alert alert-danger d-none mt-3"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.appendChild(loginForm);
  
  // Add form validation and submission handler
  const form = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset error message
    errorMessage.classList.add('d-none');
    
    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validate email
    if (!validateEmail(email)) {
      document.getElementById('email').classList.add('is-invalid');
      return;
    }
    
    try {
      // Attempt login
      await login(email, password);
      
      // Update navbar
      renderNavbar();
      
      // Redirect to dashboard
      window.location.hash = '#/dashboard';
    } catch (error) {
      // Show error message
      errorMessage.textContent = error.message;
      errorMessage.classList.remove('d-none');
    }
  });
  
  // Clear validation on input
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
    });
  });
}