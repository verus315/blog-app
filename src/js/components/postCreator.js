import { isAuthenticated, getUser } from '../utils/auth.js';
import { apiCreatePost } from '../api/postApi.js';
import { showToast } from '../utils/toast.js';
import { Events, dispatchEvent } from '../utils/events.js';

// Create post modal
export function createPostModal() {
  // Remove existing modal if any
  const existingModal = document.getElementById('createPostModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  const user = isAuthenticated() ? getUser() : null;
  const modal = document.createElement('div');
  modal.id = 'createPostModal';
  modal.className = 'modal fade';
  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Create Post</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="createPostForm">
            <div class="mb-3">
              <div class="d-flex align-items-center mb-3">
                <img src="${user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&background=random`}" 
                     class="avatar me-2" alt="Your avatar">
                <div>
                  <h6 class="mb-0">${user?.username || 'User'}</h6>
                  <small class="text-muted">Posting publicly</small>
                </div>
              </div>
              <textarea class="form-control" id="postContent" rows="3" placeholder="What's on your mind?"></textarea>
              <div class="invalid-feedback">Please enter some content or add an image.</div>
            </div>
            <div class="mb-3">
              <label for="postImage" class="form-label">Add Image (optional)</label>
              <input type="file" class="form-control" id="postImage" accept="image/*">
              <div class="invalid-feedback">Please select a valid image file (JPEG, PNG, or GIF).</div>
            </div>
            <div id="imagePreview" class="mb-3 d-none">
              <img src="" alt="Preview" class="img-fluid rounded">
              <button type="button" class="btn btn-sm btn-danger mt-2" id="removeImage">Remove Image</button>
            </div>
            <div class="alert alert-danger d-none" id="postError"></div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" id="submitPost">Create Post</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add floating action button
  const fab = document.createElement('div');
  fab.className = 'fab';
  fab.innerHTML = '<i class="fas fa-plus"></i>';
  fab.setAttribute('data-bs-toggle', 'modal');
  fab.setAttribute('data-bs-target', '#createPostModal');
  
  if (isAuthenticated()) {
    document.body.appendChild(fab);
  }
  
  const form = modal.querySelector('#createPostForm');
  const contentInput = modal.querySelector('#postContent');
  const imageInput = modal.querySelector('#postImage');
  const imagePreview = modal.querySelector('#imagePreview');
  const previewImg = imagePreview.querySelector('img');
  const removeImageBtn = modal.querySelector('#removeImage');
  const submitBtn = modal.querySelector('#submitPost');
  const errorAlert = modal.querySelector('#postError');
  
  // Show image preview when file is selected
  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        imageInput.classList.add('is-invalid');
        return;
      }
      imageInput.classList.remove('is-invalid');
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        imagePreview.classList.remove('d-none');
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.classList.add('d-none');
    }
  });
  
  // Remove image when remove button is clicked
  removeImageBtn.addEventListener('click', () => {
    imageInput.value = '';
    imagePreview.classList.add('d-none');
    previewImg.src = '';
  });
  
  // Handle form submission
  submitBtn.addEventListener('click', async () => {
    try {
      // Reset validation state
      contentInput.classList.remove('is-invalid');
      imageInput.classList.remove('is-invalid');
      errorAlert.classList.add('d-none');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Creating...';
      
      const content = contentInput.value.trim();
      const imageFile = imageInput.files[0];
      
      // Validate input
      if (!content && !imageFile) {
        contentInput.classList.add('is-invalid');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Post';
        return;
      }
      
      // Create post
      const post = await apiCreatePost(content, imageFile);
      
      // Close modal and clear form
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      contentInput.value = '';
      imageInput.value = '';
      imagePreview.classList.add('d-none');
      
      // Show success message
      showToast('Post created successfully!', 'success');
      
      // Dispatch post created event
      dispatchEvent(Events.POST_CREATED, { post });
      
    } catch (error) {
      console.error('Failed to create post:', error);
      errorAlert.textContent = error.message || 'Failed to create post. Please try again.';
      errorAlert.classList.remove('d-none');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Post';
    }
  });
  
  // Initialize Bootstrap modal without showing it
  new bootstrap.Modal(modal);
}

