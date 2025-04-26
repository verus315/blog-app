import { getUser } from '../utils/auth.js';

// Render the left explore sidebar
export function renderExploreSidebar() {
  const sidebar = document.createElement('div');
  sidebar.className = 'card';
  
  sidebar.innerHTML = `
    <div class="card-body">
      <h5 class="card-title mb-4">Explore</h5>
      
      <div class="list-group list-group-flush">
        <a href="#/" class="list-group-item list-group-item-action d-flex align-items-center ${window.location.hash === '#/' ? 'active' : ''}">
          <i class="fas fa-home me-3"></i> Home
        </a>
        <a href="#/trending" class="list-group-item list-group-item-action d-flex align-items-center">
          <i class="fas fa-fire me-3"></i> Trending
        </a>
        <a href="#/latest" class="list-group-item list-group-item-action d-flex align-items-center">
          <i class="fas fa-clock me-3"></i> Latest
        </a>
        <a href="#/bookmarks" class="list-group-item list-group-item-action d-flex align-items-center">
          <i class="fas fa-bookmark me-3"></i> Bookmarks
        </a>
      </div>
      
      <h6 class="card-subtitle mt-4 mb-3">Topics</h6>
      <div class="topics-container">
        <a href="#/topic/technology" class="badge bg-primary me-2 mb-2">Technology</a>
        <a href="#/topic/science" class="badge bg-secondary me-2 mb-2">Science</a>
        <a href="#/topic/health" class="badge bg-success me-2 mb-2">Health</a>
        <a href="#/topic/travel" class="badge bg-info me-2 mb-2">Travel</a>
        <a href="#/topic/food" class="badge bg-warning me-2 mb-2">Food</a>
        <a href="#/topic/sports" class="badge bg-danger me-2 mb-2">Sports</a>
        <a href="#/topic/books" class="badge bg-dark me-2 mb-2">Books</a>
        <a href="#/topic/movies" class="badge bg-secondary me-2 mb-2">Movies</a>
      </div>
    </div>
  `;
  
  return sidebar;
}

// Render the right sidebar with popular users and suggested content
export function renderRightSidebar() {
  const sidebar = document.createElement('div');
  sidebar.className = 'd-flex flex-column gap-4';
  
  // Popular Users Section
  const popularUsers = document.createElement('div');
  popularUsers.className = 'card';
  popularUsers.innerHTML = `
    <div class="card-body">
      <h5 class="card-title mb-4">Popular Users</h5>
      <div class="popular-users-list">
        <div class="d-flex align-items-center mb-3">
          <div class="avatar-container me-3">
            <div class="avatar bg-primary text-white">JD</div>
          </div>
          <div class="user-info">
            <h6 class="mb-0">John Doe</h6>
            <small class="text-muted">@johndoe</small>
          </div>
          <button class="btn btn-sm btn-outline-primary ms-auto">Follow</button>
        </div>
        
        <div class="d-flex align-items-center mb-3">
          <div class="avatar-container me-3">
            <div class="avatar bg-info text-white">SS</div>
          </div>
          <div class="user-info">
            <h6 class="mb-0">Sarah Smith</h6>
            <small class="text-muted">@sarahsmith</small>
          </div>
          <button class="btn btn-sm btn-outline-primary ms-auto">Follow</button>
        </div>
        
        <div class="d-flex align-items-center">
          <div class="avatar-container me-3">
            <div class="avatar bg-warning text-white">MJ</div>
          </div>
          <div class="user-info">
            <h6 class="mb-0">Mike Johnson</h6>
            <small class="text-muted">@mikejohnson</small>
          </div>
          <button class="btn btn-sm btn-outline-primary ms-auto">Follow</button>
        </div>
      </div>
    </div>
  `;
  
  // Suggested Content Section
  const suggestedContent = document.createElement('div');
  suggestedContent.className = 'card';
  suggestedContent.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="card-title mb-0">Suggested Content</h5>
        <button class="btn btn-sm btn-link text-decoration-none">×</button>
      </div>
      
      <div class="suggested-content-list">
        <a href="#/post/1" class="text-decoration-none">
          <div class="card mb-3">
            <img src="https://source.unsplash.com/random/400x300?nature" class="card-img-top" alt="Photography tips">
            <div class="card-body">
              <h6 class="card-title">10 Tips for Better Photography</h6>
            </div>
          </div>
        </a>
        
        <a href="#/post/2" class="text-decoration-none">
          <div class="card">
            <img src="https://source.unsplash.com/random/400x300?food" class="card-img-top" alt="Travel destinations">
            <div class="card-body">
              <h6 class="card-title">Travel Destinations for 2025</h6>
            </div>
          </div>
        </a>
      </div>
    </div>
  `;
  
  // Add components to sidebar
  sidebar.appendChild(popularUsers);
  sidebar.appendChild(suggestedContent);
  
  // Add event listeners
  setTimeout(() => {
    // Follow button click handlers
    const followButtons = sidebar.querySelectorAll('.btn-outline-primary');
    followButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const isFollowing = button.classList.contains('btn-primary');
        button.classList.toggle('btn-outline-primary');
        button.classList.toggle('btn-primary');
        button.textContent = isFollowing ? 'Follow' : 'Following';
      });
    });
    
    // Dismiss suggested content
    const dismissButton = sidebar.querySelector('.btn-link');
    if (dismissButton) {
      dismissButton.addEventListener('click', () => {
        suggestedContent.remove();
      });
    }
  }, 0);
  
  return sidebar;
} 