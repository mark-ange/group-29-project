// Leases Management - Pure JavaScript
// No Java backend required - uses mock data

const AppState = { currentUser: null, currentToken: null, allLeases: [], filteredLeases: [] };

const DOM = {
    userName: document.getElementById('user-name'),
    loginBtn: document.getElementById('login-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    roleInfo: document.getElementById('role-info'),
    leasesList: document.getElementById('leases-list'),
    createLeaseBtn: document.getElementById('create-lease-btn'),
    leaseModal: document.getElementById('lease-modal'),
    leaseForm: document.getElementById('lease-form'),
    leaseDetailModal: document.getElementById('lease-detail-modal'),
    leaseDetail: document.getElementById('lease-detail'),
    loginModal: document.getElementById('login-modal'),
    loginForm: document.getElementById('login-form'),
    loginUsername: document.getElementById('login-username'),
    loginPassword: document.getElementById('login-password'),
    loginError: document.getElementById('login-error')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    checkAuth();
    if (AppState.currentUser) loadLeases();
});

function initEventListeners() {
    if (DOM.loginBtn) DOM.loginBtn.addEventListener('click', () => openModal(DOM.loginModal));
    if (DOM.logoutBtn) DOM.logoutBtn.addEventListener('click', handleLogout);
    if (DOM.loginForm) DOM.loginForm.addEventListener('submit', handleLogin);
    if (DOM.createLeaseBtn) DOM.createLeaseBtn.addEventListener('click', openCreateLeaseForm);
    if (DOM.leaseForm) DOM.leaseForm.addEventListener('submit', handleCreateLease);
    
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => closeActiveModal());
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeActiveModal();
    });
}

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
    const result = mockData.validateLogin(username, password);
    
    if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        AppState.currentUser = result.user;
        AppState.currentToken = result.token;
        updateUIForAuth();
        closeModal(DOM.loginModal);
        DOM.loginForm.reset();
        DOM.loginError.style.display = 'none';
        loadLeases();
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
    AppState.allLeases = [];
    renderLeases();
    showAlert('You have been logged out.', 'info');
}

function updateUIForAuth() {
    if (AppState.currentUser) {
        DOM.userName.textContent = `${AppState.currentUser.firstName} ${AppState.currentUser.lastName}`;
        DOM.loginBtn.style.display = 'none';
        DOM.logoutBtn.style.display = 'inline-block';
        
        const roleText = getRoleDisplayText();
        if (DOM.roleInfo) {
            DOM.roleInfo.textContent = roleText;
            DOM.roleInfo.style.display = 'block';
        }
        
        if (DOM.createLeaseBtn) {
            DOM.createLeaseBtn.style.display = (AppState.currentUser.role === 'admin' || AppState.currentUser.role === 'manager') ? 'inline-block' : 'none';
        }
    } else {
        DOM.userName.textContent = 'Not logged in';
        DOM.loginBtn.style.display = 'inline-block';
        DOM.logoutBtn.style.display = 'none';
        if (DOM.roleInfo) DOM.roleInfo.style.display = 'none';
        if (DOM.createLeaseBtn) DOM.createLeaseBtn.style.display = 'none';
    }
    loadLeases();
}

function getRoleDisplayText() {
    const user = AppState.currentUser;
    if (!user) return '';
    
    switch(user.role) {
        case 'admin': return 'You are viewing all leases as an Administrator';
        case 'manager': return 'You are viewing all leases as a Property Manager';
        case 'tenant': return 'You are viewing your leases as a Tenant';
        default: return `You are logged in as ${user.role}`;
    }
}

function loadLeases() {
    if (!AppState.currentUser) {
        AppState.allLeases = [];
        renderLeases();
        return;
    }
    
    AppState.allLeases = mockData.getLeasesForUser(AppState.currentUser.id);
    renderLeases();
}