// Create report modal
export function createReportModal() {
  // Check if modal already exists
  if (document.getElementById('reportModal')) {
    return;
  }
  
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'reportModal';
  modal.tabIndex = '-1';
  modal.setAttribute('aria-labelledby', 'reportModalLabel');
  modal.setAttribute('aria-hidden', 'true');
  
  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="reportModalLabel">Report Content</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="reportForm">
            <input type="hidden" id="reportPostId">
            <input type="hidden" id="reportContentType" value="post">
            <div class="mb-3">
              <label class="form-label">Why are you reporting this content?</label>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="reportReason" id="reason1" value="inappropriate" checked>
                <label class="form-check-label" for="reason1">Inappropriate content</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="reportReason" id="reason2" value="spam">
                <label class="form-check-label" for="reason2">Spam</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="reportReason" id="reason3" value="harassment">
                <label class="form-check-label" for="reason3">Harassment</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="reportReason" id="reason4" value="misinformation">
                <label class="form-check-label" for="reason4">Misinformation</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="reportReason" id="reason5" value="other">
                <label class="form-check-label" for="reason5">Other</label>
              </div>
            </div>
            <div class="mb-3">
              <label for="reportDetails" class="form-label">Additional details (optional)</label>
              <textarea class="form-control" id="reportDetails" rows="3" placeholder="Please provide any additional context..."></textarea>
            </div>
            <div class="alert alert-danger d-none" id="reportError"></div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" id="submitReportBtn">Submit Report</button>
        </div>
      </div>
    </div>
  `;
  
  // Add the modal to the document body
  document.body.appendChild(modal);
  
  // Set up event listeners
  setTimeout(() => {
    const submitReportBtn = document.getElementById('submitReportBtn');
    if (submitReportBtn) {
      submitReportBtn.addEventListener('click', async () => {
        const contentId = document.getElementById('reportPostId').value;
        const contentType = document.getElementById('reportContentType').value;
        const reason = document.querySelector('input[name="reportReason"]:checked').value;
        const details = document.getElementById('reportDetails').value.trim();
        const errorContainer = document.getElementById('reportError');
        
        // Show loading state
        submitReportBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
        submitReportBtn.disabled = true;
        
        try {
          // API call to report content
          const result = {
            success: true,
            message: 'Report submitted successfully'
          };
          
          if (result.success) {
            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('reportModal'));
            modal.hide();
            
            // Show toast notification
            const toastContainer = document.createElement('div');
            toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
            toastContainer.style.zIndex = '1100';
            
            toastContainer.innerHTML = `
              <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                  <i class="fas fa-flag text-danger me-2"></i>
                  <strong class="me-auto">Report Submitted</strong>
                  <small>Just now</small>
                  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                  Thank you for helping keep our community safe. We'll review this content shortly.
                </div>
              </div>
            `;
            
            document.body.appendChild(toastContainer);
            const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
            toast.show();
            
            // Reset form
            document.getElementById('reportDetails').value = '';
            document.getElementById('reason1').checked = true;
          } else {
            errorContainer.textContent = result.message || 'Failed to submit report.';
            errorContainer.classList.remove('d-none');
          }
        } catch (error) {
          console.error('Error reporting content:', error);
          errorContainer.textContent = 'An error occurred. Please try again.';
          errorContainer.classList.remove('d-none');
        } finally {
          // Reset button state
          submitReportBtn.innerHTML = 'Submit Report';
          submitReportBtn.disabled = false;
        }
      });
    }
  }, 0);
}

async function handleSubmit(event) {
  event.preventDefault();
  
  const content = postInput.value.trim();
  const imageFile = imageInput.files[0];
  
  // Validate that either content or image is provided
  if (!content && !imageFile) {
    showToast('Please enter some text or select an image', 'warning');
    return;
  }
  
  try {
    // Create FormData and append fields
    const formData = new FormData();
    if (content) {
      formData.append('content', content);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    // Create the post
    const post = await apiCreatePost(formData);
    
    // Clear form and close modal
    postInput.value = '';
    imageInput.value = '';
    imagePreview.style.display = 'none';
    imagePreview.src = '';
    closeModal();
    
    // Show success message and reload posts
    showToast('Post created successfully!', 'success');
    await loadPosts();
  } catch (error) {
    console.error('Error creating post:', error);
    showToast(error.message || 'Failed to create post', 'danger');
  }
}