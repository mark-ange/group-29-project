# Mock Data Migration Guide

## Overview

This document describes the migration from a database-backed Java/Spring backend to a **Vue.js frontend with mock data**, allowing you to run the application without requiring a PostgreSQL database or Java backend server.

## What Was Changed

### New Files Created

1. **`vue/src/data/mockData.js`** - Core mock data file containing:
   - Sample users (admin, manager, tenants)
   - Sample properties with images
   - Sample leases
   - Sample maintenance requests
   - Sample payments
   - Sample messages
   - Sample account balances
   - Helper functions for data access

2. **`vue/src/data/README.md`** - Documentation for the mock data

3. **`vue/src/services/MockAuthService.js`** - Mock authentication service

4. **`vue/src/services/PropertyService.js`** - Mock property service with CRUD operations

5. **`vue/src/services/LeaseService.js`** - Mock lease service with CRUD operations

6. **`vue/src/services/MaintenanceService.js`** - Mock maintenance request service with CRUD operations

7. **`vue/src/services/PaymentService.js`** - Mock payment service with CRUD operations

8. **`vue/src/services/MessageService.js`** - Mock message service with CRUD operations

9. **`vue/src/services/index.js`** - Service index file for easy imports

### Modified Files

1. **`vue/src/services/AuthService.js`** - Updated to use `MockAuthService` instead of axios

2. **`vue/src/store/index.js`** - Removed axios dependency, uses mock token decoding

3. **`vue/src/main.js`** - Removed axios dependency

## How to Use

### 1. Install Dependencies (if not already installed)
```bash
cd Rental-Property-Management-main/vue
npm install
```

### 2. Run the Vue.js Development Server
```bash
npm run serve
```

The application will now run **without requiring the Java backend or database**!

### 3. Login with Mock Credentials

Use these pre-configured accounts:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| manager | manager123 | manager |
| tenant1 | tenant123 | tenant |
| tenant2 | tenant123 | tenant |

## Features

### Authentication
- Login and registration work with mock data
- Tokens are stored in localStorage
- Authentication state persists across page refreshes

### Data Access
- All data is filtered based on user role
- **Admin** users see all data
- **Manager** users see properties they manage
- **Tenant** users see only their own leases, payments, and requests

### CRUD Operations
All mock services support:
- Create new records
- Read/Retrieve records
- Update existing records
- Delete records

Changes persist in memory while the app is running.

### Mock API Calls
- All service calls return Promises
- 500ms delay simulates network latency
- Same response structure as real API (status, data)
- Error handling with reject() for 404s and validation errors

## Switching Back to Real Database

If you want to switch back to using the real Java backend with PostgreSQL:

### 1. Update AuthService.js
```javascript
// Comment out mock
// import mockAuthService from './MockAuthService';
// export default mockAuthService;

// Use real API
import axios from 'axios';
export default {
  login(user) { return axios.post('/login', user) },
  register(user) { return axios.post('/register', user) }
}
```

### 2. Update main.js
```javascript
import axios from 'axios';
axios.defaults.baseURL = process.env.VUE_APP_REMOTE_API;
```

### 3. Update store/index.js
```javascript
import axios from 'axios';
// Remove mockData import

// Add back axios header setup
if(currentToken != null) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
}

// Update mutations to use axios
SET_AUTH_TOKEN(state, token) {
  state.token = token;
  localStorage.setItem('token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
```

### 4. Start the Java Backend
```bash
# From the project root
mvn spring-boot:run
```

## Technical Details

### Mock Token Format

Mock JWT tokens use base64 encoding with this structure:
```
header.payload.mock-signature
```

Example token:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbImFkbWluIl0sImlhdCI6MTY5NjgwNDQwMCwiZXhwIjoxNjk3NDA5MjAwfQ.mock-signature
```

### Data Persistence

- **In Memory**: All mock data is stored in JavaScript arrays
- **localStorage**: Authentication tokens and user data persist across sessions
- **Session Only**: Created/updated records are lost on page refresh (except auth)

### Role-Based Filtering

The `mockData.js` includes helper functions that automatically filter data:

```javascript
// For properties
getPropertiesForUser(userId)
// Returns: All properties for admin, manager's properties for manager, tenant's properties for tenant

// For leases
getLeasesForUser(userId)
// Returns: All leases for admin/manager, tenant's leases for tenant

// For maintenance requests
getMaintenanceRequestsForUser(userId)
// Returns: All requests for admin/manager, tenant's requests for tenant
```

## Extending Mock Data

### Adding New Users
```javascript
// In mockData.js
mockUsers.push({
  id: 5,
  username: 'newuser',
  password: 'password123',
  role: 'tenant',
  email: 'newuser@example.com',
  firstName: 'New',
  lastName: 'User',
  phone: '555-0105'
});
```

### Adding New Properties
```javascript
mockProperties.push({
  id: 5,
  address: '123 New Street',
  city: 'Columbus',
  state: 'OH',
  zipCode: '43201',
  name: 'New Property',
  description: 'Description',
  monthlyRent: 1000,
  bedrooms: 2,
  bathrooms: 1,
  squareFeet: 1000,
  available: true,
  managerId: 2,
  imageUrl: 'https://example.com/image.jpg'
});
```

### Creating New Services

Follow the pattern in existing service files:

```javascript
// src/services/NewService.js
import mockData from '../data/mockData';

const MOCK_DELAY = 500;

const newService = {
  getItems() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, data: mockData.someArray });
      }, MOCK_DELAY);
    });
  }
  // ... other methods
};

export default newService;
```

## Testing

You can test different scenarios:

1. **Login as different users** to verify role-based data filtering
2. **Create new records** and verify they appear in lists
3. **Update records** and verify changes are reflected
4. **Delete records** and verify they are removed
5. **Register new users** and verify they can login

## Benefits of Mock Data

1. **No Backend Required**: Frontend development can proceed independently
2. **Faster Development**: No need to wait for API responses
3. **Easier Testing**: Test different user roles and scenarios
4. **Offline Development**: Work without internet connection
5. **Prototyping**: Quickly prototype new features

## Limitations

1. **No Persistence**: Data changes are lost on page refresh (except auth)
2. **No Multi-User Sync**: Changes aren't visible to other browsers/users
3. **In-Memory Only**: All data is stored in RAM

For production, switch back to the real Java backend with PostgreSQL database.
