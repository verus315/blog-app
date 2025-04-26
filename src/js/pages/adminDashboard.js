import { renderNavbar } from '../components/navbar.js';
import { apiGetAllPosts, apiGetReports, apiGetUsers } from '../api/adminApi.js';
import { renderReportManagement } from './reportManagement.js';
import { isAuthenticated, getUser, getAuthToken } from '../utils/auth.js';

// Render admin dashboard
export function renderAdminDashboard(container) {
  // Check if user is admin
  const user = getUser();
  if (!isAuthenticated() || user.role !== 'admin') {
    window.location.hash = '#/login';
    return;
  }

  // Render navbar first
  renderNavbar();
  
  // Create dashboard structure
  container.innerHTML = `
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-3 col-md-4 bg-light sidebar d-none d-md-block">
          <div class="position-sticky pt-4">
            <div class="text-center mb-4">
              <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                   style="width: 80px; height: 80px;">
                <i class="fas fa-shield-alt fa-2x"></i>
              </div>
              <h5 class="mt-3">Admin Panel</h5>
              <p class="text-muted">Manage your site</p>
            </div>
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link active" href="#" id="dashboardTabLink">
                  <i class="fas fa-tachometer-alt me-2"></i> Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="postsTabLink">
                  <i class="fas fa-clone me-2"></i> Posts
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="usersTabLink">
                  <i class="fas fa-users me-2"></i> Users
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="reportsTabLink">
                  <i class="fas fa-flag me-2"></i> Reports
                  <span class="badge bg-danger ms-2" id="reportsCount">0</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="settingsTabLink">
                  <i class="fas fa-cog me-2"></i> Settings
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Main content -->
        <div class="col-lg-9 col-md-8 dashboard-content">
          <!-- Mobile nav -->
          <div class="d-md-none mb-4">
            <div class="list-group list-group-horizontal overflow-auto">
              <a href="#" class="list-group-item list-group-item-action active" id="mobileDashboardLink">
                <i class="fas fa-tachometer-alt me-2"></i> Dashboard
              </a>
              <a href="#" class="list-group-item list-group-item-action" id="mobilePostsLink">
                <i class="fas fa-clone me-2"></i> Posts
              </a>
              <a href="#" class="list-group-item list-group-item-action" id="mobileUsersLink">
                <i class="fas fa-users me-2"></i> Users
              </a>
              <a href="#" class="list-group-item list-group-item-action" id="mobileReportsLink">
                <i class="fas fa-flag me-2"></i> Reports
                <span class="badge bg-danger ms-1" id="mobileReportsCount">0</span>
              </a>
            </div>
          </div>
          
          <!-- Tab content -->
          <div id="adminTabContent">
            <!-- Dashboard Tab (default) -->
            <div id="dashboardTab">
              <h3 class="mb-4">Dashboard Overview</h3>
              
              <!-- Stats cards -->
              <div class="row mb-4">
                <div class="col-md-3 col-sm-6 mb-3 mb-md-0">
                  <div class="stat-card bg-primary text-white">
                    <i class="fas fa-users"></i>
                    <h3 id="totalUsers">0</h3>
                    <p>Total Users</p>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3 mb-md-0">
                  <div class="stat-card bg-success text-white">
                    <i class="fas fa-clone"></i>
                    <h3 id="totalPosts">0</h3>
                    <p>Total Posts</p>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3 mb-md-0">
                  <div class="stat-card bg-info text-white">
                    <i class="fas fa-comments"></i>
                    <h3 id="totalComments">0</h3>
                    <p>Total Comments</p>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="stat-card bg-danger text-white">
                    <i class="fas fa-flag"></i>
                    <h3 id="totalReports">0</h3>
                    <p>Pending Reports</p>
                  </div>
                </div>
              </div>
              
              <div class="row">
                <!-- Recent activity -->
                <div class="col-md-6 mb-4">
                  <div class="card h-100">
                    <div class="card-header bg-transparent">
                      <h5 class="mb-0">Recent Activity</h5>
                    </div>
                    <div class="card-body">
                      <ul class="list-group list-group-flush" id="recentActivityList">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i class="fas fa-user-plus text-success me-2"></i>
                            <span>New user registered</span>
                            <small class="d-block text-muted">John Doe</small>
                          </div>
                          <small class="text-muted">5m ago</small>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i class="fas fa-flag text-danger me-2"></i>
                            <span>New report submitted</span>
                            <small class="d-block text-muted">Post ID: #1234</small>
                          </div>
                          <small class="text-muted">10m ago</small>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i class="fas fa-edit text-primary me-2"></i>
                            <span>Post created</span>
                            <small class="d-block text-muted">By: Sarah Smith</small>
                          </div>
                          <small class="text-muted">25m ago</small>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i class="fas fa-comment text-info me-2"></i>
                            <span>New comment</span>
                            <small class="d-block text-muted">By: Mike Johnson</small>
                          </div>
                          <small class="text-muted">45m ago</small>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <!-- Recent reports -->
                <div class="col-md-6 mb-4">
                  <div class="card h-100">
                    <div class="card-header bg-transparent d-flex justify-content-between align-items-center">
                      <h5 class="mb-0">Recent Reports</h5>
                      <a href="#" class="btn btn-sm btn-outline-primary" id="viewAllReportsBtn">View All</a>
                    </div>
                    <div class="card-body">
                      <ul class="list-group list-group-flush" id="recentReportsList">
                        <li class="list-group-item">
                          <div class="d-flex justify-content-between">
                            <h6 class="mb-1">Inappropriate Content</h6>
                            <span class="badge bg-danger">Post</span>
                          </div>
                          <p class="mb-1 text-truncate">This post contains misleading information...</p>
                          <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Reported by: User123</small>
                            <div>
                              <button class="btn btn-sm btn-outline-success me-1">
                                <i class="fas fa-check"></i>
                              </button>
                              <button class="btn btn-sm btn-outline-danger">
                                <i class="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        </li>
                        <li class="list-group-item">
                          <div class="d-flex justify-content-between">
                            <h6 class="mb-1">Harassment</h6>
                            <span class="badge bg-warning text-dark">Comment</span>
                          </div>
                          <p class="mb-1 text-truncate">This comment is targeting me...</p>
                          <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Reported by: User456</small>
                            <div>
                              <button class="btn btn-sm btn-outline-success me-1">
                                <i class="fas fa-check"></i>
                              </button>
                              <button class="btn btn-sm btn-outline-danger">
                                <i class="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Posts Tab (hidden by default) -->
            <div id="postsTab" class="d-none">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Manage Posts</h3>
                <div class="d-flex">
                  <div class="input-group me-2">
                    <input type="text" class="form-control" placeholder="Search posts..." id="searchPosts">
                    <button class="btn btn-outline-secondary" type="button">
                      <i class="fas fa-search"></i>
                    </button>
                  </div>
                  <div class="dropdown">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="filterPostsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fas fa-filter me-1"></i> Filter
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="filterPostsDropdown">
                      <li><a class="dropdown-item" href="#">All Posts</a></li>
                      <li><a class="dropdown-item" href="#">Reported Posts</a></li>
                      <li><a class="dropdown-item" href="#">Hidden Posts</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Author</th>
                      <th>Content</th>
                      <th>Date</th>
                      <th>Likes</th>
                      <th>Comments</th>
                      <th>Reports</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="postsTableBody">
                    <tr>
                      <td colspan="8" class="text-center">
                        <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        Loading posts...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <nav aria-label="Posts pagination">
                <ul class="pagination justify-content-center">
                  <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                  </li>
                  <li class="page-item active"><a class="page-link" href="#">1</a></li>
                  <li class="page-item"><a class="page-link" href="#">2</a></li>
                  <li class="page-item"><a class="page-link" href="#">3</a></li>
                  <li class="page-item">
                    <a class="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
            
            <!-- Users Tab (hidden by default) -->
            <div id="usersTab" class="d-none">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Manage Users</h3>
                <div class="d-flex">
                  <div class="input-group me-2">
                    <input type="text" class="form-control" placeholder="Search users..." id="searchUsers">
                    <button class="btn btn-outline-secondary" type="button">
                      <i class="fas fa-search"></i>
                    </button>
                  </div>
                  <div class="dropdown">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="filterUsersDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fas fa-filter me-1"></i> Filter
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="filterUsersDropdown">
                      <li><a class="dropdown-item" href="#">All Users</a></li>
                      <li><a class="dropdown-item" href="#">Admins</a></li>
                      <li><a class="dropdown-item" href="#">Moderators</a></li>
                      <li><a class="dropdown-item" href="#">Regular Users</a></li>
                      <li><a class="dropdown-item" href="#">Blocked Users</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Posts</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="usersTableBody">
                    <tr>
                      <td colspan="8" class="text-center">
                        <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        Loading users...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <nav aria-label="Users pagination">
                <ul class="pagination justify-content-center">
                  <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                  </li>
                  <li class="page-item active"><a class="page-link" href="#">1</a></li>
                  <li class="page-item"><a class="page-link" href="#">2</a></li>
                  <li class="page-item"><a class="page-link" href="#">3</a></li>
                  <li class="page-item">
                    <a class="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
            
            <!-- Reports Tab (hidden by default) -->
            <div id="reportsTab" class="d-none">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Manage Reports</h3>
                <div class="dropdown">
                  <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="filterReportsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-filter me-1"></i> Filter
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="filterReportsDropdown">
                    <li><a class="dropdown-item" href="#">All Reports</a></li>
                    <li><a class="dropdown-item" href="#">Post Reports</a></li>
                    <li><a class="dropdown-item" href="#">Comment Reports</a></li>
                    <li><a class="dropdown-item" href="#">Pending</a></li>
                    <li><a class="dropdown-item" href="#">Resolved</a></li>
                  </ul>
                </div>
              </div>
              
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Reason</th>
                      <th>Reported By</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="reportsTableBody">
                    <tr>
                      <td colspan="7" class="text-center">
                        <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        Loading reports...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <nav aria-label="Reports pagination">
                <ul class="pagination justify-content-center">
                  <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                  </li>
                  <li class="page-item active"><a class="page-link" href="#">1</a></li>
                  <li class="page-item"><a class="page-link" href="#">2</a></li>
                  <li class="page-item"><a class="page-link" href="#">3</a></li>
                  <li class="page-item">
                    <a class="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
            
            <!-- Settings Tab (hidden by default) -->
            <div id="settingsTab" class="d-none">
              <h3 class="mb-4">Admin Settings</h3>
              
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">General Settings</h5>
                </div>
                <div class="card-body">
                  <form id="generalSettingsForm">
                    <div class="mb-3">
                      <label for="siteName" class="form-label">Site Name</label>
                      <input type="text" class="form-control" id="siteName" value="SocialBlog">
                    </div>
                    <div class="mb-3">
                      <label for="siteDescription" class="form-label">Site Description</label>
                      <textarea class="form-control" id="siteDescription" rows="2">A community blog for sharing ideas and connecting with others.</textarea>
                    </div>
                    <div class="mb-3 form-check">
                      <input type="checkbox" class="form-check-input" id="registrationEnabled" checked>
                      <label class="form-check-label" for="registrationEnabled">Enable User Registration</label>
                    </div>
                    <div class="mb-3 form-check">
                      <input type="checkbox" class="form-check-input" id="commentingEnabled" checked>
                      <label class="form-check-label" for="commentingEnabled">Enable Commenting</label>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                  </form>
                </div>
              </div>
              
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Moderation Settings</h5>
                </div>
                <div class="card-body">
                  <form id="moderationSettingsForm">
                    <div class="mb-3 form-check">
                      <input type="checkbox" class="form-check-input" id="autoModeration" checked>
                      <label class="form-check-label" for="autoModeration">Enable Automatic Content Moderation</label>
                    </div>
                    <div class="mb-3">
                      <label for="blacklistedWords" class="form-label">Blacklisted Words/Phrases</label>
                      <textarea class="form-control" id="blacklistedWords" rows="3" placeholder="Enter words separated by commas"></textarea>
                      <div class="form-text">Posts or comments containing these words will be automatically flagged for review.</div>
                    </div>
                    <div class="mb-3">
                      <label for="reportThreshold" class="form-label">Report Threshold</label>
                      <select class="form-select" id="reportThreshold">
                        <option value="1">1 report</option>
                        <option value="3" selected>3 reports</option>
                        <option value="5">5 reports</option>
                        <option value="10">10 reports</option>
                      </select>
                      <div class="form-text">Content will be automatically hidden after this many reports.</div>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Set up tab navigation
  setupAdminTabs();
  
  // Load initial data
  loadAdminDashboardData();
}

// Set up admin tab navigation
function setupAdminTabs() {
  // Desktop navigation
  const dashboardTabLink = document.getElementById('dashboardTabLink');
  const postsTabLink = document.getElementById('postsTabLink');
  const usersTabLink = document.getElementById('usersTabLink');
  const reportsTabLink = document.getElementById('reportsTabLink');
  const settingsTabLink = document.getElementById('settingsTabLink');
  
  // Mobile navigation
  const mobileDashboardLink = document.getElementById('mobileDashboardLink');
  const mobilePostsLink = document.getElementById('mobilePostsLink');
  const mobileUsersLink = document.getElementById('mobileUsersLink');
  const mobileReportsLink = document.getElementById('mobileReportsLink');
  
  // Tab content
  const dashboardTab = document.getElementById('dashboardTab');
  const postsTab = document.getElementById('postsTab');
  const usersTab = document.getElementById('usersTab');
  const reportsTab = document.getElementById('reportsTab');
  const settingsTab = document.getElementById('settingsTab');
  
  // View all reports button
  const viewAllReportsBtn = document.getElementById('viewAllReportsBtn');
  
  // Function to show a specific tab
  function showTab(tab) {
    // Hide all tabs
    dashboardTab.classList.add('d-none');
    postsTab.classList.add('d-none');
    usersTab.classList.add('d-none');
    reportsTab.classList.add('d-none');
    settingsTab.classList.add('d-none');
    
    // Remove active class from all links
    dashboardTabLink.classList.remove('active');
    postsTabLink.classList.remove('active');
    usersTabLink.classList.remove('active');
    reportsTabLink.classList.remove('active');
    settingsTabLink.classList.remove('active');
    
    // Mobile links
    mobileDashboardLink.classList.remove('active');
    mobilePostsLink.classList.remove('active');
    mobileUsersLink.classList.remove('active');
    mobileReportsLink.classList.remove('active');
    
    // Show the selected tab
    switch(tab) {
      case 'dashboard':
        dashboardTab.classList.remove('d-none');
        dashboardTabLink.classList.add('active');
        mobileDashboardLink.classList.add('active');
        break;
      case 'posts':
        postsTab.classList.remove('d-none');
        postsTabLink.classList.add('active');
        mobilePostsLink.classList.add('active');
        loadAdminPosts();
        break;
      case 'users':
        usersTab.classList.remove('d-none');
        usersTabLink.classList.add('active');
        mobileUsersLink.classList.add('active');
        loadAdminUsers();
        break;
      case 'reports':
        reportsTab.classList.remove('d-none');
        reportsTabLink.classList.add('active');
        mobileReportsLink.classList.add('active');
        loadAdminReports();
        break;
      case 'settings':
        settingsTab.classList.remove('d-none');
        settingsTabLink.classList.add('active');
        break;
    }
  }
  
  // Add event listeners
  dashboardTabLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('dashboard');
  });
  
  postsTabLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('posts');
  });
  
  usersTabLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('users');
  });
  
  reportsTabLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('reports');
  });
  
  settingsTabLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('settings');
  });
  
  // Mobile links
  mobileDashboardLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('dashboard');
  });
  
  mobilePostsLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('posts');
  });
  
  mobileUsersLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('users');
  });
  
  mobileReportsLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('reports');
  });
  
  // View all reports button
  viewAllReportsBtn.addEventListener('click', e => {
    e.preventDefault();
    showTab('reports');
  });
  
  // Form submissions
  const generalSettingsForm = document.getElementById('generalSettingsForm');
  const moderationSettingsForm = document.getElementById('moderationSettingsForm');
  
  generalSettingsForm.addEventListener('submit', e => {
    e.preventDefault();
    // Simulate saving settings
    showToast('Settings saved successfully!', 'success');
  });
  
  moderationSettingsForm.addEventListener('submit', e => {
    e.preventDefault();
    // Simulate saving settings
    showToast('Moderation settings saved successfully!', 'success');
  });
}

// Load admin dashboard data
async function loadAdminDashboardData() {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    // Fetch real data from API with auth token
    const [users, posts, reports] = await Promise.all([
      apiGetUsers(),
      apiGetAllPosts(),
      apiGetReports()
    ]);
    
    // Update stats with real data
    document.getElementById('totalUsers').textContent = users?.length || 0;
    document.getElementById('totalPosts').textContent = posts?.length || 0;
    document.getElementById('totalComments').textContent = posts?.reduce((acc, post) => acc + (post.comments?.length || 0), 0) || 0;
    document.getElementById('totalReports').textContent = reports?.length || 0;
    
    // Update reports count badge
    const pendingReports = reports?.filter(report => report.status === 'pending')?.length || 0;
    document.getElementById('reportsCount').textContent = pendingReports;
    document.getElementById('mobileReportsCount').textContent = pendingReports;

    // Update Recent Activity List
    const recentActivityList = document.getElementById('recentActivityList');
    if (recentActivityList) {
      // Combine and sort recent activities
      const activities = [
        // Map posts to activities
        ...(posts?.map(post => ({
          type: 'post',
          icon: 'edit',
          iconColor: 'primary',
          text: 'New post created',
          subtext: `By: ${post.author?.username || 'Unknown'}`,
          timestamp: new Date(post.created_at || post.createdAt)
        })) || []),
        // Map reports to activities
        ...(reports?.map(report => ({
          type: 'report',
          icon: 'flag',
          iconColor: 'danger',
          text: 'New report submitted',
          subtext: `${report.content_type || report.contentType}: ${report.reason || 'No reason provided'}`,
          timestamp: new Date(report.created_at || report.createdAt)
        })) || [])
      ]
      // Sort by timestamp, most recent first
      .sort((a, b) => b.timestamp - a.timestamp)
      // Take only the 5 most recent activities
      .slice(0, 5);

      recentActivityList.innerHTML = activities.map(activity => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <i class="fas fa-${activity.icon} text-${activity.iconColor} me-2"></i>
            <span>${activity.text}</span>
            <small class="d-block text-muted">${activity.subtext}</small>
          </div>
          <small class="text-muted">${formatTimeAgo(activity.timestamp)}</small>
        </li>
      `).join('') || '<li class="list-group-item text-center">No recent activity</li>';
    }

    // Update Recent Reports List
    const recentReportsList = document.getElementById('recentReportsList');
    if (recentReportsList) {
      const recentReports = (reports || [])
        .filter(report => report.status === 'pending')
        .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
        .slice(0, 3);

      if (recentReports.length > 0) {
        recentReportsList.innerHTML = recentReports.map(report => `
          <li class="list-group-item">
            <div class="d-flex justify-content-between">
              <h6 class="mb-1">${report.reason || 'No reason provided'}</h6>
              <span class="badge bg-${getContentTypeBadgeColor(report.content_type || report.contentType)}">
                ${(report.content_type || report.contentType || 'unknown').toUpperCase()}
              </span>
            </div>
            <p class="mb-1 text-truncate">${report.details || 'No details provided'}</p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">Reported by: ${report.reporter?.username || 'Anonymous'}</small>
              <div>
                <button class="btn btn-sm btn-outline-success me-1 quick-resolve-btn" data-report-id="${report.id}">
                  <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger quick-dismiss-btn" data-report-id="${report.id}">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </li>
        `).join('');

        // Add event listeners for quick action buttons
        const quickResolveButtons = recentReportsList.querySelectorAll('.quick-resolve-btn');
        const quickDismissButtons = recentReportsList.querySelectorAll('.quick-dismiss-btn');

        quickResolveButtons.forEach(button => {
          button.addEventListener('click', async () => {
            const reportId = button.dataset.reportId;
            try {
              await apiUpdateReportStatus(reportId, 'resolved', 'Action taken by admin');
              showToast('Report resolved successfully', 'success');
              await loadAdminDashboardData(); // Refresh dashboard data
            } catch (error) {
              showToast('Failed to resolve report: ' + error.message, 'danger');
            }
          });
        });

        quickDismissButtons.forEach(button => {
          button.addEventListener('click', async () => {
            const reportId = button.dataset.reportId;
            try {
              await apiUpdateReportStatus(reportId, 'dismissed', 'Dismissed by admin');
              showToast('Report dismissed successfully', 'success');
              await loadAdminDashboardData(); // Refresh dashboard data
            } catch (error) {
              showToast('Failed to dismiss report: ' + error.message, 'danger');
            }
          });
        });
      } else {
        recentReportsList.innerHTML = '<li class="list-group-item text-center">No pending reports</li>';
      }
    }

    // Add click handler for "View All Reports" button
    const viewAllReportsBtn = document.getElementById('viewAllReportsBtn');
    if (viewAllReportsBtn) {
      viewAllReportsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showTab('reports');
      });
    }
    
  } catch (error) {
    console.error('Error loading admin dashboard data:', error);
    showToast('Failed to load dashboard data: ' + error.message, 'danger');
    
    // Set default values for counters
    document.getElementById('totalUsers').textContent = '0';
    document.getElementById('totalPosts').textContent = '0';
    document.getElementById('totalComments').textContent = '0';
    document.getElementById('totalReports').textContent = '0';
    document.getElementById('reportsCount').textContent = '0';
    document.getElementById('mobileReportsCount').textContent = '0';

    // Show error state in activity and reports lists
    if (document.getElementById('recentActivityList')) {
      document.getElementById('recentActivityList').innerHTML = `
        <li class="list-group-item text-center text-danger">
          <i class="fas fa-exclamation-circle me-2"></i>Failed to load recent activity
        </li>
      `;
    }
    if (document.getElementById('recentReportsList')) {
      document.getElementById('recentReportsList').innerHTML = `
        <li class="list-group-item text-center text-danger">
          <i class="fas fa-exclamation-circle me-2"></i>Failed to load recent reports
        </li>
      `;
    }
  }
}

