import { renderNavbar } from '../../components/navbar.js';

export function renderPrivacy(container) {
  // Render navbar
  renderNavbar();
  
  container.innerHTML = `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="mb-4">Privacy Policy</h1>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Information We Collect</h5>
              <p class="card-text">
                We collect information that you provide directly to us when you:
              </p>
              <ul>
                <li>Create an account</li>
                <li>Create or share content</li>
                <li>Communicate with other users</li>
                <li>Contact our support team</li>
              </ul>
              <p class="card-text">
                This information may include your name, email address, profile picture, and any content you post on our platform.
              </p>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">How We Use Your Information</h5>
              <p class="card-text">We use the information we collect to:</p>
              <ul>
                <li>Provide and maintain our services</li>
                <li>Process your transactions</li>
                <li>Send you notifications and updates</li>
                <li>Respond to your comments and questions</li>
                <li>Protect against malicious or fraudulent activity</li>
                <li>Improve our services and develop new features</li>
              </ul>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Information Sharing</h5>
              <p class="card-text">
                We do not sell your personal information to third parties. We may share your information with:
              </p>
              <ul>
                <li>Service providers who assist in operating our platform</li>
                <li>Law enforcement when required by law</li>
                <li>Other users when you choose to make your content public</li>
              </ul>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Data Security</h5>
              <p class="card-text">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction.
              </p>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Your Rights</h5>
              <p class="card-text">You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to processing of your information</li>
                <li>Export your data</li>
              </ul>
            </div>
          </div>
          
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Contact Us</h5>
              <p class="card-text">
                If you have any questions about our Privacy Policy, please contact our Data Protection Officer:
              </p>
              <ul class="list-unstyled mb-0">
                <li><i class="fas fa-envelope me-2"></i>Email: privacy@socialblog.com</li>
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