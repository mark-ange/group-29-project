# Pure HTML/CSS/JS Frontend - No Java Backend Required

## Overview

This is a **complete frontend-only version** of the Rental Property Management System that uses **only HTML, CSS, and JavaScript** - **no Java backend, no database, no Spring Boot required**.

All data is stored in memory using mock data that matches the structure of the original Java backend.

## Project Structure

```
Rental-Property-Management-main/
├── index.html                    # Main homepage with dashboard
├── maintenance-requests.html     # Maintenance requests management
├── properties.html               # Properties listing (template)
├── payments.html                # Payments listing (template)
├── messages.html                # Messages (template)
├── leases.html                  # Leases (template)
├── 
├── js/
│   ├── mockData.js              # Core mock data with all entities
│   ├── app.js                   # Main application logic
│   └── maintenance-requests.js  # Maintenance requests logic
│
├── styles/
│   ├── main.css                 # Global styles
│   └── maintenance-requests.css # Maintenance requests styles
│
└── FRONTEND_ONLY_README.md      # This file
```

## Quick Start

### Option 1: Open Directly in Browser

Simply open any of the HTML files in your browser:
- `index.html` - Main homepage
- `maintenance-requests.html` - Maintenance requests page

**No server required!** These are static HTML files that work directly in your browser.

### Option 2: Use a Local Server

For better development experience, you can use a local server:

```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js (if installed)
npx serve

# Using PHP (if installed)
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Demo Accounts

Use these pre-configured accounts to login:

| Username | Password | Role | What You Can See |
|----------|----------|------|-----------------|
| `admin` | `admin123` | Admin | All users, all properties, all requests, all payments |
| `manager` | `manager123` | Manager | All properties managed by you, all requests for your properties |
| `tenant1` | `tenant123` | Tenant | Only your properties, your requests, your payments |
| `tenant2` | `tenant123` | Tenant | Only your properties, your requests, your payments |

## Features Implemented

### ✅ Authentication
- Login with username/password
- Role-based access (admin, manager, tenant)
- Token storage in localStorage
- Session persistence across page refreshes

### ✅ Maintenance Requests (Fully Working)
- **For Tenants:**
  - View your own maintenance requests
  - Create new maintenance requests
  - View request details
  - Filter by status (pending, in progress, completed)
  
- **For Managers/Admins:**
  - View all maintenance requests
  - View request details with tenant info
  - Update request status (pending → in progress → completed)
  - Assign requests to yourself
  - Filter by status

### ✅ Dashboard (Index Page)
- Role-specific statistics
- Recent activity feed
- Quick navigation

### ✅ Properties (Template Ready)
- Property listing page template
- Mock data includes 4 sample properties
- Ready for implementation

### ✅ Payments (Template Ready)
- Payment listing page template
- Mock data includes 4 sample payments
- Ready for implementation

### ✅ Messages (Template Ready)
- Message listing page template
- Mock data includes 3 sample messages
- Ready for implementation

## How It Works

### Mock Data

All data is stored in JavaScript arrays in `js/mockData.js`:

- **Users:** 4 sample users with different roles
- **Properties:** 4 sample properties with images
- **Leases:** 3 sample leases
- **Maintenance Requests:** 3 sample requests
- **Payments:** 4 sample payments
- **Messages:** 3 sample messages
- **Account Balances:** 2 sample balances

### Data Filtering

The `mockData.js` file includes **role-based filtering functions** that automatically return the correct data for each user:

```javascript
// For properties
mockData.getPropertiesForUser(userId)
// Returns: All properties for admin, manager's properties for manager, tenant's properties for tenant

// For maintenance requests
mockData.getMaintenanceRequestsForUser(userId)
// Returns: All requests for admin/manager, tenant's requests for tenant

// For payments
mockData.getPaymentsForUser(userId)
// Returns: All payments for admin/manager, tenant's payments for tenant

// For messages
mockData.getMessagesForUser(userId)
// Returns: Messages received by the user
```

### Authentication Flow

1. User enters username/password in login form
2. `validateLogin()` checks credentials against mockUsers
3. On success, generates a mock JWT token
4. Token and user data saved to localStorage
5. UI updates to show logged-in state
6. Data is filtered based on user role

### Mock JWT Tokens

Tokens follow the format: `header.payload.mock-signature`

The payload contains:
```json
{
  "sub": "username",
  "roles": ["role"],
  "iat": "issued at timestamp",
  "exp": "expiration timestamp (7 days)"
}
```

Tokens are **base64 encoded** and can be decoded using `mockData.decodeMockToken()`.

## Adding More Data

### Adding a New User

In `js/mockData.js`, add to the `mockUsers` array:

```javascript
mockUsers.push({
    id: 5, // Next available ID
    username: 'newuser',
    password: 'password123',
    role: 'tenant', // or 'manager' or 'admin'
    email: 'newuser@example.com',
    firstName: 'New',
    lastName: 'User',
    phone: '555-0105'
});
```

### Adding a New Property

In `js/mockData.js`, add to the `mockProperties` array:

```javascript
mockProperties.push({
    id: 5, // Next available ID
    address: '123 New Street',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43201',
    name: 'New Property Name',
    description: 'Description of the property',
    monthlyRent: 1000,
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 1000,
    available: true,
    managerId: 2, // ID of the manager
    imageUrl: 'https://example.com/image.jpg'
});
```

### Adding a New Maintenance Request

In `js/mockData.js`, add to the `mockMaintenanceRequests` array:

```javascript
mockMaintenanceRequests.push({
    id: 4, // Next available ID
    tenantId: 3, // ID of tenant who created it
    propertyId: 1, // ID of property
    description: 'New maintenance issue',
    status: 'pending', // pending, in_progress, completed
    priority: 'medium', // low, medium, high, emergency
    createdDate: new Date().toISOString(),
    resolvedDate: null,
    assignedTo: null, // ID of manager assigned (null if not assigned)
    category: 'general' // plumbing, electrical, hvac, general, appliance, other
});
```

## Creating New Pages

To create a new page (e.g., for leases):

### 1. Create the HTML file (`leases.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leases - Rental Property Management</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <!-- Include header -->
    <div id="app">
        <header class="header">
            <!-- Same header as other pages -->
        </header>
        
        <!-- Page content -->
        <main class="main-content">
            <div class="container">
                <h2>Leases</h2>
                <div id="leases-list">
                    <!-- Leases will be loaded here -->
                </div>
            </div>
        </main>
    </div>
    
    <!-- Include login modal -->
    <div id="login-modal" class="modal">
        <!-- Same login modal -->
    </div>
    
    <script src="js/mockData.js"></script>
    <script src="js/leases.js"></script>
