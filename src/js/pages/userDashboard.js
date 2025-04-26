import { renderNavbar } from '../components/navbar.js';
import { renderPost, setupPostEventListeners } from '../components/post.js';
import { createPostModal, createReportModal } from '../components/postCreator.js';
import { apiGetUserPosts } from '../api/postApi.js';
import { getUser } from '../utils/auth.js';

// Render user dashboard
export async function renderUserDashboard(container) {
  // Render navbar first
  renderNavbar();
  
  // Get current user
  const user = getUser();
  
  // Create dashboard structure
  container.innerHTML = `
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-3 col-md-4 bg-light sidebar d-none d-md-block">
          <div class="position-sticky pt-4">
            <div class="text-center mb-4">
              <img src="${user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`}" 
                   class="avatar avatar-lg mb-3" alt="${user.username}'s avatar">
              <h5>${user.username}</h5>
              <p class="text-muted">@${user.username.toLowerCase()}</p>
            </div>
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link active" href="#/user-dashboard" id="myPostsLink">
                  <i class="fas fa-clone me-2"></i> My Posts
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#/user-dashboard/likes" id="myLikesLink">
                  <i class="fas fa-heart me-2"></i> My Likes
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#/user-dashboard/comments" id="myCommentsLink">
                  <i class="fas fa-comments me-2"></i> My Comments
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#/user-dashboard/bookmarks" id="myBookmarksLink">
                  <i class="fas fa-bookmark me-2"></i> Bookmarks
                </a>
              </li>

            </ul>
          </div>
        </div>
        
        <!-- Main content -->
        <div class="col-lg-9 col-md-8 dashboard-content">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 id="dashboardTitle">My Posts</h3>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createPostModal">
              <i class="fas fa-plus me-2"></i> New Post
            </button>
          </div>
          
          <!-- Stats cards -->
          <div class="row mb-4">
            <div class="col-md-4 mb-3 mb-md-0">
              <div class="stat-card bg-primary text-white">
                <i class="fas fa-clone"></i>
                <h3 id="postCount">0</h3>
                <p>Posts</p>
              </div>
            </div>
            <div class="col-md-4 mb-3 mb-md-0">
              <div class="stat-card bg-success text-white">
                <i class="fas fa-heart"></i>
                <h3 id="likesCount">0</h3>
                <p>Likes Received</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="stat-card bg-info text-white">
                <i class="fas fa-comments"></i>
                <h3 id="commentsCount">0</h3>
                <p>Comments Received</p>
              </div>
            </div>
          </div>
          
          <!-- Mobile nav -->
          <div class="d-md-none mb-4">
            <div class="list-group list-group-horizontal overflow-auto">
              <a href="#/user-dashboard" class="list-group-item list-group-item-action active" id="mobileMyPostsLink">
                <i class="fas fa-clone me-2"></i> My Posts
              </a>
              <a href="#/user-dashboard/likes" class="list-group-item list-group-item-action" id="mobileMyLikesLink">
                <i class="fas fa-heart me-2"></i> Likes
              </a>
              <a href="#/user-dashboard/comments" class="list-group-item list-group-item-action" id="mobileMyCommentsLink">
                <i class="fas fa-comments me-2"></i> Comments
              </a>
              <a href="#/user-dashboard/bookmarks" class="list-group-item list-group-item-action" id="mobileMyBookmarksLink">
                <i class="fas fa-bookmark me-2"></i> Bookmarks
              </a>
            </div>
          </div>
          
          <!-- Content container -->
          <div id="dashboardContent">
            <div class="text-center my-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading content...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add post creation and report modals
  createPostModal();
  createReportModal();
  
  // Set up navigation
  setupDashboardNavigation();
  
  // Set up real-time updates listener
  setupRealTimeUpdates();
  
  // Load initial content
  loadDashboardContent();
}

