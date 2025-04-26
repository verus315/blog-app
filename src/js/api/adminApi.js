import { getAuthToken } from '../utils/auth.js';

// API functions for admin
export async function apiGetAllPosts() {
  try {
    const token = getAuthToken();
    const response = await fetch('/api/admin/posts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch posts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function apiGetUsers() {
  try {
    const token = getAuthToken();
    const response = await fetch('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function apiGetReports() {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch('/api/admin/reports', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch reports');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
}

export async function apiHandleReport(reportId, action, notes) {
  try {
    const token = getAuthToken();
    const response = await fetch(`/api/admin/reports/${reportId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, notes })
    });
    if (!response.ok) throw new Error('Failed to handle report');
    return await response.json();
  } catch (error) {
    console.error('Error handling report:', error);
    throw error;
  }
}

export async function apiResolveReport(reportId, resolution) {
  try {
    const token = getAuthToken();
    const response = await fetch(`/api/admin/reports/${reportId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resolution })
    });
    if (!response.ok) throw new Error('Failed to resolve report');
    return await response.json();
  } catch (error) {
    console.error('Error resolving report:', error);
    throw error;
  }
}

export async function apiDeletePost(postId) {
  try {
    const token = getAuthToken();
    const response = await fetch(`/api/admin/posts/${postId}`, {
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

export async function apiUpdateReportStatus(reportId, status, resolution) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`/api/admin/reports/${reportId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status,
        resolution
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update report');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
}

export async function apiDeleteReportedContent(contentId, contentType) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`/api/admin/${contentType}/${contentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete content');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
}