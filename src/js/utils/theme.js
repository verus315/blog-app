// Initialize theme toggle functionality
export function initThemeToggle() {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Apply theme
  document.body.setAttribute('data-bs-theme', savedTheme);
  
  // Add event listener for theme toggle buttons
  document.addEventListener('click', (e) => {
    const themeToggle = e.target.closest('#themeToggle');
    if (themeToggle) {
      const currentTheme = document.body.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Update theme
      document.body.setAttribute('data-bs-theme', newTheme);
      
      // Save preference
      localStorage.setItem('theme', newTheme);
    }
  });
}