// Set up dashboard navigation
function setupDashboardNavigation() {
  // Desktop navigation
  const myPostsLink = document.getElementById('myPostsLink');
  const myLikesLink = document.getElementById('myLikesLink');
  const myCommentsLink = document.getElementById('myCommentsLink');
  const myBookmarksLink = document.getElementById('myBookmarksLink');
  const profileSettingsLink = document.getElementById('profileSettingsLink');
  
  // Mobile navigation
  const mobileMyPostsLink = document.getElementById('mobileMyPostsLink');
  const mobileMyLikesLink = document.getElementById('mobileMyLikesLink');
  const mobileMyCommentsLink = document.getElementById('mobileMyCommentsLink');
  const mobileMyBookmarksLink = document.getElementById('mobileMyBookmarksLink');
  
  // Function to show a specific section
  function showSection(section) {
    // Remove active class from all links
    const allLinks = document.querySelectorAll('.nav-link, .list-group-item');
    allLinks.forEach(link => link.classList.remove('active'));
    
    // Update URL without reloading page
    const newUrl = section === 'posts' ? '#/user-dashboard' : `#/user-dashboard/${section}`;
    window.history.pushState(null, '', newUrl);
    
    // Update title and active states
    const title = document.getElementById('dashboardTitle');
    const content = document.getElementById('dashboardContent');
    
    // Show loading state
    content.innerHTML = `
      <div class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading ${section}...</p>
      </div>
    `;
    
    // Update active states and load content
    switch(section) {
      case 'posts':
        title.textContent = 'My Posts';
        document.getElementById('myPostsLink').classList.add('active');
        document.getElementById('mobileMyPostsLink').classList.add('active');
        loadUserPosts();
        break;
      case 'likes':
        title.textContent = 'My Likes';
        document.getElementById('myLikesLink').classList.add('active');
        document.getElementById('mobileMyLikesLink').classList.add('active');
        loadUserLikes();
        break;
      case 'comments':
        title.textContent = 'My Comments';
        document.getElementById('myCommentsLink').classList.add('active');
        document.getElementById('mobileMyCommentsLink').classList.add('active');
        loadUserComments();
        break;
      case 'bookmarks':
        title.textContent = 'My Bookmarks';
        document.getElementById('myBookmarksLink').classList.add('active');
        document.getElementById('mobileMyBookmarksLink').classList.add('active');
        loadUserBookmarks();
        break;
    }
  }
  
  // Add event listeners
  myPostsLink.addEventListener('click', e => {
    e.preventDefault();
    showSection('posts');
  });
  
  myLikesLink.addEventListener('click', e => {
    e.preventDefault();
    showSection('likes');
  });
  
  myCommentsLink.addEventListener('click', e => {
    e.preventDefault();
    showSection('comments');
  });
  
  myBookmarksLink.addEventListener('click', e => {
    e.preventDefault();
    showSection('bookmarks');
  });
  
  // Mobile links
  mobileMyPostsLink.addEventListener('click', e => {
    e.preventDefault();
    showSection('posts');
  });
  
  mobileMyLikesLink.addEventListener('click', e => {
    e.preventDefault();
    showSection('likes');
  });
  
  mobileMyCommentsLink.addEventListener('click', e => {
    e.preventDefault();
    showSection('comments');
  });
  
  mobileMyBookmarksLink.addEventListener('click', e => {
    e.preventDefault();
    showSection('bookmarks');
  });
}

// Load initial dashboard content
function loadDashboardContent() {
  const currentPath = window.location.hash;
  
  if (currentPath.includes('/likes')) {
    loadUserLikes();
  } else if (currentPath.includes('/comments')) {
    loadUserComments();
  } else if (currentPath.includes('/bookmarks')) {
    loadUserBookmarks();
  } else {
    loadUserPosts();
  }
}

// Load user posts
async function loadUserPosts() {
  const content = document.getElementById('dashboardContent');
  
  try {
    const posts = await apiGetUserPosts();
    
    // Update stats
    document.getElementById('postCount').textContent = posts.length;
    
    let totalLikes = 0;
    let totalComments = 0;
    
    posts.forEach(post => {
      totalLikes += post.likes.length;
      totalComments += post.comments.length;
    });
    
    document.getElementById('likesCount').textContent = totalLikes;
    document.getElementById('commentsCount').textContent = totalComments;
    
    if (posts.length === 0) {
      content.innerHTML = `
        <div class="text-center my-5">
          <i class="fas fa-clipboard fa-3x text-muted mb-3"></i>
          <h5>You haven't created any posts yet</h5>
          <p class="text-muted">Your posts will appear here once you create them.</p>
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createPostModal">
            <i class="fas fa-plus me-2"></i> Create Your First Post
          </button>
        </div>
      `;
      return;
    }
    
    content.innerHTML = '';
    posts.forEach(post => {
      content.appendChild(renderPost(post));
    });
  } catch (error) {
    console.error('Error loading user posts:', error);
    content.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-circle me-2"></i>
        Failed to load your posts. Please try again later.
      </div>
    `;
  }
}

// Load user likes
async function loadUserLikes() {
  const content = document.getElementById('dashboardContent');
  
  try {
    const posts = await apiGetUserPosts();
    const likedPosts = posts.filter(post => post.likes.includes(getUser().id));
    
    if (likedPosts.length === 0) {
      content.innerHTML = `
        <div class="text-center my-5">
          <i class="fas fa-heart fa-3x text-muted mb-3"></i>
          <h5>No liked posts yet</h5>
          <p class="text-muted">Posts you like will appear here.</p>
        </div>
      `;
      return;
    }
    
    content.innerHTML = '';
    likedPosts.forEach(post => {
      content.appendChild(renderPost(post));
    });
  } catch (error) {
    console.error('Error loading user likes:', error);
    content.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-circle me-2"></i>
        Failed to load your liked posts. Please try again later.
      </div>
    `;
  }
}

