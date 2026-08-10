// Mock Data for Rental Property Management System
// Pure JavaScript - No database or backend required
// Can be used with any HTML/CSS/JS frontend

// ============================================
// Mock Users
// ============================================
const mockUsers = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        email: 'admin@property.com',
        firstName: 'Admin',
        lastName: 'User',
        phone: '555-0101'
    },
    {
        id: 2,
        username: 'manager',
        password: 'manager123',
        role: 'manager',
        email: 'manager@property.com',
        firstName: 'Property',
        lastName: 'Manager',
        phone: '555-0102'
    },
    {
        id: 3,
        username: 'tenant1',
        password: 'tenant123',
        role: 'tenant',
        email: 'tenant1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '555-0103'
    },
    {
        id: 4,
        username: 'tenant2',
        password: 'tenant123',
        role: 'tenant',
        email: 'tenant2@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '555-0104'
    }
];

// ============================================
// Mock Properties
// ============================================
const mockProperties = [
    {
        id: 1,
        address: '123 Main Street',
        city: 'Columbus',
        state: 'OH',
        zipCode: '43215',
        name: 'Downtown Apartments',
        description: 'Luxury downtown apartments with modern amenities',
        monthlyRent: 1200,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1100,
        available: true,
        managerId: 2,
        imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 2,
        address: '456 Oak Avenue',
        city: 'Columbus',
        state: 'OH',
        zipCode: '43220',
        name: 'Oak Park Townhomes',
        description: 'Spacious townhomes in a quiet neighborhood',
        monthlyRent: 1500,
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 1600,
        available: true,
        managerId: 2,
        imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 3,
        address: '789 Pine Road',
        city: 'Columbus',
        state: 'OH',
        zipCode: '43230',
        name: 'Pine View Apartments',
        description: 'Affordable housing with great views',
        monthlyRent: 900,
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 800,
        available: false,
        managerId: 2,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 4,
        address: '321 Elm Street',
        city: 'Dublin',
        state: 'OH',
        zipCode: '43017',
        name: 'Elm Court Complex',
        description: 'Upscale apartment complex with pool and gym',
        monthlyRent: 1800,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1300,
        available: true,
        managerId: 2,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
];

// ============================================
// Mock Leases
// ============================================
const mockLeases = [
    {
        id: 1,
        tenantId: 3,
        propertyId: 1,
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        monthlyRent: 1200,
        securityDeposit: 1200,
        status: 'active',
        leaseAgreement: 'Standard lease agreement'
    },
    {
        id: 2,
        tenantId: 4,
        propertyId: 2,
        startDate: '2024-02-01',
        endDate: '2025-01-31',
        monthlyRent: 1500,
        securityDeposit: 1500,
        status: 'active',
        leaseAgreement: 'Standard lease agreement'
    },
    {
        id: 3,
        tenantId: 3,
        propertyId: 3,
        startDate: '2023-06-01',
        endDate: '2023-12-31',
        monthlyRent: 900,
        securityDeposit: 900,
        status: 'expired',
        leaseAgreement: 'Standard lease agreement'
    }
];

// ============================================
// Mock Maintenance Requests
// ============================================
const mockMaintenanceRequests = [
    {
        id: 1,
        tenantId: 3,
        propertyId: 1,
        description: 'Leaking faucet in kitchen',
        status: 'pending',
        priority: 'medium',
        createdDate: '2024-03-15T10:30:00',
        resolvedDate: null,
        assignedTo: null,
        category: 'plumbing'
    },
    {
        id: 2,
        tenantId: 4,
        propertyId: 2,
        description: 'AC not working',
        status: 'in_progress',
        priority: 'high',
        createdDate: '2024-03-10T14:15:00',
        resolvedDate: null,
        assignedTo: 2,
        category: 'hvac'
    },
    {
        id: 3,
        tenantId: 3,
        propertyId: 1,
        description: 'Broken window',
        status: 'completed',
        priority: 'low',
        createdDate: '2024-02-20T09:00:00',
        resolvedDate: '2024-02-22T16:00:00',
        assignedTo: 2,
        category: 'general'
    }
];

// ============================================
// Mock Payments
// ============================================
const mockPayments = [
    {
        id: 1,
        leaseId: 1,
        amount: 1200,
        paymentDate: '2024-03-01',
        dueDate: '2024-03-01',
        status: 'paid',
        paymentMethod: 'credit_card',
        transactionId: 'txn_123456'
    },
    {
        id: 2,
        leaseId: 1,
        amount: 1200,
        paymentDate: '2024-02-01',
        dueDate: '2024-02-01',
        status: 'paid',
        paymentMethod: 'bank_transfer',
        transactionId: 'txn_789012'
    },
    {
        id: 3,
        leaseId: 2,
        amount: 1500,
        paymentDate: '2024-03-05',
        dueDate: '2024-03-01',
        status: 'late',
        paymentMethod: 'credit_card',
        transactionId: 'txn_345678'
    },
    {
        id: 4,
        leaseId: 1,
        amount: 1200,
        paymentDate: null,
        dueDate: '2024-04-01',
        status: 'pending',
        paymentMethod: null,
        transactionId: null
    }
];

// ============================================
// Mock Messages
// ============================================
const mockMessages = [
    {
        id: 1,
        senderId: 3,
        receiverId: 2,
        subject: 'Maintenance Request',
        body: 'The faucet in my kitchen is leaking. Can you please fix it?',
        sentDate: '2024-03-15T10:30:00',
        read: false,
        type: 'maintenance'
    },
    {
        id: 2,
        senderId: 2,
        receiverId: 3,
        subject: 'Re: Maintenance Request',
        body: 'We have received your maintenance request and will address it within 24 hours.',
        sentDate: '2024-03-15T11:45:00',
        read: false,
        type: 'maintenance'
    },
    {
        id: 3,
        senderId: 4,
        receiverId: 2,
        subject: 'Rent Payment',
        body: 'I have made the rent payment for March. Please confirm receipt.',
        sentDate: '2024-03-10T09:00:00',
        read: true,
        type: 'payment'
    }
];

// ============================================
// Mock Account Balances
// ============================================
const mockAccountBalances = [
    {
        id: 1,
        tenantId: 3,
        currentBalance: 0,
        lastPaymentDate: '2024-03-01',
        nextPaymentDue: '2024-04-01',
        monthlyRent: 1200
    },
    {
        id: 2,
        tenantId: 4,
        currentBalance: 150,
        lastPaymentDate: '2024-03-05',
        nextPaymentDue: '2024-04-01',
        monthlyRent: 1500
    }
];

// ============================================
// Helper Functions
// ============================================

// Get user by username
function getUserByUsername(username) {
    return mockUsers.find(user => user.username === username);
}

// Get user by ID
function getUserById(id) {
    return mockUsers.find(user => user.id === id);
}

// Validate login credentials
function validateLogin(username, password) {
    const user = getUserByUsername(username);
    if (user && user.password === password) {
        // Return user without password for security
        const { password, ...userWithoutPassword } = user;
        return {
            success: true,
            user: userWithoutPassword,
            token: generateMockToken(user)
        };
    }
    return { success: false, message: 'Invalid username or password' };
}

// Generate a mock JWT token
function generateMockToken(user) {
    // This is a mock token that encodes user info (base64 encoded JSON)
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
        sub: user.username,
        roles: [user.role],
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days expiry
    };
    
    const encode = (obj) => {
        return btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    };
    
    return `${encode(header)}.${encode(payload)}.mock-signature`;
}

