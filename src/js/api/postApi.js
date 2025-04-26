import { getAuthToken } from '../utils/auth.js';

// API functions for posts
export async function apiGetPosts() {
  try {
    const token = getAuthToken();
    const response = await fetch('/api/posts');
    if (!response.ok) throw new Error('Failed to fetch posts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function apiGetUserPosts() {
  try {
    const token = getAuthToken();
    const response = await fetch('/api/posts/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch user posts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
}

export async function apiLikePost(postId) {
  try {
    const token = getAuthToken();
    const response = await fetch(`/api/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to like post');
    return await response.json();
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
}

export async function apiUnlikePost(postId) {
  try {
    const token = getAuthToken();
    const response = await fetch(`/api/posts/${postId}/like`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to unlike post');
    return await response.json();
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
}

export async function apiAddComment(postId, content, parentId = null) {
  try {
    const token = getAuthToken();
    const response = await fetch(`/api/posts/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content, parentId })
    });
    if (!response.ok) throw new Error('Failed to add comment');
    return await response.json();
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

export async function apiCreatePost(content, imageFile = null) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    formData.append('content', content || '');
    if (imageFile) {
      formData.append('image', imageFile);
    }

    console.log('Creating post with:', { content, hasImage: !!imageFile });

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || 'Failed to create post');
      } catch (e) {
        throw new Error(`Failed to create post: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log('Post created successfully:', data);

    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function apiReportPost(contentId, contentType, reason, details) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    // Validate required fields
    if (!contentId || !contentType || !reason) {
      throw new Error('contentType, contentId, and reason are required');
    }

    const response = await fetch('/api/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        contentType: contentType,
        contentId: contentId,
        reason: reason,
        details: details || ''
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to report content');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error reporting post:', error);
    throw error; // Propagate the original error
  }
}

export async function apiEditPost(postId, content, imageFile = null) {
  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) throw new Error('Failed to edit post');
    return await response.json();
  } catch (error) {
    console.error('Error editing post:', error);
    throw error;
  }
}

export async function apiDeletePost(postId) {
  try {
    const token = getAuthToken();
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete post');
    return await response.json();
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}