// Load user comments
async function loadUserComments() {
  const content = document.getElementById('dashboardContent');
  
  try {
    const posts = await apiGetUserPosts();
    const postsWithComments = posts.filter(post => 
      post.comments.some(comment => comment.author_id === getUser().id)
    );
    
    if (postsWithComments.length === 0) {
      content.innerHTML = `
        <div class="text-center my-5">
          <i class="fas fa-comments fa-3x text-muted mb-3"></i>
          <h5>No comments yet</h5>
          <p class="text-muted">Posts you've commented on will appear here.</p>
        </div>
      `;
      return;
    }
    
    content.innerHTML = '';
    postsWithComments.forEach(post => {
      content.appendChild(renderPost(post));
    });
  } catch (error) {
    console.error('Error loading user comments:', error);
    content.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-circle me-2"></i>
        Failed to load your comments. Please try again later.
      </div>
    `;
  }
}

// Load user bookmarks
async function loadUserBookmarks() {
  const content = document.getElementById('dashboardContent');
  
  try {
    const posts = await apiGetUserPosts();
    const bookmarkedPosts = posts.filter(post => post.bookmarked);
    
    if (bookmarkedPosts.length === 0) {
      content.innerHTML = `
        <div class="text-center my-5">
          <i class="fas fa-bookmark fa-3x text-muted mb-3"></i>
          <h5>No bookmarks yet</h5>
          <p class="text-muted">Posts you bookmark will appear here.</p>
        </div>
      `;
      return;
    }
    
    content.innerHTML = '';
    bookmarkedPosts.forEach(post => {
      content.appendChild(renderPost(post));
    });
  } catch (error) {
    console.error('Error loading user bookmarks:', error);
    content.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-circle me-2"></i>
        Failed to load your bookmarks. Please try again later.
      </div>
    `;
  }
}

// Add this new function for real-time updates
function setupRealTimeUpdates() {
  // Listen for post like updates
  document.addEventListener('postLikeUpdated', (event) => {
    const { postId, likes } = event.detail;
    
    // Update stats if we're on the dashboard
    const likesCount = document.getElementById('likesCount');
    if (likesCount) {
      let totalLikes = 0;
      const posts = document.querySelectorAll('[id^="post-"]');
      posts.forEach(postElement => {
        const likeCount = postElement.querySelector('.like-count');
        if (likeCount) {
          totalLikes += parseInt(likeCount.textContent) || 0;
        }
      });
      likesCount.textContent = totalLikes;
    }
    
    // If we're in the likes section, we might need to show/hide posts
    const currentPath = window.location.hash;
    if (currentPath.includes('/likes')) {
      const currentUser = getUser();
      const postElement = document.getElementById(`post-${postId}`);
      const isLiked = likes.includes(currentUser.id);
      
      if (postElement && !isLiked) {
        // Remove post if unliked in likes section
        postElement.remove();
        // Check if we need to show empty state
        const remainingPosts = document.querySelectorAll('[id^="post-"]');
        if (remainingPosts.length === 0) {
          const content = document.getElementById('dashboardContent');
          content.innerHTML = `
            <div class="text-center my-5">
              <i class="fas fa-heart fa-3x text-muted mb-3"></i>
              <h5>No liked posts yet</h5>
              <p class="text-muted">Posts you like will appear here.</p>
            </div>
          `;
        }
      }
    }
  });
}