// Register a new user
function registerUser(newUser) {
    // Check if username already exists
    const existingUser = getUserByUsername(newUser.username);
    if (existingUser) {
        return { success: false, message: 'Username already exists', status: 400 };
    }
    
    // Create new user with auto-incremented ID
    const newId = Math.max(...mockUsers.map(u => u.id), 0) + 1;
    const user = {
        id: newId,
        username: newUser.username,
        password: newUser.password,
        role: newUser.role || 'tenant',
        email: newUser.email || `${newUser.username}@example.com`,
        firstName: newUser.firstName || '',
        lastName: newUser.lastName || '',
        phone: newUser.phone || ''
    };
    
    mockUsers.push(user);
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return {
        success: true,
        user: userWithoutPassword,
        token: generateMockToken(user),
        status: 201
    };
}

// Get properties for a user (filtered by role)
function getPropertiesForUser(userId) {
    const user = getUserById(userId);
    
    if (!user) {
        return [];
    }
    
    if (user.role === 'admin') {
        return mockProperties;
    }
    
    if (user.role === 'manager') {
        return mockProperties.filter(p => p.managerId === userId);
    }
    
    // For tenants, return properties they have leases for
    const tenantLeases = mockLeases.filter(l => l.tenantId === userId);
    return mockProperties.filter(p => tenantLeases.some(l => l.propertyId === p.id));
}

