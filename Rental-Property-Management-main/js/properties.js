// Properties Management - Pure JavaScript
// No Java backend required - uses mock data

const AppState = { currentUser: null, currentToken: null, allProperties: [], filteredProperties: [] };

const DOM = {
    userName: document.getElementById('user-name'),
    loginBtn: document.getElementById('login-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    roleInfo: document.getElementById('role-info'),
    propertiesList: document.getElementById('properties-list'),
    createPropertyBtn: document.getElementById('create-property-btn'),
    propertyModal: document.getElementById('property-modal'),
    propertyForm: document.getElementById('property-form'),
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
    if (AppState.currentUser) loadProperties();
});

function initEventListeners() {
    if (DOM.loginBtn) DOM.loginBtn.addEventListener('click', () => openModal(DOM.loginModal));
    if (DOM.logoutBtn) DOM.logoutBtn.addEventListener('click', handleLogout);
    if (DOM.loginForm) DOM.loginForm.addEventListener('submit', handleLogin);
    if (DOM.createPropertyBtn) DOM.createPropertyBtn.addEventListener('click', openCreatePropertyForm);
    if (DOM.propertyForm) DOM.propertyForm.addEventListener('submit', handleCreateProperty);
    
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
        loadProperties();
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
    AppState.allProperties = [];
    renderProperties();
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
        
        if (AppState.currentUser.role === 'admin' || AppState.currentUser.role === 'manager') {
            DOM.createPropertyBtn.style.display = 'inline-block';
        } else {
            DOM.createPropertyBtn.style.display = 'none';
        }
    } else {
        DOM.userName.textContent = 'Not logged in';
        DOM.loginBtn.style.display = 'inline-block';
        DOM.logoutBtn.style.display = 'none';
        if (DOM.roleInfo) DOM.roleInfo.style.display = 'none';
        DOM.createPropertyBtn.style.display = 'none';
    }
}

function getRoleDisplayText() {
    const user = AppState.currentUser;
    switch (user.role) {
        case 'admin': return `ADMIN - Full access to all properties`;
        case 'manager': return `MANAGER - View and manage your assigned properties`;
        case 'tenant': return `TENANT - View properties you're leasing`;
        default: return '';
    }
}

function loadProperties() {
    if (!AppState.currentUser) {
        AppState.allProperties = [];
    } else {
        AppState.allProperties = mockData.getPropertiesForUser(AppState.currentUser.id);
    }
    renderProperties();
}

