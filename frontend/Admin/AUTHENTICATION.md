# Authentication System Documentation

## Overview

A comprehensive authentication system has been implemented for the AA Homes Admin dashboard that automatically checks if users are logged in and redirects them to the login page if they're not authenticated.

## Features

✅ **Automatic Login Check**: Every page automatically checks if the user is authenticated  
✅ **Automatic Redirects**: Unauthenticated users are automatically redirected to `/auth/login`  
✅ **Token Management**: Handles multiple token storage keys for backward compatibility  
✅ **Global Axios Interceptors**: Automatically handles 401 errors and token expiration  
✅ **Logout Functionality**: Comprehensive logout that clears all tokens and redirects  
✅ **Loading States**: Shows loading indicators while checking authentication  
✅ **Protected Routes**: Components and HOCs for protecting specific pages

## How It Works

### 1. Global Authentication Check (`_app.tsx`)

The app wrapper automatically checks authentication on every route change:

```typescript
// Automatically redirects to login if not authenticated
const { isLoading, isAuthenticated } = useAuth();

if (isLoading) {
  return <Loader />; // Show loading while checking auth
}
```

### 2. Authentication Hook (`useAuth.ts`)

The `useAuth` hook provides:

- `isAuthenticated`: Boolean indicating if user is logged in
- `isLoading`: Boolean for loading state
- `user`: Current user data
- `login(userData, token)`: Function to log in a user
- `logout()`: Function to log out a user
- `checkAuth()`: Function to manually check authentication

### 3. Axios Interceptors (`axiosConfig.ts`)

Automatically handles:

- Adding auth tokens to requests
- Detecting 401 errors
- Automatic logout on token expiration
- Preventing multiple redirects

### 4. Public Routes

The following routes don't require authentication:

- `/auth/login`
- `/auth/signup`
- `/auth/forgot`
- `/`
- `/home`

All other routes require authentication.

## Usage Examples

### Basic Usage (Automatic)

Your pages are automatically protected. No additional code needed:

```jsx
// This page is automatically protected
export default function Dashboard() {
  return <div>Dashboard content</div>;
}
```

### Manual Protection with HOC

For pages that need extra protection:

```jsx
import { withAuth } from "@/components/auth/ProtectedRoute";

function AdminPage() {
  return <div>Admin only content</div>;
}

export default withAuth(AdminPage, {
  requiredRole: "admin",
});
```

### Component-level Protection

```jsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function MyComponent() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

### Using Authentication Hook

```jsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      Welcome {user?.fullName}!<button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Logout Button Component

```jsx
import LogoutButton from "@/components/auth/LogoutButton";

function Navigation() {
  return (
    <nav>
      <LogoutButton
        className="px-4 py-2 bg-red-600 text-white rounded"
        confirmLogout={true}
      >
        Sign Out
      </LogoutButton>
    </nav>
  );
}
```

## Token Storage

The system handles multiple token storage keys for backward compatibility:

- `business-token` (primary)
- `authToken`
- `guard-token`
- `$token_key`

The system automatically checks all of these when validating authentication.

## Authentication Flow

1. **Page Load**: `useAuth` hook checks for valid token and user data
2. **Token Found**: User is authenticated, page loads normally
3. **No Token**: User is redirected to `/auth/login`
4. **Login Success**: Token and user data saved, redirect to `/dashboard`
5. **API Calls**: Axios automatically adds auth headers
6. **401 Error**: User is automatically logged out and redirected to login
7. **Logout**: All tokens cleared, redirect to login page

## Error Handling

- **Invalid Tokens**: Automatically cleared and user redirected to login
- **API 401 Errors**: Automatic logout and redirect
- **Network Errors**: Proper error messages displayed
- **Token Expiration**: Automatic detection and logout

## Security Features

- **Automatic Token Cleanup**: All possible token keys are cleared on logout
- **Prevent Multiple Redirects**: Protection against redirect loops
- **Secure Storage**: Uses localStorage for token storage
- **Error Boundaries**: Graceful handling of authentication errors

## Migration Notes

If you have existing authentication code:

1. The new system is backward compatible with existing tokens
2. Existing logout functionality has been updated to use the new system
3. No changes needed to existing protected pages
4. Manual authentication checks can be replaced with `useAuth` hook

## Debugging

To debug authentication issues:

```javascript
// Check current auth state
const { isAuthenticated, user } = useAuth();
console.log("Auth state:", { isAuthenticated, user });

// Check stored tokens
console.log("Tokens:", {
  businessToken: localStorage.getItem("business-token"),
  authToken: localStorage.getItem("authToken"),
  guardToken: localStorage.getItem("guard-token"),
  user: localStorage.getItem("user"),
});
```

## Testing

To test the authentication system:

1. **Login Test**: Try logging in with valid credentials
2. **Redirect Test**: Try accessing `/dashboard` without being logged in
3. **Logout Test**: Click logout and verify redirect to login page
4. **Token Expiration**: Try making API calls with invalid tokens
5. **Browser Refresh**: Refresh pages while logged in/out

The system should handle all these scenarios gracefully with appropriate redirects and loading states.
