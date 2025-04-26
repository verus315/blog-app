import { renderNavbar } from '../components/navbar.js';
import { apiGetReports } from '../api/adminApi.js';

// Render moderator dashboard
export async function renderModeratorDashboard(container) {
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
              <div class="bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center" 
                   style="width: 80px; height: 80px;">
                <i class="fas fa-user-shield fa-2x"></i>
              </div>
              <h5 class="mt-3">Moderator Panel</h5>
              <p class="text-muted">Content moderation</p>
            </div>
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link active" href="#" id="dashboardTabLink">
                  <i class="fas fa-tachometer-alt me-2"></i> Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="reportsTabLink">
                  <i class="fas fa-flag me-2"></i> Reported Content
                  <span class="badge bg-danger ms-2" id="reportsCount">0</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="approvalTabLink">
                  <i class="fas fa-check-circle me-2"></i> Pending Approval
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="historyTabLink">
                  <i class="fas fa-history me-2"></i> Moderation History
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
              <a href="#" class="list-group-item list-group-item-action" id="mobileReportsLink">
                <i class="fas fa-flag me-2"></i> Reports
                <span class="badge bg-danger ms-1" id="mobileReportsCount">0</span>
              </a>
              <a href="#" class="list-group-item list-group-item-action" id="mobileApprovalLink">
                <i class="fas fa-check-circle me-2"></i> Approval
              </a>
              <a href="#" class="list-group-item list-group-item-action" id="mobileHistoryLink">
                <i class="fas fa-history me-2"></i> History
              </a>
            </div>
          </div>
          
          <!-- Tab content -->
          <div id="moderatorTabContent">
            <!-- Dashboard Tab (default) -->
            <div id="dashboardTab">
              <h3 class="mb-4">Moderator Dashboard</h3>
              
              <!-- Stats cards -->
              <div class="row mb-4">
                <div class="col-md-3 col-sm-6 mb-3 mb-md-0">
                  <div class="stat-card bg-danger text-white">
                    <i class="fas fa-flag"></i>
                    <h3 id="pendingReportsCount">0</h3>
                    <p>Pending Reports</p>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3 mb-md-0">
                  <div class="stat-card bg-warning text-dark">
                    <i class="fas fa-check-circle"></i>
                    <h3 id="pendingApprovalCount">0</h3>
                    <p>Pending Approval</p>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3 mb-md-0">
                  <div class="stat-card bg-success text-white">
                    <i class="fas fa-check-double"></i>
                    <h3 id="resolvedCount">0</h3>
                    <p>Resolved Today</p>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="stat-card bg-info text-white">
                    <i class="fas fa-hourglass-half"></i>
                    <h3 id="avgResponseTime">0h</h3>
                    <p>Avg Response Time</p>
                  </div>
                </div>
              </div>
              
              <div class="row">
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
                            <small class="text-muted">Reported 10 minutes ago</small>
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
                            <small class="text-muted">Reported 25 minutes ago</small>
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
                
                <!-- Moderation activity -->
                <div class="col-md-6 mb-4">
                  <div class="card h-100">
                    <div class="card-header bg-transparent">
                      <h5 class="mb-0">Your Recent Activity</h5>
                    </div>
                    <div class="card-body">
                      <ul class="list-group list-group-flush" id="moderationActivityList">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i class="fas fa-check text-success me-2"></i>
                            <span>Approved post</span>
                            <small class="d-block text-muted">Post ID: #1234</small>
                          </div>
                          <small class="text-muted">10m ago</small>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i class="fas fa-times text-danger me-2"></i>
                            <span>Removed comment</span>
                            <small class="d-block text-muted">Comment ID: #5678</small>
                          </div>
                          <small class="text-muted">45m ago</small>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i class="fas fa-check text-success me-2"></i>
                            <span>Resolved report</span>
                            <small class="d-block text-muted">Report ID: #9012</small>
                          </div>
                          <small class="text-muted">1h ago</small>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Reports Tab (hidden by default) -->
            <div id="reportsTab" class="d-none">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Reported Content</h3>
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
            
            <!-- Approval Tab (hidden by default) -->
            <div id="approvalTab" class="d-none">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Content Pending Approval</h3>
                <div class="dropdown">
                  <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="filterApprovalDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-filter me-1"></i> Filter
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="filterApprovalDropdown">
                    <li><a class="dropdown-item" href="#">All Content</a></li>
                    <li><a class="dropdown-item" href="#">Posts</a></li>
                    <li><a class="dropdown-item" href="#">Comments</a></li>
                    <li><a class="dropdown-item" href="#">User Reports</a></li>
                  </ul>
                </div>
              </div>
              
              <div class="row" id="pendingApprovalContainer">
                <div class="col-12 text-center my-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2">Loading content...</p>
                </div>
              </div>
            </div>
            
            <!-- History Tab (hidden by default) -->
            <div id="historyTab" class="d-none">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Moderation History</h3>
                <div class="input-group w-auto">
                  <span class="input-group-text">Date Range</span>
                  <input type="date" class="form-control" id="startDate">
                  <input type="date" class="form-control" id="endDate">
                  <button class="btn btn-outline-secondary" type="button">Apply</button>
                </div>
              </div>
              
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Action</th>
                      <th>Content Type</th>
                      <th>Content ID</th>
                      <th>Reason</th>
                      <th>Moderator</th>
                    </tr>
                  </thead>
                  <tbody id="historyTableBody">
                    <tr>
                      <td>Aug 15, 2025</td>
                      <td><span class="badge bg-success">Approved</span></td>
                      <td>Post</td>
                      <td>#1234</td>
                      <td>Content verified as appropriate</td>
                      <td>You</td>
                    </tr>
                    <tr>
                      <td>Aug 14, 2025</td>
                      <td><span class="badge bg-danger">Removed</span></td>
                      <td>Comment</td>
                      <td>#5678</td>
                      <td>Harassment - violated community guidelines</td>
                      <td>You</td>
                    </tr>
                    <tr>
                      <td>Aug 14, 2025</td>
                      <td><span class="badge bg-warning text-dark">Warning</span></td>
                      <td>User</td>
                      <td>#91011</td>
                      <td>Multiple reports on content</td>
                      <td>You</td>
                    </tr>
                    <tr>
                      <td>Aug 13, 2025</td>
                      <td><span class="badge bg-success">Approved</span></td>
                      <td>Post</td>
                      <td>#1213</td>
                      <td>Content verified as appropriate</td>
                      <td>You</td>
                    </tr>
                    <tr>
                      <td>Aug 12, 2025</td>
                      <td><span class="badge bg-danger">Removed</span></td>
                      <td>Post</td>
                      <td>#1415</td>
                      <td>Spam - commercial content</td>
                      <td>You</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <nav aria-label="History pagination">
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
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Set up tab navigation
  setupModeratorTabs();
  
  // Load initial data
  loadModeratorDashboardData();
}

