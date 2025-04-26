import { renderNavbar } from '../components/navbar.js';
import { renderPost, renderComment, setupReportHandler } from '../components/post.js';
import { apiGetPosts } from '../api/postApi.js';
import { isAuthenticated, getUser } from '../utils/auth.js';
import { createPostModal, createReportModal } from '../components/postCreator.js';
import { Events, subscribe, unsubscribe } from '../utils/events.js';

// Event handlers
const eventHandlers = {
  handlePostCreated: (data) => {
    const postsContainer = document.getElementById('postsContainer');
    if (postsContainer) {
      // Remove "no posts" message if it exists
      const noPostsMessage = postsContainer.querySelector('.text-center.text-muted');
      if (noPostsMessage) {
        noPostsMessage.remove();
      }
      
      // Create post element using renderPost
      const postElement = renderPost(data.post);
      
      // Add to the top of the feed
      if (postsContainer.firstChild) {
        postsContainer.insertBefore(postElement, postsContainer.firstChild);
      } else {
        postsContainer.appendChild(postElement);
      }
    }
  },
  
  handlePostLiked: (data) => {
    const post = document.getElementById(`post-${data.postId}`);
    if (post) {
      const likeBtn = post.querySelector('.btn-like');
      const likeCount = post.querySelector('.like-count');
      if (likeBtn && likeCount) {
        likeBtn.classList.add('active');
        likeCount.textContent = data.likesCount;
      }
    }
  },
  
  handlePostUnliked: (data) => {
    const post = document.getElementById(`post-${data.postId}`);
    if (post) {
      const likeBtn = post.querySelector('.btn-like');
      const likeCount = post.querySelector('.like-count');
      if (likeBtn && likeCount) {
        likeBtn.classList.remove('active');
        likeCount.textContent = data.likesCount;
      }
    }
  },
  
  handleCommentAdded: (data) => {
    const post = document.getElementById(`post-${data.postId}`);
    if (post) {
      const commentsContainer = post.querySelector('.comments-container');
      const commentCount = post.querySelector('.btn-comment');
      
      if (commentsContainer) {
        // Remove "no comments" message if it exists
        const noComments = commentsContainer.querySelector('.text-muted');
        if (noComments) {
          noComments.remove();
        }
        
        // Create and add new comment
        const commentElement = renderComment(data.comment);
        if (commentElement) {
          commentsContainer.insertBefore(commentElement, commentsContainer.firstChild);
          
          // Update comment count
          if (commentCount) {
            const currentCount = parseInt(commentCount.textContent.trim().split(' ')[1] || '0');
            commentCount.innerHTML = `<i class="far fa-comment me-1"></i> ${currentCount + 1}`;
          }
        } else {
          console.error('Failed to render comment:', data.comment);
        }
      }
    }
  }
};

// Render home page
export async function renderHome(container) {
  // Subscribe to events
  subscribe(Events.POST_CREATED, eventHandlers.handlePostCreated);
  subscribe(Events.POST_LIKED, eventHandlers.handlePostLiked);
  subscribe(Events.POST_UNLIKED, eventHandlers.handlePostUnliked);
  subscribe(Events.COMMENT_ADDED, eventHandlers.handleCommentAdded);
  
  // Render navbar
  renderNavbar();
  
  // Create main container
  container.innerHTML = `
    <div class="container-lg py-4" style="max-width: 1400px;">
      <div class="row">
        <!-- Main content -->
        <div class="col-lg-8">
          ${isAuthenticated() ? `
            <!-- Post Creator -->
            <div class="card mb-4">
              <div class="card-body">
                <div class="d-flex">
                  <img src="${getUser().avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(getUser().username)}&background=random`}" 
                       class="avatar me-3" alt="Your avatar">
                  <div class="flex-grow-1">
                    <div class="form-control text-muted" 
                         data-bs-toggle="modal" 
                         data-bs-target="#createPostModal"
                         style="cursor: pointer;">
                      What's on your mind?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ` : ''}
          
          <!-- Posts Feed -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Recent Posts</h4>
            <div class="dropdown">
              <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Sort by
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item active" href="#" data-sort="recent">Most Recent</a></li>
                <li><a class="dropdown-item" href="#" data-sort="popular">Most Popular</a></li>
                <li><a class="dropdown-item" href="#" data-sort="discussed">Most Discussed</a></li>
              </ul>
            </div>
          </div>
          
          <div id="postsContainer">
            <div class="text-center my-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading posts...</span>
              </div>
              <p class="mt-2">Loading posts...</p>
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="col-lg-4 d-none d-lg-block">
          <!-- Search Box -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="Search posts...">
                <button class="btn btn-outline-primary" type="button">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="card">
            <div class="card-body">
              <h6 class="text-muted mb-3">Quick Links</h6>
              <div class="d-flex flex-wrap gap-2">
                <a href="#/about" class="text-decoration-none text-muted small">About</a>
                <span class="text-muted">·</span>
                <a href="#/help" class="text-decoration-none text-muted small">Help</a>
                <span class="text-muted">·</span>
                <a href="#/privacy" class="text-decoration-none text-muted small">Privacy</a>
                <span class="text-muted">·</span>
                <a href="#/terms" class="text-decoration-none text-muted small">Terms</a>
                <span class="text-muted">·</span>
                <a href="#/guidelines" class="text-decoration-none text-muted small">Guidelines</a>
              </div>
              <p class="text-muted small mt-2 mb-0">© 2025 SocialBlog. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add modals
  createPostModal();
  createReportModal();
  
  // Setup report handler
  setupReportHandler();
  
  // Load initial posts
  await loadPosts();
  
  // Clean up function to remove event listeners when component unmounts
  return () => {
    unsubscribe(Events.POST_CREATED, eventHandlers.handlePostCreated);
    unsubscribe(Events.POST_LIKED, eventHandlers.handlePostLiked);
    unsubscribe(Events.POST_UNLIKED, eventHandlers.handlePostUnliked);
    unsubscribe(Events.COMMENT_ADDED, eventHandlers.handleCommentAdded);
  };
}

