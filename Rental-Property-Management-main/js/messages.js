// Messages Management - Pure JavaScript
// No Java backend required - uses mock data

const AppState = { currentUser: null, currentToken: null, allMessages: [], filteredMessages: [] };

const DOM = {
    userName: document.getElementById('user-name'),
    loginBtn: document.getElementById('login-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    roleInfo: document.getElementById('role-info'),
    messagesList: document.getElementById('messages-list'),
    createMessageBtn: document.getElementById('create-message-btn'),
    messageModal: document.getElementById('message-modal'),
    messageForm: document.getElementById('message-form'),
    messageDetailModal: document.getElementById('message-detail-modal'),
    messageDetail: document.getElementById('message-detail'),
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
    if (AppState.currentUser) loadMessages();
});

function initEventListeners() {
    if (DOM.loginBtn) DOM.loginBtn.addEventListener('click', () => openModal(DOM.loginModal));
    if (DOM.logoutBtn) DOM.logoutBtn.addEventListener('click', handleLogout);
    if (DOM.loginForm) DOM.loginForm.addEventListener('submit', handleLogin);
    if (DOM.createMessageBtn) DOM.createMessageBtn.addEventListener('click', openCreateMessageForm);
    if (DOM.messageForm) DOM.messageForm.addEventListener('submit', handleCreateMessage);
    
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
        loadMessages();
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
    AppState.allMessages = [];
    renderMessages();
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
        
        if (DOM.createMessageBtn) {
            DOM.createMessageBtn.style.display = 'inline-block';
        }
    } else {
        DOM.userName.textContent = 'Not logged in';
        DOM.loginBtn.style.display = 'inline-block';
        DOM.logoutBtn.style.display = 'none';
        if (DOM.roleInfo) DOM.roleInfo.style.display = 'none';
        if (DOM.createMessageBtn) DOM.createMessageBtn.style.display = 'none';
    }
    loadMessages();
}

function getRoleDisplayText() {
    const user = AppState.currentUser;
    if (!user) return '';
    
    switch(user.role) {
        case 'admin': return 'You are viewing all messages as an Administrator';
        case 'manager': return 'You are viewing all messages as a Property Manager';
        case 'tenant': return 'You are viewing your messages as a Tenant';
        default: return `You are logged in as ${user.role}`;
    }
}

function loadMessages() {
    if (!AppState.currentUser) {
        AppState.allMessages = [];
        renderMessages();
        return;
    }
    
    // Get messages received by this user
    const receivedMessages = mockData.getMessagesForUser(AppState.currentUser.id);
    // Get messages sent by this user
    const sentMessages = mockData.getSentMessagesForUser(AppState.currentUser.id);
    
    // Combine and sort by date
    AppState.allMessages = [...receivedMessages, ...sentMessages].sort((a, b) => {
        return new Date(b.sentDate) - new Date(a.sentDate);
    });
    
    renderMessages();
}

