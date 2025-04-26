import { renderNavbar } from '../../components/navbar.js';

export function renderGuidelines(container) {
  // Render navbar
  renderNavbar();
  
  container.innerHTML = `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="mb-4">Community Guidelines</h1>
          
          <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            These guidelines help maintain a respectful and engaging environment for all users.
          </div>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">1. Be Respectful</h5>
              <p class="card-text">Treat all members with respect, regardless of their:</p>
              <ul>
                <li>Background or identity</li>
                <li>Personal beliefs</li>
                <li>Level of experience</li>
                <li>Opinions or viewpoints</li>
              </ul>
              <p class="card-text">
                Disagreements are natural, but always express them professionally and constructively.
              </p>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">2. Keep It Safe</h5>
              <p class="card-text">Do not post content that:</p>
              <ul>
                <li>Promotes violence or hatred</li>
                <li>Contains explicit or adult material</li>
                <li>Reveals personal information without consent</li>
                <li>Encourages dangerous or illegal activities</li>
              </ul>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">3. Be Authentic</h5>
              <p class="card-text">When participating in our community:</p>
              <ul>
                <li>Use an appropriate username</li>
                <li>Share genuine experiences and thoughts</li>
                <li>Give credit when sharing others' work</li>
                <li>Be transparent about any conflicts of interest</li>
              </ul>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">4. Quality Content</h5>
              <p class="card-text">When creating posts:</p>
              <ul>
                <li>Write clear and meaningful content</li>
                <li>Use appropriate formatting</li>
                <li>Check for accuracy before posting</li>
                <li>Avoid excessive self-promotion</li>
                <li>Don't spam or post repetitive content</li>
              </ul>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">5. Reporting & Moderation</h5>
              <p class="card-text">Help keep our community safe:</p>
              <ul>
                <li>Report content that violates guidelines</li>
                <li>Provide context when reporting</li>
                <li>Don't abuse the reporting system</li>
                <li>Respect moderator decisions</li>
              </ul>
            </div>
          </div>
          
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Consequences</h5>
              <p class="card-text">Violations of these guidelines may result in:</p>
              <ul>
                <li>Content removal</li>
                <li>Temporary account suspension</li>
                <li>Permanent account termination</li>
              </ul>
              <hr>
              <p class="mb-0">
                <i class="fas fa-question-circle me-2"></i>
                Questions about these guidelines? Contact our moderation team at 
                <a href="mailto:moderation@socialblog.com">moderation@socialblog.com</a>
              </p>
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