function renderProperties() {
    if (AppState.allProperties.length === 0) {
        DOM.propertiesList.innerHTML = `
            <div class="empty-state">
                <i>&#127968;</i>
                <h3>No properties found</h3>
                <p>${AppState.currentUser ? 'You have no properties assigned.' : 'Please log in to view properties.'}</p>
            </div>
        `;
        return;
    }
    
    DOM.propertiesList.innerHTML = AppState.allProperties.map(property => `
        <div class="property-card card-hover" data-id="${property.id}">
            <div class="property-image" style="background-image: url('${property.imageUrl}'); background-size: cover; background-position: center; height: 180px; border-radius: var(--radius); margin-bottom: 1rem;"></div>
            <div class="property-info">
                <div class="property-header">
                    <h3>${escapeHtml(property.name)}</h3>
                    <span class="property-status ${property.available ? 'available' : 'occupied'}">
                        ${property.available ? 'Available' : 'Occupied'}
                    </span>
                </div>
                <p class="property-address">${escapeHtml(property.address)}, ${escapeHtml(property.city)}, ${escapeHtml(property.state)} ${escapeHtml(property.zipCode)}</p>
                <p class="property-description">${escapeHtml(property.description)}</p>
                <div class="property-details">
                    <span><i>&#128179;</i> $${property.monthlyRent}/mo</span>
                    <span><i>&#128737;</i> ${property.bedrooms} beds, ${property.bathrooms} baths</span>
                    <span><i>&#128317;</i> ${property.squareFeet} sqft</span>
                </div>
                ${getPropertyActions(property)}
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.property-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const propertyId = parseInt(card.dataset.id);
            const target = e.target.closest('button');
            if (!target) showPropertyDetail(propertyId);
        });
    });
}

function getPropertyActions(property) {
    if (!AppState.currentUser) return '';
    
    const actions = [];
    
    if (AppState.currentUser.role === 'admin') {
        actions.push(`
            <button class="btn btn-sm btn-outline" onclick="editProperty(${property.id})">
                <i>&#9998;</i> Edit
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteProperty(${property.id})">
                <i>&#128465;</i> Delete
            </button>
        `);
    }
    
    if (AppState.currentUser.role === 'manager' && property.managerId === AppState.currentUser.id) {
        actions.push(`
            <button class="btn btn-sm btn-outline" onclick="editProperty(${property.id})">
                <i>&#9998;</i> Edit
            </button>
        `);
    }
    
    if (actions.length > 0) {
        return `<div class="property-actions" style="display: flex; gap: .5rem; margin-top: 1rem;">${actions.join('')}</div>`;
    }
    
    return '';
}

function showPropertyDetail(propertyId) {
    const property = AppState.allProperties.find(p => p.id === propertyId);
    if (!property) return;
    
    const manager = mockData.mockUsers.find(u => u.id === property.managerId);
    const leases = mockData.mockLeases.filter(l => l.propertyId === propertyId);
    const tenants = leases.map(l => mockData.mockUsers.find(u => u.id === l.tenantId)).filter(Boolean);
    
    const detailHtml = `
        <div class="detail-header">
            <h2>${escapeHtml(property.name)}</h2>
            <div class="property-status-badge ${property.available ? 'available' : 'occupied'}">
                ${property.available ? 'Available for Rent' : 'Currently Occupied'}
            </div>
        </div>
        
        <div class="detail-body">
            <div class="detail-image" style="background-image: url('${property.imageUrl}'); background-size: cover; background-position: center; height: 200px; border-radius: var(--radius); margin-bottom: 1.5rem;"></div>
            
            <div class="detail-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
                <div class="detail-item">
                    <div class="detail-label">Address</div>
                    <div class="detail-value">${escapeHtml(property.address)}, ${escapeHtml(property.city)}, ${escapeHtml(property.state)} ${escapeHtml(property.zipCode)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Manager</div>
                    <div class="detail-value">${manager ? `${manager.firstName} ${manager.lastName}` : 'Unassigned'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Monthly Rent</div>
                    <div class="detail-value">$${property.monthlyRent}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Bedrooms</div>
                    <div class="detail-value">${property.bedrooms}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Bathrooms</div>
                    <div class="detail-value">${property.bathrooms}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Square Feet</div>
                    <div class="detail-value">${property.squareFeet}</div>
                </div>
            </div>
            
            <div class="detail-description">
                <div class="detail-label">Description</div>
                <p>${escapeHtml(property.description)}</p>
            </div>
            
            ${tenants.length > 0 ? `
            <div class="detail-tenants" style="margin-top: 1.5rem;">
                <div class="detail-label">Current Tenants (${tenants.length})</div>
                <div class="tenants-list" style="display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .5rem;">
                    ${tenants.map(t => `<span class="tenant-tag">${t.firstName} ${t.lastName}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${getPropertyDetailActions(property)}
        </div>
    `;
    
    const modal = document.getElementById('property-detail-modal') || DOM.propertyModal;
    const detail = document.getElementById('property-detail') || DOM.propertyModal.querySelector('.modal-body');
    if (modal && detail) {
        detail.innerHTML = detailHtml;
        openModal(modal);
    }
}

function getPropertyDetailActions(property) {
    if (!AppState.currentUser) return '';
    
    const actions = [];
    
    if (AppState.currentUser.role === 'admin' || 
        (AppState.currentUser.role === 'manager' && property.managerId === AppState.currentUser.id)) {
        actions.push(`
            <button class="btn btn-primary" onclick="editProperty(${property.id})">
                <i>&#9998;</i> Edit Property
            </button>
        `);
    }
    
    if (AppState.currentUser.role === 'admin') {
        actions.push(`
            <button class="btn btn-danger" onclick="deleteProperty(${property.id})">
                <i>&#128465;</i> Delete Property
            </button>
        `);
    }
    
    if (actions.length > 0) {
        return `<div class="detail-actions" style="display: flex; gap: 1rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e9ecef;">${actions.join('')}</div>`;
    }
    
    return '';
}

function openCreatePropertyForm() {
    if (!AppState.currentUser) {
        showAlert('Please login first', 'error');
        openModal(DOM.loginModal);
        return;
    }
    
    if (AppState.currentUser.role !== 'admin' && AppState.currentUser.role !== 'manager') {
        showAlert('Only admins and managers can create properties', 'error');
        return;
    }
    
    DOM.propertyForm.reset();
    openModal(DOM.propertyModal);
}

function handleCreateProperty(e) {
    e.preventDefault();
    
    const formData = new FormData(DOM.propertyForm);
    const property = {
        id: Math.max(...mockData.mockProperties.map(p => p.id), 0) + 1,
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zipCode: formData.get('zipCode'),
        name: formData.get('name'),
        description: formData.get('description'),
        monthlyRent: parseFloat(formData.get('monthlyRent')),
        bedrooms: parseInt(formData.get('bedrooms')),
        bathrooms: parseFloat(formData.get('bathrooms')),
        squareFeet: parseInt(formData.get('squareFeet')),
        available: formData.get('available') === 'true',
        managerId: AppState.currentUser.role === 'admin' ? parseInt(formData.get('managerId')) : AppState.currentUser.id,
        imageUrl: formData.get('imageUrl') || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    };
    
    mockData.mockProperties.push(property);
    closeModal(DOM.propertyModal);
    loadProperties();
    showAlert('Property created successfully!', 'success');
}

function editProperty(propertyId) {
    const property = AppState.allProperties.find(p => p.id === propertyId);
    if (!property) return;
    
    // Populate form
    DOM.propertyForm.elements['address'].value = property.address;
    DOM.propertyForm.elements['city'].value = property.city;
    DOM.propertyForm.elements['state'].value = property.state;
    DOM.propertyForm.elements['zipCode'].value = property.zipCode;
    DOM.propertyForm.elements['name'].value = property.name;
    DOM.propertyForm.elements['description'].value = property.description;
    DOM.propertyForm.elements['monthlyRent'].value = property.monthlyRent;
    DOM.propertyForm.elements['bedrooms'].value = property.bedrooms;
    DOM.propertyForm.elements['bathrooms'].value = property.bathrooms;
    DOM.propertyForm.elements['squareFeet'].value = property.squareFeet;
    DOM.propertyForm.elements['available'].value = property.available;
    DOM.propertyForm.elements['imageUrl'].value = property.imageUrl;
    
    if (AppState.currentUser.role === 'admin') {
        const managerSelect = DOM.propertyForm.elements['managerId'];
        if (managerSelect) {
            mockData.mockUsers.filter(u => u.role === 'manager').forEach(manager => {
                const option = document.createElement('option');
                option.value = manager.id;
                option.textContent = `${manager.firstName} ${manager.lastName}`;
                if (manager.id === property.managerId) option.selected = true;
                managerSelect.appendChild(option);
            });
        }
    }
    
    // Update form to edit mode
    DOM.propertyForm.dataset.mode = 'edit';
    DOM.propertyForm.dataset.id = propertyId;
    
    openModal(DOM.propertyModal);
}

function deleteProperty(propertyId) {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    const index = mockData.mockProperties.findIndex(p => p.id === propertyId);
    if (index !== -1) {
        mockData.mockProperties.splice(index, 1);
        loadProperties();
        showAlert('Property deleted successfully!', 'success');
    }
}

// Modal Functions
function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function closeActiveModal() {
    document.querySelectorAll('.modal.active').forEach(modal => closeModal(modal));
}

// Utility Functions
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '1000';
    alert.style.maxWidth = '400px';
    alert.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    alert.style.borderRadius = '8px';
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateX(100px)';
        alert.style.transition = 'all 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
    
    setTimeout(() => {
        alert.style.transition = 'all 0.3s ease';
    }, 10);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally available
window.editProperty = editProperty;
window.deleteProperty = deleteProperty;
window.showPropertyDetail = showPropertyDetail;
