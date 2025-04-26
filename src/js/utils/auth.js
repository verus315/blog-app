// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

import { Events, dispatchEvent } from './events.js';

// Get authentication token
export function getAuthToken() {
  return localStorage.getItem('token');
}

// Check if user is authenticated
export function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}

// Get current user
export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Get user role
export function getUserRole() {
  const user = getUser();
  return user ? user.role : null;
}

// Register new user
export async function register(username, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Login user
export async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token and user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Dispatch login event
    dispatchEvent(Events.AUTH_LOGIN, { user: data.user });

    return data;
  } catch (error) {
    throw error;
  }
}

// Logout user
export function logout() {
  const user = getUser();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Dispatch logout event
  dispatchEvent(Events.AUTH_LOGOUT, { user });
}

// Get auth headers for API requests
export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

// Validate email format
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate password strength
export function validatePassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
}