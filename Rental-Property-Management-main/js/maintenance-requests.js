// Maintenance Requests Application - Pure JavaScript
// No Java backend required - uses mock data

// ============================================
// Application State
// ============================================
const AppState = {
    currentUser: null,
    currentToken: null,
    allRequests: [],
    filteredRequests: [],
    allProperties: []
};

// ============================================
// DOM Elements
// ============================================
const DOM = {
    // Header elements
    userName: document.getElementById('user-name'),
    loginBtn: document.getElementById('login-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    roleInfo: document.getElementById('role-info'),
    
    // Request elements
    createRequestBtn: document.getElementById('create-request-btn'),
    requestsList: document.getElementById('requests-list'),
    statusFilter: document.getElementById('status-filter'),
    
    // Request form
    requestModal: document.getElementById('request-modal'),
    requestForm: document.getElementById('request-form'),
    propertySelect: document.getElementById('property-id'),
    descriptionInput: document.getElementById('description'),
    categoryInput: document.getElementById('category'),
    priorityInput: document.getElementById('priority'),
    
    // Detail modal
    detailModal: document.getElementById('detail-modal'),
    requestDetail: document.getElementById('request-detail'),
    
    // Login modal
    loginModal: document.getElementById('login-modal'),
    loginForm: document.getElementById('login-form'),
    loginUsername: document.getElementById('login-username'),
    loginPassword: document.getElementById('login-password'),
    loginError: document.getElementById('login-error')
};

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    checkAuth();
    loadAllData();
});

function initEventListeners() {
    // Login/Logout
    DOM.loginBtn.addEventListener('click', () => openModal(DOM.loginModal));
    DOM.logoutBtn.addEventListener('click', handleLogout);
    DOM.loginForm.addEventListener('submit', handleLogin);
    
    // Close modals
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => closeActiveModal());
    });
    
    // Close modals on outside click
    [DOM.loginModal, DOM.requestModal, DOM.detailModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });
    
    // Request form
    DOM.createRequestBtn.addEventListener('click', openCreateRequestForm);
    DOM.requestForm.addEventListener('submit', handleCreateRequest);
    
    // Filters
    DOM.statusFilter.addEventListener('change', filterRequests);
    
    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeActiveModal();
    });
}

