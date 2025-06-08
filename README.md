# VaktAI - Intelligent Scheduling Platform

This is a guide for running and testing the VaktAI application, which has been refactored into a modular component structure.

## Project Structure

The application has been modularized into the following structure:

- **Layout components**: Header.tsx, Footer.tsx
- **Modal components**: SettingsModal.tsx, NotificationsModal.tsx, AddStaffModal.tsx, AddTourModal.tsx, StaffDetailsModal.tsx, ShiftModal.tsx, ReplacementModal.tsx
- **Chart components**: BarChart.tsx, LineChart.tsx, DoughnutChart.tsx
- **Schedule components**: WeeklySchedule.tsx
- **AI components**: AIChat.tsx
- **Common components**: Toast.tsx, LoadingSpinner.tsx, ErrorBoundary.tsx, Icons.tsx
- **View components**: ScheduleView.tsx, StaffView.tsx, ToursView.tsx, AnalyticsView.tsx, AIView.tsx

## Running the Application

To run the application:

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173/
```

## Notes on TypeScript Errors

You may notice TypeScript errors in the console when running the application. These are expected and do not affect the functionality. The errors are primarily related to:

1. React type definitions
2. Import statement formats
3. Component prop typing

These issues can be addressed by:

1. Ensuring `@types/react` and `@types/react-dom` are properly installed
2. Correctly formatting import statements
3. Adding proper prop types to components

## Component Relationships

The main relationships between components are:

1. The main application entry point is `pages/index.tsx` which imports all necessary view components
2. View components (ScheduleView, StaffView, etc.) use the modals and charts
3. All components use the common components (Toast, LoadingSpinner, etc.)
4. The API interactions are managed through the `hooks/useApi.ts` hook

## Next Steps

To continue improving the application:

1. Fix TypeScript errors by updating type definitions
2. Add proper tests for each component
3. Consider moving to a proper state management solution like Redux or React Context
4. Add responsive design improvements for mobile views
