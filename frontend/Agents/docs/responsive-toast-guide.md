# Responsive Toast Guide

This guide explains how to implement and use responsive toasts in the AA Homes application.

## Overview

Responsive toasts automatically adjust their positioning and behavior based on the device screen size. On mobile devices, toasts are centered at the top of the screen for better visibility, while on desktop devices, they appear in the top-right corner.

## Implementation

The responsive toast functionality is implemented using a custom React hook: `useResponsiveToast`.

### The Hook

The hook is located at: `src/hooks/useResponsiveToast.ts`

Key features:
- Automatically detects mobile devices based on screen width and user agent
- Adjusts toast positioning (top-center for mobile, top-right for desktop)
- Provides functions for different toast types: success, error, info, warning

### CSS Styles

Responsive styles are defined in: `src/styles/globals.css`

These styles ensure toasts are properly sized and positioned on all devices:
- Width adjustments for different screen sizes
- Font size adjustments for better readability
- Proper spacing and stacking on mobile devices

## Usage

### In Components

To use responsive toasts in your components:

1. Import the hook:
```typescript
import { useResponsiveToast } from "@/hooks/useResponsiveToast";
```

2. Use the hook in your component:
```typescript
const MyComponent = () => {
  const { toastSuccess, toastError, toastInfo, toastWarning } = useResponsiveToast();
  
  const handleClick = () => {
    toastSuccess("Operation completed successfully!");
  };
  
  return (
    <button onClick={handleClick}>Click me</button>
  );
};
```

### Available Functions

- `toastSuccess(message: string, options?: ToastOptions)` - Shows a success toast
- `toastError(message: string, options?: ToastOptions)` - Shows an error toast
- `toastInfo(message: string, options?: ToastOptions)` - Shows an info toast
- `toastWarning(message: string, options?: ToastOptions)` - Shows a warning toast

### Options

All functions accept an optional `ToastOptions` parameter that allows you to customize the toast behavior:
```typescript
toastSuccess("Custom toast", {
  autoClose: 3000, // Close after 3 seconds
  position: "bottom-center", // Override default position
});
```

## Best Practices

1. **Use the hook instead of direct toast imports**: Always use `useResponsiveToast` instead of importing `toast` directly from `react-toastify`.

2. **Destructure only what you need**: 
```typescript
// Good
const { toastSuccess } = useResponsiveToast();

// Avoid
const { toastSuccess, toastError, toastInfo, toastWarning } = useResponsiveToast();
```

3. **Handle errors gracefully**: Always provide meaningful error messages to users.

4. **Use appropriate toast types**: 
   - Success: For completed actions
   - Error: For failed operations
   - Info: For general information
   - Warning: For important notices

## Migration from Direct Toast Imports

If you're migrating from direct `react-toastify` imports:

1. Replace:
```typescript
import { toast } from "react-toastify";
```

With:
```typescript
import { useResponsiveToast } from "@/hooks/useResponsiveToast";
// ...
const { toastSuccess, toastError } = useResponsiveToast();
```

2. Replace:
```typescript
toast.success("Message");
```

With:
```typescript
toastSuccess("Message");
```

3. Replace:
```typescript
toast.error("Message");
```

With:
```typescript
toastError("Message");
```

## Utility Functions

For utility functions that can't use React hooks (like in `src/utils`), continue using direct toast imports:
```typescript
const { toast } = require("react-toastify");
toast.error("Error message");
```

## Testing

To test responsive behavior:
1. Use browser developer tools to simulate different screen sizes
2. Check that toasts appear in the correct position
3. Verify that toasts are readable on all device sizes
4. Ensure multiple toasts stack properly on mobile devices

## Customization

To customize the responsive behavior:
1. Modify the mobile detection threshold in `useResponsiveToast.ts`
2. Adjust CSS styles in `globals.css`
3. Update the ToastContainer configuration in `_app.tsx` if needed

## Troubleshooting

### Toasts not appearing
- Ensure the ToastContainer is properly configured in `_app.tsx`
- Check that you're using the hook correctly
- Verify that CSS styles aren't being overridden

### Incorrect positioning
- Check the mobile detection logic in `useResponsiveToast.ts`
- Verify CSS media queries in `globals.css`
- Ensure the ToastContainer isn't being styled by other CSS rules

### Performance issues
- The hook uses resize event listeners; ensure proper cleanup
- Limit the number of simultaneous toasts using the `limit` prop in ToastContainer