// ============================================
// Authentication
// ============================================
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (token && user) {
        AppState.currentUser = user;
        AppState.currentToken = token;
        updateUIForAuth();
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = DOM.loginUsername.value.trim();
    const password = DOM.loginPassword.value;
    
    // Validate login using mock data
    const result = mockData.validateLogin(username, password);
    
    if (result.success) {
        // Save to localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Update state
        AppState.currentUser = result.user;
        AppState.currentToken = result.token;
        
        // Update UI
        updateUIForAuth();
        closeModal(DOM.loginModal);
        DOM.loginForm.reset();
        DOM.loginError.style.display = 'none';
        
        // Reload requests with user filter
        loadRequests();
        
        showAlert('Login successful!', 'success');
    } else {
        DOM.loginError.textContent = result.message;
        DOM.loginError.style.display = 'block';
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    AppState.currentUser = null;
    AppState.currentToken = null;
    updateUIForAuth();
    AppState.allRequests = [];
    AppState.filteredRequests = [];
    renderRequests();
    showAlert('You have been logged out.', 'info');
}

function updateUIForAuth() {
    if (AppState.currentUser) {
        DOM.userName.textContent = `${AppState.currentUser.firstName} ${AppState.currentUser.lastName}`;
        DOM.loginBtn.style.display = 'none';
        DOM.logoutBtn.style.display = 'inline-block';
        
        // Show role info
        const roleText = getRoleDisplayText();
        DOM.roleInfo.textContent = roleText;
        DOM.roleInfo.style.display = 'block';
        
        // Show create button for tenants
        if (AppState.currentUser.role === 'tenant') {
            DOM.createRequestBtn.style.display = 'inline-block';
        } else {
            DOM.createRequestBtn.style.display = 'none';
        }
    } else {
        DOM.userName.textContent = 'Not logged in';
        DOM.loginBtn.style.display = 'inline-block';
        DOM.logoutBtn.style.display = 'none';
        DOM.roleInfo.style.display = 'none';
        DOM.createRequestBtn.style.display = 'none';
    }
}

function getRoleDisplayText() {
    const user = AppState.currentUser;
    switch (user.role) {
        case 'admin':
            return `You are logged in as ADMIN - you can see all maintenance requests`;
        case 'manager':
            return `You are logged in as MANAGER - you can see all requests for your properties`;
        case 'tenant':
            return `You are logged in as TENANT - you can see your own maintenance requests`;
        default:
            return '';
    }
}

// ============================================
// Data Loading
// ============================================
async function loadAllData() {
    // Simulate async loading
    await new Promise(resolve => setTimeout(resolve, 300));
    
    AppState.allProperties = mockData.mockProperties;
    loadRequests();
}

async function loadRequests() {
    // Show loading state
    DOM.requestsList.innerHTML = '<div class="loading">Loading maintenance requests</div>';
    
    // Simulate async loading
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (AppState.currentUser) {
        AppState.allRequests = mockData.getMaintenanceRequestsForUser(AppState.currentUser.id);
    } else {
        // For demo purposes, show sample requests when not logged in
        AppState.allRequests = mockData.mockMaintenanceRequests;
    }
    
    filterRequests();
}

function filterRequests() {
    const filter = DOM.statusFilter.value;
    
    if (filter === 'all') {
        AppState.filteredRequests = [...AppState.allRequests];
    } else {
        AppState.filteredRequests = AppState.allRequests.filter(r => r.status === filter);
    }
    
    renderRequests();
}

// ============================================
// Render Functions
// ============================================
function renderRequests() {
    if (AppState.filteredRequests.length === 0) {
        DOM.requestsList.innerHTML = `
            <div class="empty-state">
                <i>&#128737;</i>
                <h3>No maintenance requests found</h3>
                <p>Try adjusting your filter or create a new request.</p>
            </div>
        `;
        return;
    }
    
    DOM.requestsList.innerHTML = AppState.filteredRequests.map(request => `
        <div class="request-card" data-id="${request.id}">
            <div class="request-card-header">
                <div>
                    <span class="request-id">#${request.id}</span>
                    <span class="request-priority ${request.priority}">${request.priority}</span>
                </div>
                <span class="request-status ${request.status}">${request.status.replace('_', ' ')}</span>
            </div>
            <div class="request-card-body">
                <p class="request-description">${escapeHtml(request.description)}</p>
                <div class="request-category">${request.category}</div>
            </div>
            <div class="request-meta">
                <span><i>&#128197;</i> Property: ${getPropertyName(request.propertyId)}</span>
                <span><i>&#128337;</i> ${formatDate(request.createdDate)}</span>
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.request-card').forEach(card => {
        card.addEventListener('click', () => {
            const requestId = parseInt(card.dataset.id);
            showRequestDetail(requestId);
        });
    });
}

function getPropertyName(propertyId) {
    const property = AppState.allProperties.find(p => p.id === propertyId);
    return property ? property.name : `Property #${propertyId}`;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showRequestDetail(requestId) {
    const request = AppState.allRequests.find(r => r.id === requestId);
    if (!request) return;
    
    const property = AppState.allProperties.find(p => p.id === request.propertyId);
    const tenant = mockData.mockUsers.find(u => u.id === request.tenantId);
    const assignedUser = request.assignedTo ? mockData.mockUsers.find(u => u.id === request.assignedTo) : null;
    
    const statusColors = {
        pending: 'warning',
        in_progress: 'info',
        completed: 'success'
    };
    
    const statusIcons = {
        pending: '&#128337;',
        in_progress: '&#128640;',
        completed: '&#9989;'
    };
    
    DOM.requestDetail.innerHTML = `
        <div class="detail-header">
            <h2>Maintenance Request #${request.id}</h2>
            <div class="detail-status">
                <span class="request-status ${request.status}">${request.status.replace('_', ' ')}</span>
                <span class="request-priority ${request.priority}">${request.priority}</span>
            </div>
        </div>
        
        <div class="detail-body">
            <div class="detail-row">
                <span class="detail-label">Category:</span>
                <span class="detail-value">${request.category}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Property:</span>
                <span class="detail-value">${property ? property.name : `Property #${request.propertyId}`} (${property ? property.address : ''})</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Tenant:</span>
                <span class="detail-value">${tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Assigned To:</span>
                <span class="detail-value">${assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : 'Unassigned'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Created:</span>
                <span class="detail-value">${formatDate(request.createdDate)}</span>
            </div>
            ${request.resolvedDate ? `
            <div class="detail-row">
                <span class="detail-label">Resolved:</span>
                <span class="detail-value">${formatDate(request.resolvedDate)}</span>
            </div>
            ` : ''}
            <div class="detail-row detail-description">
                <span class="detail-label">Description:</span>
                <p>${escapeHtml(request.description)}</p>
            </div>
        </div>
        
        ${getUserActions(request)}
    `;
    
    openModal(DOM.detailModal);
}

function getUserActions(request) {
    if (!AppState.currentUser) return '';
    
    const actions = [];
    
    // Managers and Admins can update status
    if (AppState.currentUser.role === 'manager' || AppState.currentUser.role === 'admin') {
        if (request.status === 'pending') {
            actions.push(`
                <button class="btn btn-success" onclick="updateRequestStatus(${request.id}, 'in_progress')">
                    <i>&#128640;</i> Mark as In Progress
                </button>
            `);
        }
        if (request.status === 'in_progress') {
            actions.push(`
                <button class="btn btn-success" onclick="updateRequestStatus(${request.id}, 'completed')">
                    <i>&#9989;</i> Mark as Completed
                </button>
            `);
        }
    }
    
    // Tenants can only view their own requests
    if (AppState.currentUser.role === 'tenant' && request.tenantId === AppState.currentUser.id) {
        // Tenants can't modify requests directly
    }
    
    // Managers and Admins can assign requests
    if ((AppState.currentUser.role === 'manager' || AppState.currentUser.role === 'admin') && 
        request.status === 'pending') {
        actions.push(`
            <button class="btn btn-primary" onclick="assignRequest(${request.id})">
                <i>&#128100;</i> Assign to Me
            </button>
        `);
    }
    
    if (actions.length > 0) {
        return `
            <div class="user-actions">
                ${actions.join('')}
            </div>
        `;
    }
    
    return '';
}

function updateRequestStatus(requestId, newStatus) {
    const request = AppState.allRequests.find(r => r.id === requestId);
    if (!request) return;
    
    // Update the request
    request.status = newStatus;
    if (newStatus === 'completed') {
        request.resolvedDate = new Date().toISOString();
    }
    
    // Update in mock data
    const index = mockData.mockMaintenanceRequests.findIndex(r => r.id === requestId);
    if (index !== -1) {
        mockData.mockMaintenanceRequests[index] = request;
    }
    
    // Close modal and refresh
    closeModal(DOM.detailModal);
    filterRequests();
    showAlert(`Request #${requestId} marked as ${newStatus.replace('_', ' ')}`, 'success');
}

function assignRequest(requestId) {
    const request = AppState.allRequests.find(r => r.id === requestId);
    if (!request) return;
    
    // Assign to current user
    request.assignedTo = AppState.currentUser.id;
    request.status = 'in_progress';
    
    // Update in mock data
    const index = mockData.mockMaintenanceRequests.findIndex(r => r.id === requestId);
    if (index !== -1) {
        mockData.mockMaintenanceRequests[index] = request;
    }
    
    // Close modal and refresh
    closeModal(DOM.detailModal);
    filterRequests();
    showAlert(`Request #${requestId} assigned to you`, 'success');
}

// ============================================
// Create Request
// ============================================
function openCreateRequestForm() {
    if (!AppState.currentUser) {
        showAlert('Please login first', 'error');
        openModal(DOM.loginModal);
        return;
    }
    
    // Populate property dropdown
    const userProperties = mockData.getPropertiesForUser(AppState.currentUser.id);
    DOM.propertySelect.innerHTML = '<option value="">Select Property</option>';
    
    userProperties.forEach(prop => {
        const option = document.createElement('option');
        option.value = prop.id;
        option.textContent = `${prop.name} (${prop.address})`;
        DOM.propertySelect.appendChild(option);
    });
    
    openModal(DOM.requestModal);
}

function handleCreateRequest(e) {
    e.preventDefault();
    
    const propertyId = parseInt(DOM.propertySelect.value);
    const description = DOM.descriptionInput.value.trim();
    const category = DOM.categoryInput.value;
    const priority = DOM.priorityInput.value;
    
    if (!propertyId || !description) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    // Create new request
    const newId = Math.max(...mockData.mockMaintenanceRequests.map(r => r.id), 0) + 1;
    const newRequest = {
        id: newId,
        tenantId: AppState.currentUser.id,
        propertyId: propertyId,
        description: description,
        status: 'pending',
        priority: priority,
        createdDate: new Date().toISOString(),
        resolvedDate: null,
        assignedTo: null,
        category: category
    };
    
    // Add to mock data
    mockData.mockMaintenanceRequests.push(newRequest);
    
    // Reset form
    DOM.requestForm.reset();
    closeModal(DOM.requestModal);
     
    // Reload requests
    loadRequests();
    
    showAlert('Maintenance request created successfully!', 'success');
}

// ============================================
// Modal Functions
// ============================================
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function closeActiveModal() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        closeModal(modal);
    });
}

// ============================================
// Utility Functions
// ============================================
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '3000';
    alert.style.maxWidth = '400px';
    alert.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateX(100px)';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
    
    // Add animation
    setTimeout(() => {
        alert.style.transition = 'opacity 0.3s, transform 0.3s';
    }, 10);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Make functions globally available for onclick handlers
// ============================================
window.updateRequestStatus = updateRequestStatus;
window.assignRequest = assignRequest;