// Set up moderator tab navigation
function setupModeratorTabs() {
  // Desktop navigation
  const dashboardTabLink = document.getElementById('dashboardTabLink');
  const reportsTabLink = document.getElementById('reportsTabLink');
  const approvalTabLink = document.getElementById('approvalTabLink');
  const historyTabLink = document.getElementById('historyTabLink');
  
  // Mobile navigation
  const mobileDashboardLink = document.getElementById('mobileDashboardLink');
  const mobileReportsLink = document.getElementById('mobileReportsLink');
  const mobileApprovalLink = document.getElementById('mobileApprovalLink');
  const mobileHistoryLink = document.getElementById('mobileHistoryLink');
  
  // Tab content
  const dashboardTab = document.getElementById('dashboardTab');
  const reportsTab = document.getElementById('reportsTab');
  const approvalTab = document.getElementById('approvalTab');
  const historyTab = document.getElementById('historyTab');
  
  // View all reports button
  const viewAllReportsBtn = document.getElementById('viewAllReportsBtn');
  
  // Function to show a specific tab
  function showTab(tab) {
    // Hide all tabs
    dashboardTab.classList.add('d-none');
    reportsTab.classList.add('d-none');
    approvalTab.classList.add('d-none');
    historyTab.classList.add('d-none');
    
    // Remove active class from all links
    dashboardTabLink.classList.remove('active');
    reportsTabLink.classList.remove('active');
    approvalTabLink.classList.remove('active');
    historyTabLink.classList.remove('active');
    
    // Mobile links
    mobileDashboardLink.classList.remove('active');
    mobileReportsLink.classList.remove('active');
    mobileApprovalLink.classList.remove('active');
    mobileHistoryLink.classList.remove('active');
    
    // Show the selected tab
    switch(tab) {
      case 'dashboard':
        dashboardTab.classList.remove('d-none');
        dashboardTabLink.classList.add('active');
        mobileDashboardLink.classList.add('active');
        break;
      case 'reports':
        reportsTab.classList.remove('d-none');
        reportsTabLink.classList.add('active');
        mobileReportsLink.classList.add('active');
        loadModeratorReports();
        break;
      case 'approval':
        approvalTab.classList.remove('d-none');
        approvalTabLink.classList.add('active');
        mobileApprovalLink.classList.add('active');
        loadPendingApproval();
        break;
      case 'history':
        historyTab.classList.remove('d-none');
        historyTabLink.classList.add('active');
        mobileHistoryLink.classList.add('active');
        break;
    }
  }
  
  // Add event listeners
  dashboardTabLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('dashboard');
  });
  
  reportsTabLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('reports');
  });
  
  approvalTabLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('approval');
  });
  
  historyTabLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('history');
  });
  
  // Mobile links
  mobileDashboardLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('dashboard');
  });
  
  mobileReportsLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('reports');
  });
  
  mobileApprovalLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('approval');
  });
  
  mobileHistoryLink.addEventListener('click', e => {
    e.preventDefault();
    showTab('history');
  });
  
  // View all reports button
  viewAllReportsBtn.addEventListener('click', e => {
    e.preventDefault();
    showTab('reports');
  });
}