</body>
</html>
```

### 2. Create the JavaScript file (`js/leases.js`)

```javascript
// Leases Application Logic
const AppState = { currentUser: null, currentToken: null, allLeases: [] };

// DOM elements
const DOM = { /* define your elements */ };

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    if (AppState.currentUser) loadLeases();
});

function checkAuth() {
    // Same as app.js
}

function loadLeases() {
    AppState.allLeases = mockData.getLeasesForUser(AppState.currentUser.id);
    renderLeases();
}

function renderLeases() {
    DOM.leasesList.innerHTML = AppState.allLeases.map(lease => `
        <div class="lease-card">
            <h3>Lease #${lease.id}</h3>
            <p>Property: ${getPropertyName(lease.propertyId)}</p>
            <p>Rent: $${lease.monthlyRent}/month</p>
            <p>Status: ${lease.status}</p>
        </div>
    `).join('');
}

// ... more functions
```

### 3. Create CSS if needed (`styles/leases.css`)

```css
/* Leases-specific styles */
.lease-card {
    background: white;
    padding: 20px;
    margin-bottom: 15px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
```

## Customizing the Design

### Colors

Edit the CSS variables in `styles/main.css`:

```css
:root {
    --primary-color: #3498db;    /* Main brand color */
    --primary-dark: #2980b9;     /* Darker shade */
    --secondary-color: #95a5a6;  /* Secondary color */
    --success-color: #2ecc71;    /* Success/positive */
    --warning-color: #f39c12;    /* Warning */
    --danger-color: #e74c3c;     /* Danger/error */
    --info-color: #16a085;       /* Info */
    /* ... more variables */
}
```

### Typography

Change the font-family in `styles/main.css`:

```css
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    /* Change to your preferred font */
}
```

## Browser Compatibility

This frontend works in all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

**Note:** For IE11, you would need to add polyfills for:
- `forEach` on NodeList
- `startsWith` on String
- `classList` on Element
- ES6 features

## Switching Back to Java Backend

If you want to switch back to using the Java backend:

1. **Keep the frontend files** - they can work with a real backend
2. **Update the service files** to make real API calls instead of using mock data

Example change in `js/maintenance-requests.js`:

```javascript
// Instead of:
// AppState.allRequests = mockData.getMaintenanceRequestsForUser(AppState.currentUser.id);

// Use real API:
fetch('/api/maintenance-requests', {
    headers: {
        'Authorization': `Bearer ${AppState.currentToken}`
    }
})
.then(response => response.json())
.then(data => {
    AppState.allRequests = data;
    renderRequests();
});
```

## Advantages of This Approach

✅ **No Backend Required** - Runs 100% in the browser
✅ **Fast Development** - No need to wait for API responses
✅ **Easy Testing** - Test different user roles and scenarios
✅ **Offline Capable** - Works without internet connection
✅ **Portable** - Can be hosted anywhere (GitHub Pages, Netlify, etc.)
✅ **Simple** - Pure HTML/CSS/JS - no build process required

## Limitations

⚠️ **No Persistence** - Data changes are lost on page refresh (except auth)
⚠️ **No Multi-User Sync** - Changes aren't visible to other browsers/users
⚠️ **In-Memory Only** - All data is stored in RAM

For production use with real data, you would need to:
1. Implement a real backend (Node.js, PHP, Java, etc.)
2. Update the frontend to make API calls to that backend
3. Or use a service like Firebase/Firestore

## Hosting

You can host this frontend on any static hosting service:

- **GitHub Pages** - Free hosting for GitHub repositories
- **Netlify** - Free static site hosting with deploy previews
- **Vercel** - Free hosting for frontend projects
- **Surge** - Simple static site hosting
- **Any web server** - Just upload the files to your server

## Credits

- Icons: Using Unicode emoji icons
- Design: Custom responsive design
- Data: Sample data matching the original Java backend structure

---

**Enjoy your pure frontend application!** No Java, no database, no backend server required!
