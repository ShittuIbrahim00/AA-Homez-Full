# Schedule Visit Components

This directory contains the modular components for the schedule visit page, broken down for better maintainability and reusability.

## Component Structure

### PropertyInfo.tsx
Displays property or sub-property information including:
- Property/sub-property name and location
- Visit type indicator (Property Visit or Sub-Property Visit)
- Available scheduling days

### ClientInfoForm.tsx
Form component for collecting client information:
- Client name input
- Client phone number input

### DateTimeSelection.tsx
Date and time selection components:
- Date picker with availability filtering
- Time selection dropdown with agency schedule times

### SubmitButton.tsx
Submission button with loading states:
- Loading spinner during submission
- Disabled states based on form validity

### Confirmation.tsx
Success confirmation screen:
- Success message display
- Scheduled visit information
- Navigation options (View Schedule, Close)

## Usage

All components are exported through the index.ts file and can be imported as:

```typescript
import { PropertyInfo, ClientInfoForm, DateTimeSelection, SubmitButton, Confirmation } from "@/components/schedule/visit";
```

## Benefits

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be used in other parts of the application
3. **Maintainability**: Changes to one component don't affect others
4. **Testability**: Each component can be tested independently
5. **Readability**: The main page component is cleaner and easier to understand