function renderMessages() {
    if (!DOM.messagesList) return;
    
    if (AppState.allMessages.length === 0) {
        DOM.messagesList.innerHTML = `
            <div class="empty-state">
                <i>&#128222;</i>
                <h3>No messages found</h3>
                <p>You have no messages yet. Send a message to get started.</p>
            </div>
        `;
        return;
    }
    
    DOM.messagesList.innerHTML = AppState.allMessages.map(message => {
        const sender = mockData.mockUsers.find(u => u.id === message.senderId);
        const receiver = mockData.mockUsers.find(u => u.id === message.receiverId);
        const senderName = sender ? `${sender.firstName} ${sender.lastName}` : `User #${message.senderId}`;
        const receiverName = receiver ? `${receiver.firstName} ${receiver.lastName}` : `User #${message.receiverId}`;
        const isReceived = message.receiverId === AppState.currentUser.id;
        const statusText = isReceived ? (message.read ? 'Read' : 'Unread') : 'Sent';
        
        return `
        <div class="request-card" data-id="${message.id}" style="${!message.read && isReceived ? 'background: rgba(11, 24, 73, 0.05);' : ''}">
            <div class="request-card-header">
                <span class="request-id">${isReceived ? 'From: ' + senderName : 'To: ' + receiverName}</span>
                <span class="request-status" style="background: ${isReceived && !message.read ? '#0B1849' : 'transparent'}; color: ${isReceived && !message.read ? '#fff' : '#0B1849'}; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">${statusText}</span>
            </div>
            <div class="request-card-body">
                <div class="request-description">
                    <strong>${message.subject}</strong>
                </div>
                <div class="request-meta">
                    <span><i>&#128222;</i> ${formatDate(message.sentDate)}</span>
                    <span><i>&#128193;</i> ${message.type || 'general'}</span>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    // Add click handlers for message cards
    document.querySelectorAll('.request-card').forEach(card => {
        card.addEventListener('click', () => {
            const messageId = parseInt(card.dataset.id);
            showMessageDetail(messageId);
        });
    });
}

function showMessageDetail(messageId) {
    const message = AppState.allMessages.find(m => m.id === messageId);
    if (!message) return;
    
    const sender = mockData.mockUsers.find(u => u.id === message.senderId);
    const receiver = mockData.mockUsers.find(u => u.id === message.receiverId);
    const senderName = sender ? `${sender.firstName} ${sender.lastName} (${sender.email})` : `User #${message.senderId}`;
    const receiverName = receiver ? `${receiver.firstName} ${receiver.lastName} (${receiver.email})` : `User #${message.receiverId}`;
    const isReceived = message.receiverId === AppState.currentUser.id;
    
    // Mark as read if it's a received message
    if (isReceived && !message.read) {
        message.read = true;
        renderMessages();
    }
    
    DOM.messageDetail.innerHTML = `
        <div class="detail-header">
            <h2>${message.subject}</h2>
            <span class="request-status ${isReceived ? 'received' : 'sent'}">${isReceived ? 'Received' : 'Sent'}</span>
        </div>
        <div class="detail-body">
            <div class="detail-row">
                <div class="detail-label">From:</div>
                <div class="detail-value">${isReceived ? senderName : AppState.currentUser.firstName + ' ' + AppState.currentUser.lastName}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">To:</div>
                <div class="detail-value">${isReceived ? AppState.currentUser.firstName + ' ' + AppState.currentUser.lastName : receiverName}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Date:</div>
                <div class="detail-value">${formatDateTime(message.sentDate)}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Type:</div>
                <div class="detail-value">${message.type || 'General'}</div>
            </div>
            <div class="detail-description">
                <p>${message.body}</p>
            </div>
        </div>
    `;
    
    openModal(DOM.messageDetailModal);
}

function openCreateMessageForm() {
    if (DOM.messageForm) {
        DOM.messageForm.reset();
        DOM.messageForm.dataset.mode = 'create';
        populateRecipientDropdown();
    }
    openModal(DOM.messageModal);
}

function populateRecipientDropdown() {
    const recipientSelect = document.getElementById('receiverId');
    if (!recipientSelect) return;
    
    const currentUser = AppState.currentUser;
    const otherUsers = mockData.mockUsers.filter(u => u.id !== currentUser.id);
    
    recipientSelect.innerHTML = '<option value="">Select a recipient...</option>';
    otherUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.firstName} ${user.lastName} (${user.role}) - ${user.email}`;
        recipientSelect.appendChild(option);
    });
}

function handleCreateMessage(e) {
    e.preventDefault();
    
    const receiverId = parseInt(document.getElementById('receiverId').value);
    const subject = document.getElementById('subject').value;
    const body = document.getElementById('body').value;
    const messageType = document.getElementById('messageType').value;
    
    const newMessage = {
        id: Math.max(...mockData.mockMessages.map(m => m.id), 0) + 1,
        senderId: AppState.currentUser.id,
        receiverId: receiverId,
        subject: subject,
        body: body,
        sentDate: new Date().toISOString(),
        read: false,
        type: messageType
    };
    
    mockData.mockMessages.push(newMessage);
    closeModal(DOM.messageModal);
    loadMessages();
    showAlert('Message sent successfully!', 'success');
}

// ============================================
// Utility Functions
// ============================================

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
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
