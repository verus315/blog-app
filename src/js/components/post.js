import { apiLikePost, apiUnlikePost, apiAddComment, apiReportPost, apiEditPost, apiDeletePost } from '../api/postApi.js';
import { isAuthenticated, getUser } from '../utils/auth.js';
import { Events, dispatchEvent } from '../utils/events.js';
import { showToast } from '../utils/toast.js';

// Render a single post
export function renderPost(post, showComments = true) {
  const authenticated = isAuthenticated();
  const currentUser = authenticated ? getUser() : null;
  
  // Format date
  let formattedDate = 'Invalid Date';
  try {
    const postDate = new Date(post.created_at);
    if (!isNaN(postDate.getTime())) {
      formattedDate = postDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
  }
  
  // Check if user has liked the post
  const hasLiked = authenticated && post.likes && post.likes.includes(currentUser?.id);
  
  // Create post element
  const postElement = document.createElement('div');
  postElement.className = 'card mb-4';
  postElement.id = `post-${post.id}`;
  
  // Post content
  postElement.innerHTML = `
    <div class="card-body">
      <div class="d-flex align-items-center mb-3">
        <img src="${post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.username)}&background=random`}" 
             class="avatar me-2" alt="${post.author.username}'s avatar">
        <div>
          <h6 class="mb-0">${post.author.username}</h6>
          <small class="text-muted">${formattedDate}</small>
        </div>
        ${authenticated && (currentUser.id === post.author_id || currentUser.role === 'admin') ? `
          <div class="dropdown ms-auto">
            <button class="btn btn-sm text-muted" data-bs-toggle="dropdown">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              ${currentUser.id === post.author_id ? `
                <li><a class="dropdown-item edit-post" href="#" data-post-id="${post.id}">
                  <i class="fas fa-edit me-2"></i>Edit
                </a></li>
              ` : ''}
              <li><a class="dropdown-item delete-post text-danger" href="#" data-post-id="${post.id}">
                <i class="fas fa-trash-alt me-2"></i>Delete
              </a></li>
            </ul>
          </div>
        ` : ''}
      </div>
      <p class="card-text">${post.content || ''}</p>
      ${post.image_url ? `
        <div class="post-image-container mb-3" style="max-width: 400px; margin: 0 auto;">
          <img src="${post.image_url}" class="img-fluid rounded w-100" style="object-fit: cover;" alt="Post image" onerror="this.style.display='none'">
        </div>
      ` : ''}
      
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <button class="btn btn-sm btn-interaction btn-like ${hasLiked ? 'active' : ''}" data-post-id="${post.id}">
            <i class="far fa-heart me-1"></i><span class="like-count">${post.likes_count || post.likes?.length || 0}</span>
          </button>
          <button class="btn btn-sm btn-interaction btn-comment" data-post-id="${post.id}">
            <i class="far fa-comment me-1"></i> ${post.comments_count || post.comments?.length || 0}
          </button>
        </div>
        ${authenticated ? `
          <button class="btn btn-sm btn-interaction btn-report" data-post-id="${post.id}" data-bs-toggle="modal" data-bs-target="#reportModal">
            <i class="far fa-flag me-1"></i> Report
          </button>
        ` : ''}
      </div>
    </div>
  `;
  
  // Add comment section if needed
  if (showComments) {
    const commentSection = document.createElement('div');
    commentSection.className = 'card-footer bg-white';
    commentSection.innerHTML = `
      <h6 class="mb-3">Comments</h6>
      ${authenticated ? `
        <div class="mb-3">
          <div class="d-flex">
            <img src="${currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username)}&background=random`}" 
                 class="avatar avatar-sm me-2" alt="Your avatar">
            <div class="flex-grow-1">
              <textarea class="form-control comment-input" placeholder="Write a comment..." rows="1"></textarea>
            </div>
            <button class="btn btn-primary ms-2 add-comment-btn" data-post-id="${post.id}">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      ` : ''}
      <div class="comments-container">
        ${post.comments.length > 0 ? renderComments(post.comments) : '<p class="text-muted small">No comments yet. Be the first to comment!</p>'}
      </div>
    `;
    
    postElement.appendChild(commentSection);
  }
  
  // Add event listeners
  setTimeout(() => {
    const postContainer = document.getElementById(`post-${post.id}`);
    if (!postContainer) return;

    // Edit post
    const editBtn = postContainer.querySelector('.edit-post');
    if (editBtn) {
      editBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Create edit modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = `editPostModal-${post.id}`;
        modal.innerHTML = `
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Edit Post</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <form id="editPostForm-${post.id}">
                  <div class="mb-3">
                    <textarea class="form-control" rows="3">${post.content || ''}</textarea>
                  </div>
                  ${post.image_url ? `
                    <div class="mb-3">
                      <img src="${post.image_url}" class="img-fluid rounded mb-2" alt="Current image">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="removeImage-${post.id}">
                        <label class="form-check-label" for="removeImage-${post.id}">
                          Remove image
                        </label>
                      </div>
                    </div>
                  ` : ''}
                  <div class="mb-3">
                    <label class="form-label">New Image (optional)</label>
                    <input type="file" class="form-control" accept="image/*">
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary save-edit">Save Changes</button>
              </div>
            </div>
          </div>
        `;
        
        document.body.appendChild(modal);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
        
        // Handle save
        modal.querySelector('.save-edit').addEventListener('click', async () => {
          const form = document.getElementById(`editPostForm-${post.id}`);
          const content = form.querySelector('textarea').value.trim();
          const newImage = form.querySelector('input[type="file"]').files[0];
          const removeImage = post.image_url && form.querySelector(`#removeImage-${post.id}`)?.checked;
          
          try {
            const updatedPost = await apiEditPost(post.id, content, newImage, removeImage);
            
            // Update post content
            postContainer.querySelector('.card-text').textContent = content;
            
            // Update image if changed
            const imageContainer = postContainer.querySelector('.post-image-container');
            if (updatedPost.image_url) {
              if (imageContainer) {
                imageContainer.querySelector('img').src = updatedPost.image_url;
              } else {
                const newImageContainer = document.createElement('div');
                newImageContainer.className = 'post-image-container mb-3';
                newImageContainer.style = 'max-width: 400px; margin: 0 auto;';
                newImageContainer.innerHTML = `
                  <img src="${updatedPost.image_url}" class="img-fluid rounded w-100" style="object-fit: cover;" alt="Post image" onerror="this.style.display='none'">
                `;
                postContainer.querySelector('.card-text').after(newImageContainer);
              }
            } else if (imageContainer) {
              imageContainer.remove();
            }
            
            modalInstance.hide();
            modal.addEventListener('hidden.bs.modal', () => modal.remove());
            showToast('Post updated successfully', 'success');
          } catch (error) {
            console.error('Error updating post:', error);
            showToast('Failed to update post', 'danger');
          }
        });
        
        // Clean up modal when hidden
        modal.addEventListener('hidden.bs.modal', () => modal.remove());
      });
    }

    // Delete post
    const deleteBtn = postContainer.querySelector('.delete-post');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
          try {
            await apiDeletePost(post.id);
            postContainer.remove();
            showToast('Post deleted successfully', 'success');
          } catch (error) {
            console.error('Error deleting post:', error);
            showToast('Failed to delete post', 'danger');
          }
        }
      });
    }

    // Like button
    const likeBtn = postContainer.querySelector('.btn-like');
    if (likeBtn) {
      likeBtn.addEventListener('click', async () => {
        if (!authenticated) {
          window.location.hash = '#/login';
          return;
        }
        
        try {
          // Toggle like button state immediately for better UX
          const isCurrentlyLiked = likeBtn.classList.contains('active');
          likeBtn.classList.toggle('active');
          const likeCountSpan = likeBtn.querySelector('.like-count');
          const currentCount = parseInt(likeCountSpan.textContent);
          likeCountSpan.textContent = isCurrentlyLiked ? currentCount - 1 : currentCount + 1;
          
          // Add like animation
          if (!isCurrentlyLiked) {
            likeBtn.classList.add('like-animation');
            setTimeout(() => likeBtn.classList.remove('like-animation'), 500);
          }
          
          // Make API call
          const response = isCurrentlyLiked ? 
            await apiUnlikePost(post.id) : 
            await apiLikePost(post.id);
          
          // Update post data
          post.likes = response.likes || [];
          post.likes_count = response.likes_count || response.likes?.length || 0;
          
          // Update UI to match server response
          likeBtn.classList.toggle('active', post.likes.includes(currentUser?.id));
          likeCountSpan.textContent = post.likes_count;
          
          // Dispatch event
          dispatchEvent(isCurrentlyLiked ? Events.POST_UNLIKED : Events.POST_LIKED, {
            postId: post.id,
            userId: currentUser.id,
            likes: post.likes,
            likesCount: post.likes_count
          });
          
        } catch (error) {
          console.error('Error liking post:', error);
          // Revert UI changes on error
          likeBtn.classList.toggle('active');
          const likeCountSpan = likeBtn.querySelector('.like-count');
          const currentCount = parseInt(likeCountSpan.textContent);
          likeCountSpan.textContent = likeBtn.classList.contains('active') ? currentCount + 1 : currentCount - 1;
        }
      });
    }
    
    // Comment button
    const commentBtn = postContainer.querySelector('.btn-comment');
    if (commentBtn) {
      commentBtn.addEventListener('click', () => {
        const commentInput = postContainer.querySelector('.comment-input');
        if (commentInput) {
          commentInput.focus();
        } else if (!authenticated) {
          window.location.hash = '#/login';
        }
      });
    }
    
    // Add comment button
    const addCommentBtn = postContainer.querySelector('.add-comment-btn');
    if (addCommentBtn) {
      addCommentBtn.addEventListener('click', async () => {
        const commentInput = postContainer.querySelector('.comment-input');
        const commentText = commentInput.value.trim();
        
        if (commentText) {
          try {
            const response = await apiAddComment(post.id, commentText);
            console.log('Server response for new comment:', response); // Debug log
            
            // Clear input
            commentInput.value = '';
            
            // Format the comment data with the current timestamp
            const now = new Date();
            const commentData = {
              ...response,
              author: {
                id: currentUser.id,
                username: currentUser.username,
                avatar: currentUser.avatar
              },
              created_at: now.toISOString(),
              content: commentText
            };
            
            console.log('Formatted comment data:', commentData); // Debug log
            
            // Dispatch event with the properly structured comment data
            dispatchEvent(Events.COMMENT_ADDED, {
              postId: post.id,
              comment: commentData
            });
            
          } catch (error) {
            console.error('Error adding comment:', error);
            showToast('Failed to add comment. Please try again.', 'danger');
          }
        }
      });
    }
    
    // Report button
    const reportBtn = postContainer.querySelector('.btn-report');
    if (reportBtn) {
      reportBtn.addEventListener('click', async () => {
        const reportModal = document.getElementById('reportModal');
        if (reportModal) {
          reportModal.querySelector('#reportPostId').value = post.id;
          reportModal.querySelector('#reportContentType').value = 'post';
        }
      });
    }
  }, 0);
  
  return postElement;
}

