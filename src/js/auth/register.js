import { register, validateEmail, validatePassword } from '../utils/auth.js';
import { renderNavbar } from '../components/navbar.js';

// Render registration form
export function renderRegister(container) {
  // Render the navbar first
  renderNavbar();
  
  // Create the registration form
  const registerForm = document.createElement('div');
  registerForm.className = 'container mt-5';
  registerForm.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Sign Up</h2>
            <form id="registerForm">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" required>
                <div class="invalid-feedback">Please enter a username.</div>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" required>
                <div class="invalid-feedback">Please enter a valid email address.</div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" required>
                <div class="invalid-feedback">
                  Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.
                </div>
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="confirmPassword" required>
                <div class="invalid-feedback">Passwords do not match.</div>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Sign Up</button>
              </div>
            </form>
            <div class="text-center mt-3">
              <p>Already have an account? <a href="#/login">Sign In</a></p>
            </div>
            <div id="errorMessage" class="alert alert-danger d-none mt-3"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.appendChild(registerForm);
  
  // Add form validation and submission handler
  const form = document.getElementById('registerForm');
  const errorMessage = document.getElementById('errorMessage');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset error message
    errorMessage.classList.add('d-none');
    
    // Get form values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate form
    let isValid = true;
    
    if (!username) {
      document.getElementById('username').classList.add('is-invalid');
      isValid = false;
    }
    
    if (!validateEmail(email)) {
      document.getElementById('email').classList.add('is-invalid');
      isValid = false;
    }
    
    if (!validatePassword(password)) {
      document.getElementById('password').classList.add('is-invalid');
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      document.getElementById('confirmPassword').classList.add('is-invalid');
      isValid = false;
    }
    
    if (!isValid) return;
    
    try {
      // Attempt registration
      await register(username, email, password);
      
      // Redirect to login page
      window.location.hash = '#/login';
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