 // Main Application JavaScript
// No Java backend required - uses mock data

// ============================================
// Application State
// ============================================
const AppState = {
    currentUser: null,
    currentToken: null
};

// ============================================
// DOM Elements
// ============================================
const DOM = {
    userName: document.getElementById('user-name'),
    loginBtn: document.getElementById('login-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    statsSection: document.getElementById('stats-section'),
    statsGrid: document.getElementById('stats-grid'),
    activitySection: document.getElementById('activity-section'),
    activityList: document.getElementById('activity-list'),
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
    DOM.loginModal.addEventListener('click', (e) => {
        if (e.target === DOM.loginModal) closeModal(DOM.loginModal);
    });
    
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
        loadDashboard();
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
        
        // Load dashboard
        loadDashboard();
        
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
    DOM.statsSection.style.display = 'none';
    DOM.activitySection.style.display = 'none';
    showAlert('You have been logged out.', 'info');
}

function updateUIForAuth() {
    if (AppState.currentUser) {
        DOM.userName.textContent = `${AppState.currentUser.firstName} ${AppState.currentUser.lastName}`;
        DOM.loginBtn.style.display = 'none';
        DOM.logoutBtn.style.display = 'inline-block';
    } else {
        DOM.userName.textContent = 'Not logged in';
        DOM.loginBtn.style.display = 'inline-block';
        DOM.logoutBtn.style.display = 'none';
        DOM.statsSection.style.display = 'none';
        DOM.activitySection.style.display = 'none';
    }
}

// ============================================
// Dashboard
// ============================================
function loadDashboard() {
    if (!AppState.currentUser) {
        DOM.statsSection.style.display = 'none';
        DOM.activitySection.style.display = 'none';
        return;
    }
    
    // Show dashboard sections
    DOM.statsSection.style.display = 'block';
    DOM.activitySection.style.display = 'block';
    
    // Load stats based on user role
    loadStats();
    loadActivity();
}

function loadStats() {
    const stats = getStatsForUser();
    
    DOM.statsGrid.innerHTML = stats.map(stat => `
        <div class="stat-card">
            <div class="stat-icon">${stat.icon}</div>
            <div class="stat-number">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');
}

function getStatsForUser() {
    const user = AppState.currentUser;
    const stats = [];
    
    // Common stats
    stats.push({
        icon: '&#127968;',
        value: mockData.getPropertiesForUser(user.id).length,
        label: 'Properties'
    });
    
    if (user.role === 'tenant') {
        stats.push({
            icon: '&#128737;',
            value: mockData.getMaintenanceRequestsForUser(user.id).length,
            label: 'My Requests'
        });
        
        stats.push({
            icon: '&#128179;',
            value: mockData.getPaymentsForUser(user.id).length,
            label: 'My Payments'
        });
        
        const balance = mockData.getAccountBalanceForUser(user.id);
        stats.push({
            icon: '&#128178;',
            value: balance ? `$${balance.currentBalance}` : '$0',
            label: 'Balance'
        });
    } else if (user.role === 'manager') {
        stats.push({
            icon: '&#128737;',
            value: mockData.getMaintenanceRequestsForUser(user.id).length,
            label: 'Total Requests'
        });
        
        stats.push({
            icon: '&#128640;',
            value: mockData.getMaintenanceRequestsForUser(user.id).filter(r => r.status === 'in_progress').length,
            label: 'In Progress'
        });
        
        stats.push({
            icon: '&#9989;',
            value: mockData.getMaintenanceRequestsForUser(user.id).filter(r => r.status === 'completed').length,
            label: 'Completed'
        });
    } else if (user.role === 'admin') {
        stats.push({
            icon: '&#128100;',
            value: mockData.mockUsers.length,
            label: 'Users'
        });
        
        stats.push({
            icon: '&#128737;',
            value: mockData.mockMaintenanceRequests.length,
            label: 'All Requests'
        });
        
        stats.push({
            icon: '&#128179;',
            value: mockData.mockPayments.length,
            label: 'All Payments'
        });
    }
    
    return stats;
}

function loadActivity() {
    const activities = getRecentActivity();
    
    if (activities.length === 0) {
        DOM.activityList.innerHTML = `
            <div class="empty-state">
                <i>&#128197;</i>
                <h3>No recent activity</h3>
                <p>Your activity will appear here.</p>
            </div>
        `;
        return;
    }
    
    DOM.activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon" style="background-color: ${activity.color};">${activity.icon}</div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
            <span class="activity-time">${activity.time}</span>
        </div>
    `).join('');
}

function getRecentActivity() {
    const user = AppState.currentUser;
    const activities = [];
    const now = new Date();
    
    if (user.role === 'tenant') {
        // Tenant activities
        const requests = mockData.getMaintenanceRequestsForUser(user.id);
        requests.slice(0, 3).forEach(req => {
            activities.push({
                icon: '&#128737;',
                color: 'var(--primary-light)',
                title: `Maintenance Request #${req.id}`,
                description: req.description,
                time: formatRelativeDate(req.createdDate)
            });
        });
        
        const payments = mockData.getPaymentsForUser(user.id);
        payments.slice(0, 2).forEach(pay => {
            activities.push({
                icon: '&#128179;',
                color: 'var(--success-light)',
                title: `Payment of $${pay.amount}`,
                description: `Payment ${pay.status} for lease #${pay.leaseId}`,
                time: formatRelativeDate(pay.paymentDate || pay.dueDate)
            });
        });
    } else if (user.role === 'manager' || user.role === 'admin') {
        // Manager/Admin activities
        const requests = mockData.mockMaintenanceRequests.slice(0, 3);
        requests.forEach(req => {
            let color = 'var(--primary-light)';
            if (req.status === 'in_progress') color = 'var(--info-light)';
            if (req.status === 'completed') color = 'var(--success-light)';
            
            activities.push({
                icon: '&#128737;',
                color: color,
                title: `New Request #${req.id} - ${req.status.replace('_', ' ')}`,
                description: req.description,
                time: formatRelativeDate(req.createdDate)
            });
        });
        
        // Show pending requests
        const pendingRequests = mockData.mockMaintenanceRequests.filter(r => r.status === 'pending');
        if (pendingRequests.length > 0) {
            activities.push({
                icon: '&#9888;',
                color: 'var(--warning-light)',
                title: `${pendingRequests.length} Pending Requests`,
                description: 'Awaiting your attention',
                time: 'Just now'
            });
        }
    }
    
    // Sort by date (newest first)
    return activities.sort((a, b) => {
        // For simplicity, we'll just return as-is
        // In a real app, you'd parse the dates
        return 0;
    }).slice(0, 5);
}

function formatRelativeDate(dateString) {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // In seconds
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 7) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
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

// Make mockData available globally if not already
if (typeof window !== 'undefined') {
    window.AppState = AppState;
}