// Load posts with optional sorting
async function loadPosts(sort = 'recent') {
  const postsContainer = document.getElementById('postsContainer');
  if (!postsContainer) return;
  
  try {
    const posts = await apiGetPosts(sort);
    
    // Clear the container
    postsContainer.innerHTML = '';
    
    if (posts.length) {
      // Append each post element
      posts.forEach(post => {
        const postElement = renderPost(post);
        postsContainer.appendChild(postElement);
      });
    } else {
      postsContainer.innerHTML = '<div class="text-center text-muted">No posts yet. Be the first to post!</div>';
    }
  } catch (error) {
    console.error('Error loading posts:', error);
    postsContainer.innerHTML = `
      <div class="alert alert-danger">
        Failed to load posts. Please try again later.
      </div>
    `;
  }
}

function sortPosts(posts, criteria) {
  const sortedPosts = [...posts];
  
  switch (criteria) {
    case 'popular':
      sortedPosts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
      break;
    case 'discussed':
      sortedPosts.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
      break;
    case 'recent':
    default:
      sortedPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  
  return sortedPosts;
}

function setupEventListeners() {
  // Sort dropdown handlers
  const dropdownItems = document.querySelectorAll('.dropdown-item[data-sort]');
  dropdownItems.forEach(item => {
    item.addEventListener('click', async (e) => {
      e.preventDefault();
      
      // Update active state
      dropdownItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Update button text
      const dropdownButton = item.closest('.dropdown').querySelector('.dropdown-toggle');
      dropdownButton.textContent = `Sort by: ${item.textContent}`;
      
      // Reload posts with new sort
      await loadPosts(item.dataset.sort);
    });
  });
  
  // Topic click handlers
  const topicLinks = document.querySelectorAll('.topics-container .badge');
  topicLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const topic = link.textContent.toLowerCase();
      // TODO: Implement topic filtering
      console.log(`Filter by topic: ${topic}`);
    });
  });
}

// Create post
async function createPost(event) {
  event.preventDefault();
  
  const content = document.getElementById('postContent').value.trim();
  const imageFile = document.getElementById('postImage').files[0];
  
  if (!content && !imageFile) {
    showToast('Please add some content or an image', 'warning');
    return;
  }
  
  try {
    const formData = new FormData();
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
    
    const newPost = await response.json();
    
    // Clear form
    document.getElementById('postContent').value = '';
    document.getElementById('postImage').value = '';
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('createPostModal'));
    modal.hide();
    
    // Show success message
    showToast('Post created successfully', 'success');
    
    // Reload posts
    await loadPosts();
    
  } catch (error) {
    console.error('Error creating post:', error);
    showToast('Failed to create post', 'danger');
  }
}

// Show toast notification
function showToast(message, type = 'primary') {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '1100';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast
  const toastElement = document.createElement('div');
  toastElement.className = `toast bg-${type} text-${type === 'warning' || type === 'light' ? 'dark' : 'white'}`;
  toastElement.setAttribute('role', 'alert');
  toastElement.setAttribute('aria-live', 'assertive');
  toastElement.setAttribute('aria-atomic', 'true');
  
  toastElement.innerHTML = `
    <div class="toast-header bg-${type} text-${type === 'warning' || type === 'light' ? 'dark' : 'white'}">
      <strong class="me-auto">SocialBlog</strong>
      <small>Just now</small>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ${message}
    </div>
  `;
  
  // Add toast to container
  toastContainer.appendChild(toastElement);
  
  // Initialize and show toast
  const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
  toast.show();
  
  // Remove toast after it's hidden
  toastElement.addEventListener('hidden.bs.toast', () => {
    toastElement.remove();
  });
}