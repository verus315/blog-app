import { apiGetReports, apiUpdateReportStatus, apiDeleteReportedContent } from '../api/adminApi.js';
import { showToast } from '../utils/toast.js';

export async function renderReportManagement(container) {
  container.innerHTML = `
    <div class="container py-4">
      <h2 class="mb-4">Report Management</h2>
      
      <div class="card">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
              <a class="nav-link active" data-status="pending" href="#">Pending</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-status="resolved" href="#">Resolved</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-status="dismissed" href="#">Dismissed</a>
            </li>
          </ul>
        </div>
        <div class="card-body">
          <div id="reportsContainer">
            <div class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading reports...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Load initial reports
  await loadReports('pending');

  // Add event listeners for tab switching
  const tabLinks = container.querySelectorAll('.nav-link');
  tabLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      tabLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      await loadReports(link.dataset.status);
    });
  });
}

async function loadReports(status) {
  const reportsContainer = document.getElementById('reportsContainer');
  
  try {
    const reports = await apiGetReports();
    const filteredReports = reports.filter(report => report.status === status);
    
    if (filteredReports.length === 0) {
      reportsContainer.innerHTML = `
        <div class="text-center text-muted">
          <p>No ${status} reports found.</p>
        </div>
      `;
      return;
    }

    reportsContainer.innerHTML = `
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Date</th>
              <th>Content Type</th>
              <th>Reason</th>
              <th>Details</th>
              <th>Reporter</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filteredReports.map(report => `
              <tr>
                <td>${new Date(report.created_at).toLocaleString()}</td>
                <td>${report.content_type}</td>
                <td>${report.reason}</td>
                <td>${report.details || '<em>No details provided</em>'}</td>
                <td>${report.reporter.username}</td>
                <td>
                  ${status === 'pending' ? `
                    <div class="btn-group">
                      <button class="btn btn-sm btn-success resolve-report" data-report-id="${report.id}" data-content-id="${report.content_id}" data-content-type="${report.content_type}">
                        <i class="fas fa-check"></i> Resolve
                      </button>
                      <button class="btn btn-sm btn-danger dismiss-report" data-report-id="${report.id}">
                        <i class="fas fa-times"></i> Dismiss
                      </button>
                    </div>
                  ` : `
                    <span class="badge bg-${status === 'resolved' ? 'success' : 'secondary'}">
                      ${status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Add event listeners for action buttons
    if (status === 'pending') {
      // Resolve buttons
      const resolveButtons = reportsContainer.querySelectorAll('.resolve-report');
      resolveButtons.forEach(button => {
        button.addEventListener('click', async () => {
          const reportId = button.dataset.reportId;
          const contentId = button.dataset.contentId;
          const contentType = button.dataset.contentType;
          
          if (confirm('Are you sure you want to resolve this report? This will delete the reported content.')) {
            try {
              // Delete the reported content
              await apiDeleteReportedContent(contentId, contentType);
              
              // Update report status
              await apiUpdateReportStatus(reportId, 'resolved', 'Content removed');
              
              showToast('Report resolved and content deleted successfully', 'success');
              await loadReports(status);
            } catch (error) {
              showToast(error.message || 'Failed to resolve report', 'danger');
            }
          }
        });
      });

      // Dismiss buttons
      const dismissButtons = reportsContainer.querySelectorAll('.dismiss-report');
      dismissButtons.forEach(button => {
        button.addEventListener('click', async () => {
          const reportId = button.dataset.reportId;
          
          if (confirm('Are you sure you want to dismiss this report?')) {
            try {
              await apiUpdateReportStatus(reportId, 'dismissed', 'No action needed');
              showToast('Report dismissed successfully', 'success');
              await loadReports(status);
            } catch (error) {
              showToast(error.message || 'Failed to dismiss report', 'danger');
            }
          }
        });
      });
    }
    
  } catch (error) {
    reportsContainer.innerHTML = `
      <div class="alert alert-danger">
        Failed to load reports: ${error.message}
      </div>
    `;
  }
} 