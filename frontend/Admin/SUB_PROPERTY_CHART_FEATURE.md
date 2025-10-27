# Sub-Property Chart Breakdown Feature

## Overview
This feature adds a new chart to the dashboard that provides a visual breakdown of sub-properties by type, complementing the existing property breakdown chart.

## Implementation Details

### 1. New Component: SubPropertyChart
- Created a new reusable component [SubPropertyChart.tsx](src/pages/dashboard/components/SubPropertyChart.tsx)
- Uses the same Chart.js library as other charts for consistency
- Follows the same design patterns as existing chart components

### 2. Data Processing
- Added new state variable `subPropertyTypeData` to store sub-property type statistics
- Modified the data fetching logic in the dashboard to:
  - Iterate through all properties and their sub-properties
  - Count sub-properties by type
  - Generate chart data for the sub-property breakdown

### 3. Dashboard Integration
- Imported the new SubPropertyChart component
- Added the sub-property chart to the dashboard layout
- Updated the grid layout to accommodate the new chart
- Modified the total properties calculation to include sub-properties

### 4. Visual Design
- Uses a distinct color palette to differentiate from main property charts
- Maintains consistent styling with other dashboard charts
- Responsive design that works on all screen sizes

## Benefits
1. **Enhanced Analytics**: Provides deeper insights into the property portfolio by showing sub-property distribution
2. **Better Decision Making**: Helps administrators understand the composition of their inventory
3. **Consistent UI**: Maintains the same look and feel as existing dashboard components
4. **Performance**: Efficiently processes data without impacting dashboard loading times

## Data Sources
The sub-property chart pulls data from:
- Property data fetched via `getAllProperties()` hook
- Sub-property information contained within each property's `SubProperties` array
- Type information from each sub-property's `type` field

## Color Coding
- Main Property Types: Blue, Orange, Green, Yellow
- Sub-Property Types: Purple, Pink, Teal, Amber

This distinction helps users quickly identify between main properties and sub-properties in the charts.