// Get leases for a user
function getLeasesForUser(userId) {
    const user = getUserById(userId);
    
    if (!user) {
        return [];
    }
    
    if (user.role === 'admin' || user.role === 'manager') {
        return mockLeases;
    }
    
    return mockLeases.filter(l => l.tenantId === userId);
}

// Get maintenance requests for a user
function getMaintenanceRequestsForUser(userId) {
    const user = getUserById(userId);
    
    if (!user) {
        return [];
    }
    
    if (user.role === 'admin' || user.role === 'manager') {
        return mockMaintenanceRequests;
    }
    
    // For tenants, return only their own requests
    return mockMaintenanceRequests.filter(m => m.tenantId === userId);
}

// Get payments for a user
function getPaymentsForUser(userId) {
    const user = getUserById(userId);
    
    if (!user) {
        return [];
    }
    
    if (user.role === 'admin' || user.role === 'manager') {
        return mockPayments;
    }
    
    // For tenants, return payments for their leases
    const tenantLeases = mockLeases.filter(l => l.tenantId === userId);
    return mockPayments.filter(p => tenantLeases.some(l => l.id === p.leaseId));
}

// Get messages for a user
function getMessagesForUser(userId) {
    return mockMessages.filter(m => m.receiverId === userId);
}

// Get sent messages by a user
function getSentMessagesForUser(userId) {
    return mockMessages.filter(m => m.senderId === userId);
}

// Get account balance for a user
function getAccountBalanceForUser(userId) {
    const user = getUserById(userId);
    
    if (!user) {
        return null;
    }
    
    if (user.role === 'admin' || user.role === 'manager') {
        return mockAccountBalances;
    }
    
    return mockAccountBalances.find(a => a.tenantId === userId);
}

// Decode mock token to get user info
function decodeMockToken(token) {
    if (!token || token === 'null') {
        return null;
    }
    
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        const username = payload.sub;
        const user = getUserByUsername(username);
        
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        
        return null;
    } catch (error) {
        return null;
    }
}

// ============================================
// Export for use in modules (if using ES6 modules)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mockUsers,
        mockProperties,
        mockLeases,
        mockMaintenanceRequests,
        mockPayments,
        mockMessages,
        mockAccountBalances,
        getUserByUsername,
        getUserById,
        validateLogin,
        generateMockToken,
        registerUser,
        getPropertiesForUser,
        getLeasesForUser,
        getMaintenanceRequestsForUser,
        getPaymentsForUser,
        getMessagesForUser,
        getSentMessagesForUser,
        getAccountBalanceForUser,
        decodeMockToken
    };
}

// ============================================
// Make available globally for standalone HTML files
// ============================================
window.mockData = {
    mockUsers,
    mockProperties,
    mockLeases,
    mockMaintenanceRequests,
    mockPayments,
    mockMessages,
    mockAccountBalances,
    getUserByUsername,
    getUserById,
    validateLogin,
    generateMockToken,
    registerUser,
    getPropertiesForUser,
    getLeasesForUser,
    getMaintenanceRequestsForUser,
    getPaymentsForUser,
    getMessagesForUser,
    getSentMessagesForUser,
    getAccountBalanceForUser,
    decodeMockToken
};
