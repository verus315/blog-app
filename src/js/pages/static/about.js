import { renderNavbar } from '../../components/navbar.js';

export function renderAbout(container) {
  // Render navbar
  renderNavbar();
  
  container.innerHTML = `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="mb-4">About SocialBlog</h1>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Our Mission</h5>
              <p class="card-text">
                SocialBlog is a platform dedicated to connecting people through meaningful content sharing and discussions. 
                We believe in fostering a community where ideas can be freely exchanged while maintaining respect and civility.
              </p>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">What We Offer</h5>
              <ul class="list-unstyled">
                <li class="mb-3">
                  <i class="fas fa-users text-primary me-2"></i>
                  <strong>Community Engagement</strong>
                  <p class="ms-4 mb-0">Connect with like-minded individuals and engage in meaningful discussions.</p>
                </li>
                <li class="mb-3">
                  <i class="fas fa-shield-alt text-primary me-2"></i>
                  <strong>Safe Environment</strong>
                  <p class="ms-4 mb-0">We maintain strict community guidelines to ensure a respectful atmosphere.</p>
                </li>
                <li class="mb-3">
                  <i class="fas fa-lightbulb text-primary me-2"></i>
                  <strong>Knowledge Sharing</strong>
                  <p class="ms-4 mb-0">Share your expertise and learn from others in our diverse community.</p>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Contact Us</h5>
              <p class="card-text">
                Have questions or suggestions? We'd love to hear from you!
              </p>
              <ul class="list-unstyled">
                <li><i class="fas fa-envelope me-2"></i>Email: support@socialblog.com</li>
                <li><i class="fas fa-phone me-2"></i>Phone: (555) 123-4567</li>
                <li><i class="fas fa-map-marker-alt me-2"></i>Address: 123 Social Street, Blog City, BC 12345</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
} 