// Render comments
function renderComments(comments) {
  if (!comments || comments.length === 0) {
    return '<p class="text-muted small">No comments yet. Be the first to comment!</p>';
  }
  
  const authenticated = isAuthenticated();
  const currentUser = authenticated ? getUser() : null;
  
  return comments.map(comment => {
    // Format date
    const commentDate = new Date(comment.createdAt);
    const formattedDate = commentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    // Check if user has liked the comment
    const hasLiked = authenticated && comment.likes.includes(currentUser?.id);
    
    return `
      <div class="comment-item mb-3" id="comment-${comment.id}">
        <div class="d-flex">
          <img src="${comment.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.username)}&background=random`}" 
               class="avatar avatar-sm me-2" alt="${comment.author.username}'s avatar">
          <div class="flex-grow-1">
            <div class="bg-light rounded p-2">
              <div class="d-flex justify-content-between">
                <h6 class="mb-0">${comment.author.username}</h6>
                <small class="text-muted">${formattedDate}</small>
              </div>
              <p class="mb-0">${comment.content}</p>
            </div>
            <div class="d-flex mt-1">
              ${authenticated ? `
                <button class="btn btn-sm btn-interaction like-comment-btn ${hasLiked ? 'active' : ''}" data-comment-id="${comment.id}">
                  <i class="far fa-heart me-1"></i> ${comment.likes.length}
                </button>
                <button class="btn btn-sm btn-interaction reply-comment-btn" data-comment-id="${comment.id}">
                  <i class="fas fa-reply me-1"></i> Reply
                </button>
                <button class="btn btn-sm btn-interaction report-comment-btn" data-comment-id="${comment.id}" 
                        data-bs-toggle="modal" data-bs-target="#reportModal">
                  <i class="far fa-flag me-1"></i> Report
                </button>
              ` : ''}
            </div>
            
            <!-- Replies container -->
            ${comment.replies && comment.replies.length > 0 ? `
              <div class="nested-comment mt-2">
                ${renderReplies(comment.replies)}
              </div>
            ` : ''}
            
            <!-- Reply form (hidden by default) -->
            ${authenticated ? `
              <div class="reply-form d-none mt-2" id="reply-form-${comment.id}">
                <div class="d-flex">
                  <img src="${currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username)}&background=random`}" 
                       class="avatar avatar-sm me-2" alt="Your avatar">
                  <div class="flex-grow-1">
                    <textarea class="form-control reply-input" placeholder="Write a reply..." rows="1"></textarea>
                  </div>
                  <button class="btn btn-primary ms-2 add-reply-btn" data-comment-id="${comment.id}">
                    <i class="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Render comment replies
function renderReplies(replies) {
  if (!replies || replies.length === 0) {
    return '';
  }
  
  const authenticated = isAuthenticated();
  const currentUser = authenticated ? getUser() : null;
  
  return replies.map(reply => {
    // Format date
    const replyDate = new Date(reply.createdAt);
    const formattedDate = replyDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    // Check if user has liked the reply
    const hasLiked = authenticated && reply.likes.includes(currentUser?.id);
    
    return `
      <div class="reply-item mb-2" id="reply-${reply.id}">
        <div class="d-flex">
          <img src="${reply.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.author.username)}&background=random`}" 
               class="avatar avatar-sm me-2" alt="${reply.author.username}'s avatar">
          <div class="flex-grow-1">
            <div class="bg-light rounded p-2">
              <div class="d-flex justify-content-between">
                <h6 class="mb-0">${reply.author.username}</h6>
                <small class="text-muted">${formattedDate}</small>
              </div>
              <p class="mb-0">${reply.content}</p>
            </div>
            <div class="d-flex mt-1">
              ${authenticated ? `
                <button class="btn btn-sm btn-interaction like-reply-btn ${hasLiked ? 'active' : ''}" data-reply-id="${reply.id}">
                  <i class="far fa-heart me-1"></i> ${reply.likes.length}
                </button>
                <button class="btn btn-sm btn-interaction report-reply-btn" data-reply-id="${reply.id}"
                        data-bs-toggle="modal" data-bs-target="#reportModal">
                  <i class="far fa-flag me-1"></i> Report
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Helper function to render a single comment
export function renderComment(comment) {
  if (!comment) {
    console.error('Invalid comment data:', comment);
    return null;
  }

  const authenticated = isAuthenticated();
  const currentUser = authenticated ? getUser() : null;
  
  // Ensure comment has all required properties with defaults
  const safeComment = {
    id: comment.id || 'unknown',
    content: comment.content || '',
    created_at: comment.created_at || comment.createdAt || new Date().toISOString(),
    author: comment.author || {
      id: comment.user_id || comment.author_id || 'unknown',
      username: comment.username || 'Anonymous',
      avatar: comment.avatar || null
    }
  };
  
  const commentElement = document.createElement('div');
  commentElement.className = 'comment-item mb-3';
  commentElement.id = `comment-${safeComment.id}`;
  
  // Format date safely
  let formattedDate;
  try {
    const date = new Date(safeComment.created_at);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    formattedDate = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting date:', error, safeComment.created_at);
    formattedDate = 'Just now';
  }
  
  commentElement.innerHTML = `
    <div class="d-flex">
      <img src="${safeComment.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(safeComment.author.username)}&background=random`}" 
           class="avatar avatar-sm me-2" alt="${safeComment.author.username}'s avatar">
      <div class="flex-grow-1">
        <div class="bg-light rounded p-2">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-0">${safeComment.author.username}</h6>
              <small class="text-muted">${formattedDate}</small>
            </div>
            ${authenticated ? `
              <button class="btn btn-sm btn-link text-muted report-comment-btn p-0" 
                      data-comment-id="${safeComment.id}" 
                      data-bs-toggle="modal" 
                      data-bs-target="#reportModal">
                <i class="far fa-flag"></i>
              </button>
            ` : ''}
          </div>
          <p class="mb-0 mt-1">${safeComment.content}</p>
        </div>
      </div>
    </div>
  `;

  // Add report functionality
  setTimeout(() => {
    const reportBtn = commentElement.querySelector('.report-comment-btn');
    if (reportBtn) {
      reportBtn.addEventListener('click', () => {
        const reportModal = document.getElementById('reportModal');
        if (reportModal) {
          // Reset the form
          reportModal.querySelector('#reportError').classList.add('d-none');
          reportModal.querySelector('#reportDetails').value = '';
          reportModal.querySelector('#reason1').checked = true;
          
          // Set the content info
          reportModal.querySelector('#reportPostId').value = safeComment.id;
          reportModal.querySelector('#reportContentType').value = 'comment';
        }
      });
    }
  }, 0);
  
  return commentElement;
}

// Export the helper functions for use in event handling
export function setupPostEventListeners() {
  // Event delegation for comment replies
  document.addEventListener('click', e => {
    // Reply to comment
    if (e.target.closest('.reply-comment-btn')) {
      const btn = e.target.closest('.reply-comment-btn');
      const commentId = btn.dataset.commentId;
      const replyForm = document.getElementById(`reply-form-${commentId}`);
      
      // Toggle the form
      if (replyForm.classList.contains('d-none')) {
        // Hide all other reply forms first
        document.querySelectorAll('.reply-form:not(.d-none)').forEach(form => {
          form.classList.add('d-none');
        });
        
        // Show this form
        replyForm.classList.remove('d-none');
        replyForm.querySelector('.reply-input').focus();
      } else {
        replyForm.classList.add('d-none');
      }
    }
    
    // Submit reply to comment
    if (e.target.closest('.add-reply-btn')) {
      const btn = e.target.closest('.add-reply-btn');
      const commentId = btn.dataset.commentId;
      const replyInput = btn.closest('.reply-form').querySelector('.reply-input');
      const replyText = replyInput.value.trim();
      
      if (replyText) {
        // TODO: Implement reply API call
        console.log(`Replying to comment ${commentId} with: ${replyText}`);
        // For now, just hide the form
        btn.closest('.reply-form').classList.add('d-none');
        replyInput.value = '';
      }
    }
    
    // Like comment
    if (e.target.closest('.like-comment-btn')) {
      const btn = e.target.closest('.like-comment-btn');
      const commentId = btn.dataset.commentId;
      
      // TODO: Implement like comment API call
      console.log(`Liking comment ${commentId}`);
      
      // Toggle like state
      btn.classList.toggle('active');
      if (btn.classList.contains('active')) {
        btn.classList.add('like-animation');
        setTimeout(() => btn.classList.remove('like-animation'), 500);
      }
    }
    
    // Like reply
    if (e.target.closest('.like-reply-btn')) {
      const btn = e.target.closest('.like-reply-btn');
      const replyId = btn.dataset.replyId;
      
      // TODO: Implement like reply API call
      console.log(`Liking reply ${replyId}`);
      
      // Toggle like state
      btn.classList.toggle('active');
      if (btn.classList.contains('active')) {
        btn.classList.add('like-animation');
        setTimeout(() => btn.classList.remove('like-animation'), 500);
      }
    }
    
    // Report comment
    if (e.target.closest('.report-comment-btn')) {
      const btn = e.target.closest('.report-comment-btn');
      const commentId = btn.dataset.commentId;
      
      // Set up the report modal
      document.getElementById('reportPostId').value = commentId;
      document.getElementById('reportContentType').value = 'comment';
    }
    
    // Report reply
    if (e.target.closest('.report-reply-btn')) {
      const btn = e.target.closest('.report-reply-btn');
      const replyId = btn.dataset.replyId;
      
      // Set up the report modal
      document.getElementById('reportPostId').value = replyId;
      document.getElementById('reportContentType').value = 'reply';
    }
  });
}

// Update the setupReportHandler function
export function setupReportHandler() {
  const reportModal = document.getElementById('reportModal');
  if (!reportModal) return;

  const submitReportBtn = reportModal.querySelector('#submitReportBtn');
  if (submitReportBtn) {
    submitReportBtn.addEventListener('click', async () => {
      const contentId = reportModal.querySelector('#reportPostId').value;
      const contentType = reportModal.querySelector('#reportContentType').value;
      const reasonInput = reportModal.querySelector('input[name="reportReason"]:checked');
      const details = reportModal.querySelector('#reportDetails').value.trim();
      const errorContainer = reportModal.querySelector('#reportError');
      
      // Clear previous error
      errorContainer.classList.add('d-none');
      
      // Validate inputs
      if (!contentId || !contentType || !reasonInput) {
        errorContainer.textContent = 'Please fill in all required fields';
        errorContainer.classList.remove('d-none');
        return;
      }

      const reason = reasonInput.value;
      
      try {
        submitReportBtn.disabled = true;
        submitReportBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Submitting...';
        
        await apiReportPost(contentId, contentType, reason, details);
        
        // Close modal
        const modalInstance = bootstrap.Modal.getInstance(reportModal);
        modalInstance.hide();
        
        // Show success message
        showToast('Thank you for your report. We will review it shortly.', 'success');
        
        // Reset form
        reportModal.querySelector('#reportDetails').value = '';
        reportModal.querySelector('#reason1').checked = true;
        
      } catch (error) {
        console.error('Error submitting report:', error);
        errorContainer.textContent = error.message || 'Failed to submit report. Please try again.';
        errorContainer.classList.remove('d-none');
      } finally {
        submitReportBtn.disabled = false;
        submitReportBtn.textContent = 'Submit Report';
      }
    });
  }
}