// Helper function to format time ago
function formatTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

// Helper function to get badge color for content type
function getContentTypeBadgeColor(contentType) {
  switch(contentType?.toLowerCase()) {
    case 'post':
      return 'primary';
    case 'comment':
      return 'info';
    case 'reply':
      return 'secondary';
    default:
      return 'warning';
  }
}

// Load admin posts
async function loadAdminPosts() {
  try {
    // Fetch posts data (mock for demo)
    const posts = await apiGetAllPosts();
    
    const postsTableBody = document.getElementById('postsTableBody');
    
    if (posts.length === 0) {
      postsTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center">No posts found</td>
        </tr>
      `;
      return;
    }
    
    // Render posts table
    postsTableBody.innerHTML = posts.map(post => {
      // Format date
      const postDate = new Date(post.createdAt);
      const formattedDate = postDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      return `
        <tr>
          <td>#${post.id}</td>
          <td>
            <div class="d-flex align-items-center">
              <img src="${post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.username)}&background=random`}" 
                   class="avatar avatar-sm me-2" alt="${post.author.username}'s avatar">
              ${post.author.username}
            </div>
          </td>
          <td class="text-truncate" style="max-width: 200px;">${post.content}</td>
          <td>${formattedDate}</td>
          <td>${post.likes.length}</td>
          <td>${post.comments.length}</td>
          <td>${post.reports?.length || 0}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-outline-primary view-post-btn" data-post-id="${post.id}">
                <i class="fas fa-eye"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-warning" data-post-id="${post.id}">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" data-post-id="${post.id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
    
  } catch (error) {
    console.error('Error loading admin posts:', error);
    document.getElementById('postsTableBody').innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-danger">
          <i class="fas fa-exclamation-circle me-2"></i>
          Failed to load posts
        </td>
      </tr>
    `;
  }
}

// Load admin users
async function loadAdminUsers() {
  try {
    // Fetch users data (mock for demo)
    const users = await apiGetUsers();
    
    const usersTableBody = document.getElementById('usersTableBody');
    
    if (users.length === 0) {
      usersTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center">No users found</td>
        </tr>
      `;
      return;
    }
    
    // Render users table
    usersTableBody.innerHTML = users.map(user => {
      // Format date
      const joinDate = new Date(user.createdAt);
      const formattedDate = joinDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      // Generate badge based on role
      let roleBadge;
      switch(user.role) {
        case 'admin':
          roleBadge = '<span class="badge bg-danger">Admin</span>';
          break;
        case 'moderator':
          roleBadge = '<span class="badge bg-warning text-dark">Moderator</span>';
          break;
        default:
          roleBadge = '<span class="badge bg-secondary">User</span>';
      }
      
      // Status badge
      const statusBadge = user.isActive 
        ? '<span class="badge bg-success">Active</span>'
        : '<span class="badge bg-danger">Blocked</span>';
      
      return `
        <tr>
          <td>#${user.id}</td>
          <td>
            <div class="d-flex align-items-center">
              <img src="${user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`}" 
                   class="avatar avatar-sm me-2" alt="${user.username}'s avatar">
              ${user.username}
            </div>
          </td>
          <td>${user.email}</td>
          <td>${roleBadge}</td>
          <td>${formattedDate}</td>
          <td>${user.posts?.length || 0}</td>
          <td>${statusBadge}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-outline-primary" data-user-id="${user.id}">
                <i class="fas fa-eye"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-warning" data-user-id="${user.id}">
                <i class="fas fa-user-edit"></i>
              </button>
              <button type="button" class="btn btn-sm ${user.isActive ? 'btn-outline-danger' : 'btn-outline-success'}" data-user-id="${user.id}">
                <i class="fas ${user.isActive ? 'fa-ban' : 'fa-user-check'}"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
    
  } catch (error) {
    console.error('Error loading admin users:', error);
    document.getElementById('usersTableBody').innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-danger">
          <i class="fas fa-exclamation-circle me-2"></i>
          Failed to load users
        </td>
      </tr>
    `;
  }
}

// Load admin reports
async function loadAdminReports() {
  try {
    const reports = await apiGetReports();
    
    const reportsTableBody = document.getElementById('reportsTableBody');
    
    if (!reports || reports.length === 0) {
      reportsTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">No reports found</td>
        </tr>
      `;
      return;
    }
    
    // Render reports table
    reportsTableBody.innerHTML = reports.map(report => {
      // Format date
      const reportDate = new Date(report.created_at || report.createdAt);
      const formattedDate = reportDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      // Type badge
      let typeBadge;
      switch(report.content_type || report.contentType) {
        case 'post':
          typeBadge = '<span class="badge bg-primary">Post</span>';
          break;
        case 'comment':
          typeBadge = '<span class="badge bg-info">Comment</span>';
          break;
        case 'reply':
          typeBadge = '<span class="badge bg-secondary">Reply</span>';
          break;
        default:
          typeBadge = '<span class="badge bg-secondary">Unknown</span>';
      }
      
      // Status badge
      const statusBadge = report.status === 'pending' 
        ? '<span class="badge bg-warning text-dark">Pending</span>'
        : '<span class="badge bg-success">Resolved</span>';
      
      // Safe access to reporter info
      const reporter = report.reporter || {};
      const reporterUsername = reporter.username || 'Anonymous';
      const reporterAvatar = reporter.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reporterUsername)}&background=random`;
      
      return `
        <tr>
          <td>#${report.id}</td>
          <td>${typeBadge}</td>
          <td>${report.reason || 'N/A'}</td>
          <td>
            <div class="d-flex align-items-center">
              <img src="${reporterAvatar}" 
                   class="avatar avatar-sm me-2" alt="${reporterUsername}'s avatar">
              ${reporterUsername}
            </div>
          </td>
          <td>${formattedDate}</td>
          <td>${statusBadge}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-outline-primary view-content-btn" 
                      data-content-id="${report.content_id || report.contentId}" 
                      data-content-type="${report.content_type || report.contentType}">
                <i class="fas fa-eye"></i>
              </button>
              ${report.status === 'pending' ? `
                <button type="button" class="btn btn-sm btn-outline-success resolve-report-btn" data-report-id="${report.id}">
                  <i class="fas fa-check"></i>
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger dismiss-report-btn" data-report-id="${report.id}">
                  <i class="fas fa-times"></i>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Add event listeners for report actions
    const resolveButtons = reportsTableBody.querySelectorAll('.resolve-report-btn');
    const dismissButtons = reportsTableBody.querySelectorAll('.dismiss-report-btn');
    const viewButtons = reportsTableBody.querySelectorAll('.view-content-btn');

    resolveButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const reportId = button.dataset.reportId;
        try {
          await apiUpdateReportStatus(reportId, 'resolved', 'Action taken by admin');
          showToast('Report resolved successfully', 'success');
          await loadAdminReports();
        } catch (error) {
          showToast('Failed to resolve report: ' + error.message, 'danger');
        }
      });
    });

    dismissButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const reportId = button.dataset.reportId;
        try {
          await apiUpdateReportStatus(reportId, 'dismissed', 'Dismissed by admin');
          showToast('Report dismissed successfully', 'success');
          await loadAdminReports();
        } catch (error) {
          showToast('Failed to dismiss report: ' + error.message, 'danger');
        }
      });
    });
    
  } catch (error) {
    console.error('Error loading admin reports:', error);
    document.getElementById('reportsTableBody').innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger">
          <i class="fas fa-exclamation-circle me-2"></i>
          Failed to load reports: ${error.message}
        </td>
      </tr>
    `;
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