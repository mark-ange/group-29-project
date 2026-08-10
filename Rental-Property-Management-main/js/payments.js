// Payments Management - Pure JavaScript
// No Java backend required - uses mock data

const AppState = { currentUser: null, currentToken: null, allPayments: [], filteredPayments: [] };

const DOM = {
    userName: document.getElementById('user-name'),
    loginBtn: document.getElementById('login-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    roleInfo: document.getElementById('role-info'),
    paymentsList: document.getElementById('payments-list'),
    createPaymentBtn: document.getElementById('create-payment-btn'),
    paymentModal: document.getElementById('payment-modal'),
    paymentForm: document.getElementById('payment-form'),
    paymentDetailModal: document.getElementById('payment-detail-modal'),
    paymentDetail: document.getElementById('payment-detail'),
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
    if (AppState.currentUser) loadPayments();
});

function initEventListeners() {
    if (DOM.loginBtn) DOM.loginBtn.addEventListener('click', () => openModal(DOM.loginModal));
    if (DOM.logoutBtn) DOM.logoutBtn.addEventListener('click', handleLogout);
    if (DOM.loginForm) DOM.loginForm.addEventListener('submit', handleLogin);
    if (DOM.createPaymentBtn) DOM.createPaymentBtn.addEventListener('click', openCreatePaymentForm);
    if (DOM.paymentForm) DOM.paymentForm.addEventListener('submit', handleCreatePayment);
    
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
    const result = window.mockData.validateLogin(username, password);
    
    if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        AppState.currentUser = result.user;
        AppState.currentToken = result.token;
        updateUIForAuth();
        closeModal(DOM.loginModal);
        DOM.loginForm.reset();
        DOM.loginError.style.display = 'none';
        loadPayments();
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
    AppState.allPayments = [];
    renderPayments();
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
        
        if (DOM.createPaymentBtn) {
            DOM.createPaymentBtn.style.display = (AppState.currentUser.role === 'admin' || AppState.currentUser.role === 'manager') ? 'inline-block' : 'none';
        }
    } else {
        DOM.userName.textContent = 'Not logged in';
        DOM.loginBtn.style.display = 'inline-block';
        DOM.logoutBtn.style.display = 'none';
        if (DOM.roleInfo) DOM.roleInfo.style.display = 'none';
        if (DOM.createPaymentBtn) DOM.createPaymentBtn.style.display = 'none';
    }
    loadPayments();
}

function getRoleDisplayText() {
    const user = AppState.currentUser;
    if (!user) return '';
    
    switch(user.role) {
        case 'admin': return 'You are viewing all payments as an Administrator';
        case 'manager': return 'You are viewing all payments as a Property Manager';
        case 'tenant': return 'You are viewing your payments as a Tenant';
        default: return `You are logged in as ${user.role}`;
    }
}

function loadPayments() {
    if (!AppState.currentUser) {
        AppState.allPayments = [];
        renderPayments();
        return;
    }
    
    AppState.allPayments = window.mockData.getPaymentsForUser(AppState.currentUser.id);
    renderPayments();
}