function renderLeases() {
    if (!DOM.leasesList) return;
    
    if (AppState.allLeases.length === 0) {
        DOM.leasesList.innerHTML = `
            <div class="empty-state">
                <i>&#128114;</i>
                <h3>No leases found</h3>
                <p>No lease agreements available for your account.</p>
            </div>
        `;
        return;
    }
    
    DOM.leasesList.innerHTML = AppState.allLeases.map(lease => {
        const property = mockData.mockProperties.find(p => p.id === lease.propertyId);
        const tenant = mockData.mockUsers.find(u => u.id === lease.tenantId);
        const propertyInfo = property ? `${property.address}, ${property.city}` : `Property #${lease.propertyId}`;
        const tenantInfo = tenant ? `${tenant.firstName} ${tenant.lastName}` : `Tenant #${lease.tenantId}`;
        
        return `
        <div class="request-card" data-id="${lease.id}">
            <div class="request-card-header">
                <span class="request-id">Lease #${lease.id}</span>
                <span class="request-status ${lease.status}">${lease.status.replace('_', ' ')}</span>
            </div>
            <div class="request-card-body">
                <div class="request-description">
                    <strong>${propertyInfo}</strong>
                </div>
                <div class="request-meta">
                    <span><i>&#128100;</i> Tenant: ${tenantInfo}</span>
                    <span><i>&#128197;</i> $${lease.monthlyRent}/mo</span>
                    <span><i>&#128197;</i> ${formatDate(lease.startDate)} - ${formatDate(lease.endDate)}</span>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    // Add click handlers for lease cards
    document.querySelectorAll('.request-card').forEach(card => {
        card.addEventListener('click', () => {
            const leaseId = parseInt(card.dataset.id);
            showLeaseDetail(leaseId);
        });
    });
}

function showLeaseDetail(leaseId) {
    const lease = AppState.allLeases.find(l => l.id === leaseId);
    if (!lease) return;
    
    const property = mockData.mockProperties.find(p => p.id === lease.propertyId);
    const tenant = mockData.mockUsers.find(u => u.id === lease.tenantId);
    const manager = mockData.mockUsers.find(u => u.id === property.managerId);
    
    let propertyInfo = '';
    if (property) {
        propertyInfo = `
            <div class="detail-row">
                <div class="detail-label">Property:</div>
                <div class="detail-value">${property.address}, ${property.city}, ${property.state} ${property.zipCode}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Details:</div>
                <div class="detail-value">${property.bedrooms} beds, ${property.bathrooms} baths, ${property.squareFeet} sqft</div>
            </div>
        `;
    }
    
    let tenantInfo = '';
    if (tenant) {
        tenantInfo = `
            <div class="detail-row">
                <div class="detail-label">Tenant:</div>
                <div class="detail-value">${tenant.firstName} ${tenant.lastName} (${tenant.email}, ${tenant.phone})</div>
            </div>
        `;
    }
    
    let managerInfo = '';
    if (manager) {
        managerInfo = `
            <div class="detail-row">
                <div class="detail-label">Manager:</div>
                <div class="detail-value">${manager.firstName} ${manager.lastName} (${manager.email})</div>
            </div>
        `;
    }
    
    DOM.leaseDetail.innerHTML = `
        <div class="detail-header">
            <h2>Lease #${lease.id}</h2>
            <span class="request-status ${lease.status}">${lease.status.replace('_', ' ')}</span>
        </div>
        <div class="detail-body">
            ${propertyInfo}
            ${tenantInfo}
            ${managerInfo}
            <div class="detail-row">
                <div class="detail-label">Start Date:</div>
                <div class="detail-value">${formatDate(lease.startDate)}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">End Date:</div>
                <div class="detail-value">${formatDate(lease.endDate)}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Monthly Rent:</div>
                <div class="detail-value">$${lease.monthlyRent}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Security Deposit:</div>
                <div class="detail-value">$${lease.securityDeposit}</div>
            </div>
            <div class="detail-description">
                <p><strong>Agreement:</strong> ${lease.leaseAgreement}</p>
            </div>
        </div>
    `;
    
    openModal(DOM.leaseDetailModal);
}

function openCreateLeaseForm() {
    if (DOM.leaseForm) {
        DOM.leaseForm.reset();
        DOM.leaseForm.dataset.mode = 'create';
        populateTenantDropdown();
        populatePropertyDropdown();
    }
    openModal(DOM.leaseModal);
}

function populateTenantDropdown() {
    const tenantSelect = document.getElementById('tenantId');
    if (!tenantSelect) return;
    
    const tenantUsers = mockData.mockUsers.filter(u => u.role === 'tenant');
    
    tenantSelect.innerHTML = '<option value="">Select a tenant...</option>';
    tenantUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.firstName} ${user.lastName} (${user.email})`;
        tenantSelect.appendChild(option);
    });
}

function populatePropertyDropdown() {
    const propertySelect = document.getElementById('propertyId');
    if (!propertySelect) return;
    
    propertySelect.innerHTML = '<option value="">Select a property...</option>';
    mockData.mockProperties.forEach(property => {
        const option = document.createElement('option');
        option.value = property.id;
        option.textContent = `${property.address}, ${property.city} - $${property.monthlyRent}/mo`;
        propertySelect.appendChild(option);
    });
}

function handleCreateLease(e) {
    e.preventDefault();
    
    const tenantId = parseInt(document.getElementById('tenantId').value);
    const propertyId = parseInt(document.getElementById('propertyId').value);
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const monthlyRent = parseFloat(document.getElementById('monthlyRent').value);
    const securityDeposit = parseFloat(document.getElementById('securityDeposit').value);
    const status = document.getElementById('status').value;
    const leaseAgreement = document.getElementById('leaseAgreement').value;
    
    const newLease = {
        id: Math.max(...mockData.mockLeases.map(l => l.id), 0) + 1,
        tenantId: tenantId,
        propertyId: propertyId,
        startDate: startDate,
        endDate: endDate,
        monthlyRent: monthlyRent,
        securityDeposit: securityDeposit,
        status: status,
        leaseAgreement: leaseAgreement
    };
    
    mockData.mockLeases.push(newLease);
    closeModal(DOM.leaseModal);
    loadLeases();
    showAlert('Lease created successfully!', 'success');
}

// ============================================
// Utility Functions
// ============================================

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function openModal(modal) {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeActiveModal() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        closeModal(modal);
    });
}

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
    
    setTimeout(() => {
        alert.style.transition = 'opacity 0.3s, transform 0.3s';
    }, 10);
}

// Make mockData available globally if not already
if (typeof window !== 'undefined') {
    window.AppState = AppState;
}
