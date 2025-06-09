import React, { useState } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
import { Staff, Tour } from '../../types';

// Safe imports with fallbacks
let Header: any;
try {
  Header = require('../common/Header').default;
} catch (err) {
  console.error("Failed to import Header:", err);
  Header = () => <div>Header not available</div>;
}

let ScheduleView: any;
try {
  ScheduleView = require('../views/ScheduleView').default;
} catch (err) {
  console.error("Failed to import ScheduleView:", err);
  ScheduleView = () => <div>Schedule view not available</div>;
}

let StaffView: any;
try {
  StaffView = require('../views/StaffView').default;
} catch (err) {
  console.error("Failed to import StaffView:", err);
  StaffView = () => <div>Staff view not available</div>;
}

let ToursView: any;
try {
  ToursView = require('../views/ToursView').default;
} catch (err) {
  console.error("Failed to import ToursView:", err);
  ToursView = () => <div>Tours view not available</div>;
}

let AnalyticsView: any;
try {
  AnalyticsView = require('../views/AnalyticsView').default;
} catch (err) {
  console.error("Failed to import AnalyticsView:", err);
  AnalyticsView = () => <div>Analytics view not available</div>;
}

let AIView: any;
try {
  AIView = require('../views/AIView').default;
} catch (err) {
  console.error("Failed to import AIView:", err);
  AIView = () => <div>AI view not available</div>;
}

type View = 'schedule' | 'staff' | 'tours' | 'analytics' | 'ai';

const MainLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('schedule');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [staff, setStaff] = useState<Staff[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [notificationsCount, setNotificationsCount] = useState(0);

  const handleNotificationsClick = () => {
    // TODO: Implement notifications panel
    console.log('Notifications clicked');
  };

  const handleSettingsClick = () => {
    // TODO: Implement settings panel
    console.log('Settings clicked');
  };

  const renderView = () => {
    switch (currentView) {
      case 'schedule':
        return typeof ScheduleView === 'function' ? (
          <ErrorBoundary>
            <ScheduleView
              date={currentDate}
              onDateChange={setCurrentDate}
              staff={staff}
            />
          </ErrorBoundary>
        ) : <div>Schedule view is not available</div>;
      
      case 'staff':
        return typeof StaffView === 'function' ? (
          <ErrorBoundary>
            <StaffView
              staff={staff}
              onStaffChange={setStaff}
            />
          </ErrorBoundary>
        ) : <div>Staff view is not available</div>;
      
      case 'tours':
        return typeof ToursView === 'function' ? (
          <ErrorBoundary>
            <ToursView
              onToursChange={setTours}
            />
          </ErrorBoundary>
        ) : <div>Tours view is not available</div>;
      
      case 'analytics':
        return typeof AnalyticsView === 'function' ? (
          <ErrorBoundary>
            <AnalyticsView />
          </ErrorBoundary>
        ) : <div>Analytics view is not available</div>;
      
      case 'ai':
        return typeof AIView === 'function' ? (
          <ErrorBoundary>
            <AIView />
          </ErrorBoundary>
        ) : <div>AI view is not available</div>;
      
      default:
        return <div>View not found</div>;
    }
  };

  const renderHeader = () => {
    if (typeof Header === 'function') {
      return (
        <ErrorBoundary>
          <Header
            user={{
              name: 'John Doe',
              email: 'john@example.com'
            }}
            notificationsCount={notificationsCount}
            onNotificationsClick={handleNotificationsClick}
            onSettingsClick={handleSettingsClick}
          />
        </ErrorBoundary>
      );
    }
    return (
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">VaktAI</h1>
        </div>
      </header>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {renderHeader()}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="flex space-x-4">
            <button
              onClick={() => setCurrentView('schedule')}
              className={`px-4 py-2 rounded-md ${
                currentView === 'schedule'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Schedule
            </button>
            <button
              onClick={() => setCurrentView('staff')}
              className={`px-4 py-2 rounded-md ${
                currentView === 'staff'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Staff
            </button>
            <button
              onClick={() => setCurrentView('tours')}
              className={`px-4 py-2 rounded-md ${
                currentView === 'tours'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Tours
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`px-4 py-2 rounded-md ${
                currentView === 'analytics'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setCurrentView('ai')}
              className={`px-4 py-2 rounded-md ${
                currentView === 'ai'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              AI Assistant
            </button>
          </nav>
        </div>
        {renderView()}
      </main>
    </div>
  );
};

export default MainLayout; 