import { renderNavbar } from '../../components/navbar.js';

export function renderHelp(container) {
  // Render navbar
  renderNavbar();
  
  container.innerHTML = `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="mb-4">Help Center</h1>
          
          <div class="accordion" id="helpAccordion">
            <!-- Getting Started -->
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#gettingStarted">
                  Getting Started
                </button>
              </h2>
              <div id="gettingStarted" class="accordion-collapse collapse show" data-bs-parent="#helpAccordion">
                <div class="accordion-body">
                  <h5>Creating an Account</h5>
                  <p>Click the "Sign Up" button in the navigation bar and fill out the registration form with your details.</p>
                  
                  <h5>Setting Up Your Profile</h5>
                  <p>After logging in, visit your dashboard to customize your profile picture and update your information.</p>
                  
                  <h5>Making Your First Post</h5>
                  <p>Click the "New Post" button on your dashboard or the home page to create your first post.</p>
                </div>
              </div>
            </div>
            
            <!-- Features Guide -->
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#features">
                  Features Guide
                </button>
              </h2>
              <div id="features" class="accordion-collapse collapse" data-bs-parent="#helpAccordion">
                <div class="accordion-body">
                  <h5>Posts</h5>
                  <ul>
                    <li>Create text posts with optional images</li>
                    <li>Like and comment on posts</li>
                    <li>Share posts with others</li>
                    <li>Edit or delete your own posts</li>
                  </ul>
                  
                  <h5>Comments</h5>
                  <ul>
                    <li>Add comments to any post</li>
                    <li>Reply to other comments</li>
                    <li>Like comments</li>
                  </ul>
                  
                  <h5>Dashboard</h5>
                  <ul>
                    <li>View your posts, likes, and comments</li>
                    <li>Manage your content</li>
                    <li>Track your engagement</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <!-- FAQ -->
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq">
                  Frequently Asked Questions
                </button>
              </h2>
              <div id="faq" class="accordion-collapse collapse" data-bs-parent="#helpAccordion">
                <div class="accordion-body">
                  <div class="mb-4">
                    <h5>How do I reset my password?</h5>
                    <p>Click the "Forgot Password" link on the login page and follow the instructions sent to your email.</p>
                  </div>
                  
                  <div class="mb-4">
                    <h5>Can I change my username?</h5>
                    <p>Yes, you can change your username in your profile settings. Note that this can only be done once every 30 days.</p>
                  </div>
                  
                  <div class="mb-4">
                    <h5>How do I report inappropriate content?</h5>
                    <p>Click the "Report" button on any post or comment to notify our moderation team.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card mt-4">
            <div class="card-body">
              <h5 class="card-title">Still Need Help?</h5>
              <p class="card-text">
                If you couldn't find the answer you're looking for, please contact our support team:
              </p>
              <ul class="list-unstyled mb-0">
                <li><i class="fas fa-envelope me-2"></i>Email: support@socialblog.com</li>
                <li><i class="fas fa-clock me-2"></i>Response time: Within 24 hours</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
} 