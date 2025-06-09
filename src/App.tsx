import React from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/common/Header';
import ScheduleView from './components/views/ScheduleView';
import StaffView from './components/views/StaffView';
import ToursView from './components/views/ToursView';
import AnalyticsView from './components/views/AnalyticsView';
import AIView from './components/views/AIView';
import { Staff } from './types';

console.log('Header:', Header);
console.log('ScheduleView:', ScheduleView);
console.log('StaffView:', StaffView);
console.log('ToursView:', ToursView);
console.log('AnalyticsView:', AnalyticsView);
console.log('AIView:', AIView);

// Sanity check component
const SanityCheck: React.FC = () => {
  const [staff, setStaff] = React.useState<Staff[]>([]);
  const [date, setDate] = React.useState<Date>(new Date());

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
      <h2 className="text-lg font-semibold text-green-800">Sanity Check</h2>
      <div className="mt-4 space-y-4">
        <div className="p-2 bg-white rounded">
          <h3 className="font-medium">Header Test:</h3>
          <Header 
            user={null}
            notificationsCount={0}
            onNotificationsClick={() => {}}
            onSettingsClick={() => {}}
          />
        </div>
        <div className="p-2 bg-white rounded">
          <h3 className="font-medium">ScheduleView Test:</h3>
          <ScheduleView 
            date={date}
            onDateChange={setDate}
            staff={staff}
          />
        </div>
        <div className="p-2 bg-white rounded">
          <h3 className="font-medium">StaffView Test:</h3>
          <StaffView 
            staff={staff}
            onStaffChange={setStaff}
          />
        </div>
        <div className="p-2 bg-white rounded">
          <h3 className="font-medium">ToursView Test:</h3>
          <ToursView 
            onToursChange={() => {}}
          />
        </div>
        <div className="p-2 bg-white rounded">
          <h3 className="font-medium">AnalyticsView Test:</h3>
          <AnalyticsView />
        </div>
        <div className="p-2 bg-white rounded">
          <h3 className="font-medium">AIView Test:</h3>
          <AIView />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">Component Sanity Check</h1>
          <SanityCheck />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;