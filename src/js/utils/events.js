// Custom events for real-time updates
export const Events = {
  POST_CREATED: 'postCreated',
  POST_LIKED: 'postLiked',
  POST_UNLIKED: 'postUnliked',
  COMMENT_ADDED: 'commentAdded',
  COMMENT_LIKED: 'commentLiked',
  COMMENT_UNLIKED: 'commentUnliked',
  AUTH_LOGIN: 'authLogin',
  AUTH_LOGOUT: 'authLogout'
};

// Dispatch a custom event with data
export function dispatchEvent(eventName, data) {
  const event = new CustomEvent(eventName, { 
    detail: data,
    bubbles: true 
  });
  document.dispatchEvent(event);
}

// Subscribe to an event
export function subscribe(eventName, callback) {
  document.addEventListener(eventName, (event) => callback(event.detail));
}

// Unsubscribe from an event
export function unsubscribe(eventName, callback) {
  document.removeEventListener(eventName, callback);
} 