// Load moderator dashboard data
async function loadModeratorDashboardData() {
  try {
    // In a real app, we would fetch this data from the API
    // For demo, we'll use mock data
    
    // Update stats
    document.getElementById('pendingReportsCount').textContent = '7';
    document.getElementById('pendingApprovalCount').textContent = '3';
    document.getElementById('resolvedCount').textContent = '12';
    document.getElementById('avgResponseTime').textContent = '1.5h';
    
    // Update reports count badge
    document.getElementById('reportsCount').textContent = '7';
    document.getElementById('mobileReportsCount').textContent = '7';
    
  } catch (error) {
    console.error('Error loading moderator dashboard data:', error);
    showToast('Failed to load dashboard data', 'danger');
  }
}

// Load reports for moderator
async function loadModeratorReports() {
  try {
    // Fetch reports data (mock for demo)
    const reports = await apiGetReports();
    
    const reportsTableBody = document.getElementById('reportsTableBody');
    
    if (reports.length === 0) {
      reportsTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">No reports found</td>
        </tr>
      `;
      return;
    }
    
    // Render reports table (using the same function as admin dashboard)
    reportsTableBody.innerHTML = reports.map(report => {
      // Format date
      const reportDate = new Date(report.createdAt);
      const formattedDate = reportDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      // Type badge
      let typeBadge;
      switch(report.contentType) {
        case 'post':
          typeBadge = '<span class="badge bg-primary">Post</span>';
          break;
        case 'comment':
          typeBadge = '<span class="badge bg-info">Comment</span>';
          break;
        case 'reply':
          typeBadge = '<span class="badge bg-secondary">Reply</span>';
          break;
      }
      
      // Status badge
      const statusBadge = report.status === 'pending' 
        ? '<span class="badge bg-warning text-dark">Pending</span>'
        : '<span class="badge bg-success">Resolved</span>';
      
      return `
        <tr>
          <td>#${report.id}</td>
          <td>${typeBadge}</td>
          <td>${report.reason}</td>
          <td>
            <div class="d-flex align-items-center">
              <img src="${report.reportedBy.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.reportedBy.username)}&background=random`}" 
                   class="avatar avatar-sm me-2" alt="${report.reportedBy.username}'s avatar">
              ${report.reportedBy.username}
            </div>
          </td>
          <td>${formattedDate}</td>
          <td>${statusBadge}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-outline-primary view-content-btn" data-content-id="${report.contentId}" data-content-type="${report.contentType}">
                <i class="fas fa-eye"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-success" data-report-id="${report.id}">
                <i class="fas fa-check"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" data-report-id="${report.id}">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
    
  } catch (error) {
    console.error('Error loading moderator reports:', error);
    document.getElementById('reportsTableBody').innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger">
          <i class="fas fa-exclamation-circle me-2"></i>
          Failed to load reports
        </td>
      </tr>
    `;
  }
}

// Load content pending approval
async function loadPendingApproval() {
  try {
    // In a real app, we would fetch this data from the API
    // For demo, we'll use mock data
    const pendingContainer = document.getElementById('pendingApprovalContainer');
    
    // Simulate loading
    setTimeout(() => {
      pendingContainer.innerHTML = `
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="badge bg-primary">Post</span>
              <small class="text-muted">Flagged by automated system</small>
            </div>
            <div class="card-body">
              <h5 class="card-title">New Technology Release</h5>
              <p class="card-text">This revolutionary product will change how we interact with technology forever...</p>
              <div class="d-flex justify-content-between">
                <div class="d-flex align-items-center">
                  <img src="https://ui-avatars.com/api/?name=John+Doe&background=random" class="avatar avatar-sm me-2" alt="Author avatar">
                  <small>John Doe</small>
                </div>
                <small class="text-muted">2 hours ago</small>
              </div>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <small class="text-danger">Flagged for: Potential spam</small>
              <div>
                <button class="btn btn-sm btn-success me-1">Approve</button>
                <button class="btn btn-sm btn-danger">Reject</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="badge bg-info">Comment</span>
              <small class="text-muted">Flagged by automated system</small>
            </div>
            <div class="card-body">
              <p class="card-text">I strongly disagree with this opinion because it doesn't consider the impact...</p>
              <div class="d-flex justify-content-between">
                <div class="d-flex align-items-center">
                  <img src="https://ui-avatars.com/api/?name=Sarah+Smith&background=random" class="avatar avatar-sm me-2" alt="Author avatar">
                  <small>Sarah Smith</small>
                </div>
                <small class="text-muted">1 hour ago</small>
              </div>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <small class="text-danger">Flagged for: Potential harassment</small>
              <div>
                <button class="btn btn-sm btn-success me-1">Approve</button>
                <button class="btn btn-sm btn-danger">Reject</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="badge bg-primary">Post</span>
              <small class="text-muted">Flagged by automated system</small>
            </div>
            <div class="card-body">
              <h5 class="card-title">Health and Wellness Tips</h5>
              <p class="card-text">Try these miracle supplements to lose weight instantly...</p>
              <div class="d-flex justify-content-between">
                <div class="d-flex align-items-center">
                  <img src="https://ui-avatars.com/api/?name=Mike+Johnson&background=random" class="avatar avatar-sm me-2" alt="Author avatar">
                  <small>Mike Johnson</small>
                </div>
                <small class="text-muted">3 hours ago</small>
              </div>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <small class="text-danger">Flagged for: Potential misinformation</small>
              <div>
                <button class="btn btn-sm btn-success me-1">Approve</button>
                <button class="btn btn-sm btn-danger">Reject</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }, 1000);
  } catch (error) {
    console.error('Error loading pending approval content:', error);
    document.getElementById('pendingApprovalContainer').innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          <i class="fas fa-exclamation-circle me-2"></i>
          Failed to load content pending approval. Please try again later.
        </div>
      </div>
    `;
  }
}

// Show toast notification (reuse from adminDashboard.js)
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