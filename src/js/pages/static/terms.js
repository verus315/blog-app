import { renderNavbar } from '../../components/navbar.js';

export function renderTerms(container) {
  // Render navbar
  renderNavbar();
  
  container.innerHTML = `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="mb-4">Terms of Service</h1>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">1. Acceptance of Terms</h5>
              <p class="card-text">
                By accessing or using SocialBlog, you agree to be bound by these Terms of Service. If you do not agree to these terms, 
                please do not use our services.
              </p>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">2. User Accounts</h5>
              <p class="card-text">When creating an account, you agree to:</p>
              <ul>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Not share your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">3. User Content</h5>
              <p class="card-text">You retain ownership of content you post, but grant us a license to:</p>
              <ul>
                <li>Display your content on our platform</li>
                <li>Modify content format for display purposes</li>
                <li>Share content with other users as intended</li>
              </ul>
              <p class="card-text">You are responsible for content you post and agree not to:</p>
              <ul>
                <li>Post illegal or harmful content</li>
                <li>Violate others' intellectual property rights</li>
                <li>Share misleading or false information</li>
                <li>Harass or bully other users</li>
              </ul>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">4. Prohibited Activities</h5>
              <p class="card-text">Users must not:</p>
              <ul>
                <li>Use automated systems without permission</li>
                <li>Attempt to access unauthorized areas</li>
                <li>Interfere with platform functionality</li>
                <li>Create multiple accounts for deceptive purposes</li>
                <li>Sell or transfer account access</li>
              </ul>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">5. Termination</h5>
              <p class="card-text">
                We reserve the right to suspend or terminate accounts that violate these terms or for any other reason at our discretion. 
                Users may terminate their account at any time.
              </p>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">6. Disclaimers</h5>
              <p class="card-text">
                Our services are provided "as is" without warranties. We are not responsible for user-generated content or third-party links.
              </p>
            </div>
          </div>
          
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">7. Contact Information</h5>
              <p class="card-text">
                For questions about these Terms of Service, please contact us:
              </p>
              <ul class="list-unstyled mb-0">
                <li><i class="fas fa-envelope me-2"></i>Email: legal@socialblog.com</li>
                <li><i class="fas fa-phone me-2"></i>Phone: (555) 123-4567</li>
                <li><i class="fas fa-map-marker-alt me-2"></i>Address: 123 Social Street, Blog City, BC 12345</li>
              </ul>
            </div>
          </div>
          
          <p class="text-muted mt-4">
            Last updated: March 15, 2024
          </p>
        </div>
      </div>
    </div>
  `;
} 