function renderPayments() {
    if (!DOM.paymentsList) return;
    
    if (AppState.allPayments.length === 0) {
        DOM.paymentsList.innerHTML = `
            <div class="empty-state">
                <i>&#128179;</i>
                <h3>No payments found</h3>
                <p>No payment records available for your account.</p>
            </div>
        `;
        return;
    }
    
    DOM.paymentsList.innerHTML = AppState.allPayments.map(payment => `
        <div class="request-card" data-id="${payment.id}">
            <div class="request-card-header">
                <span class="request-id">Payment #${payment.id}</span>
                <span class="request-status ${payment.status}">${payment.status.replace('_', ' ')}</span>
            </div>
            <div class="request-card-body">
                <div class="request-description">
                    <strong>Lease #${payment.leaseId}</strong> - $${payment.amount}
                </div>
                <div class="request-meta">
                    <span><i>&#128197;</i> Due: ${formatDate(payment.dueDate)}</span>
                    ${payment.paymentDate ? `<span><i>&#9989;</i> Paid: ${formatDate(payment.paymentDate)}</span>` : ''}
                    <span><i>&#128178;</i> Method: ${payment.paymentMethod || 'N/A'}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click handlers for payment cards
    document.querySelectorAll('.request-card').forEach(card => {
        card.addEventListener('click', () => {
            const paymentId = parseInt(card.dataset.id);
            showPaymentDetail(paymentId);
        });
    });
}

function showPaymentDetail(paymentId) {
    const payment = AppState.allPayments.find(p => p.id === paymentId);
    if (!payment) return;
    
    const lease = mockData.mockLeases.find(l => l.id === payment.leaseId);
    const property = lease ? mockData.mockProperties.find(p => p.id === lease.propertyId) : null;
    const tenant = lease ? mockData.mockUsers.find(u => u.id === lease.tenantId) : null;
    
    let tenantInfo = '';
    if (tenant) {
        tenantInfo = `<p><strong>Tenant:</strong> ${tenant.firstName} ${tenant.lastName}</p>`;
    }
    
    let propertyInfo = '';
    if (property) {
        propertyInfo = `<p><strong>Property:</strong> ${property.address}, ${property.city}</p>`;
    }
    
    DOM.paymentDetail.innerHTML = `
        <div class="detail-header">
            <h2>Payment #${payment.id}</h2>
            <span class="request-status ${payment.status}">${payment.status.replace('_', ' ')}</span>
        </div>
        <div class="detail-body">
            <div class="detail-row">
                <div class="detail-label">Amount:</div>
                <div class="detail-value">$${payment.amount}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Lease:</div>
                <div class="detail-value">#${payment.leaseId}</div>
            </div>
            ${tenantInfo}
            ${propertyInfo}
            <div class="detail-row">
                <div class="detail-label">Due Date:</div>
                <div class="detail-value">${formatDate(payment.dueDate)}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Payment Date:</div>
                <div class="detail-value">${payment.paymentDate ? formatDate(payment.paymentDate) : 'Not paid yet'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Method:</div>
                <div class="detail-value">${payment.paymentMethod || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Transaction ID:</div>
                <div class="detail-value">${payment.transactionId || 'N/A'}</div>
            </div>
        </div>
    `;
    
    openModal(DOM.paymentDetailModal);
}

function openCreatePaymentForm() {
    if (DOM.paymentForm) {
        DOM.paymentForm.reset();
        DOM.paymentForm.dataset.mode = 'create';
        populateLeaseDropdown();
    }
    openModal(DOM.paymentModal);
}

function populateLeaseDropdown() {
    const leaseSelect = document.getElementById('leaseId');
    if (!leaseSelect) return;
    
    const leases = mockData.getLeasesForUser(AppState.currentUser.id);
    
    leaseSelect.innerHTML = '<option value="">Select a lease...</option>';
    leases.forEach(lease => {
        const option = document.createElement('option');
        option.value = lease.id;
        const property = mockData.mockProperties.find(p => p.id === lease.propertyId);
        const tenant = mockData.mockUsers.find(u => u.id === lease.tenantId);
        const propText = property ? `${property.address}, ${property.city}` : `Property #${lease.propertyId}`;
        const tenantText = tenant ? `${tenant.firstName} ${tenant.lastName}` : `Tenant #${lease.tenantId}`;
        option.textContent = `Lease #${lease.id} - ${propText} (${tenantText}) - $${lease.monthlyRent}/mo`;
        leaseSelect.appendChild(option);
    });
}

function handleCreatePayment(e) {
    e.preventDefault();
    
    const leaseId = parseInt(document.getElementById('leaseId').value);
    const amount = parseFloat(document.getElementById('amount').value);
    const paymentDate = document.getElementById('paymentDate').value;
    const dueDate = document.getElementById('dueDate').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const status = document.getElementById('status').value;
    const transactionId = document.getElementById('transactionId').value || null;
    
    const newPayment = {
        id: Math.max(...mockData.mockPayments.map(p => p.id), 0) + 1,
        leaseId: leaseId,
        amount: amount,
        paymentDate: paymentDate || null,
        dueDate: dueDate,
        status: status,
        paymentMethod: paymentMethod,
        transactionId: transactionId
    };
    
    mockData.mockPayments.push(newPayment);
    closeModal(DOM.paymentModal);
    loadPayments();
    showAlert('Payment recorded successfully!', 'success');
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
