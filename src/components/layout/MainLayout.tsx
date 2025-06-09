import React, { useState } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
import Header from '../common/Header';
import ScheduleView from '../views/ScheduleView';
import StaffView from '../views/StaffView';
import ToursView from '../views/ToursView';
import AnalyticsView from '../views/AnalyticsView';
import AIView from '../views/AIView';
import { Staff, Tour } from '../../types';

const MainLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<'schedule' | 'staff' | 'tours' | 'analytics' | 'ai'>('schedule');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [staff, setStaff] = useState<Staff[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);

  const renderView = () => {
    switch (currentView) {
      case 'schedule':
        return ScheduleView ? (
          <ErrorBoundary>
            <ScheduleView 
              date={currentDate}
              onDateChange={setCurrentDate}
              staff={staff}
            />
          </ErrorBoundary>
        ) : <div>Schedule view is not available</div>;
      
      case 'staff':
        return StaffView ? (
          <ErrorBoundary>
            <StaffView 
              staff={staff}
              onStaffChange={setStaff}
            />
          </ErrorBoundary>
        ) : <div>Staff view is not available</div>;
      
      case 'tours':
        return ToursView ? (
          <ErrorBoundary>
            <ToursView 
              onToursChange={setTours}
            />
          </ErrorBoundary>
        ) : <div>Tours view is not available</div>;
      
      case 'analytics':
        return AnalyticsView ? (
          <ErrorBoundary>
            <AnalyticsView />
          </ErrorBoundary>
        ) : <div>Analytics view is not available</div>;
      
      case 'ai':
        return AIView ? (
          <ErrorBoundary>
            <AIView />
          </ErrorBoundary>
        ) : <div>AI view is not available</div>;
      
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ErrorBoundary>
        <Header 
          user={null}
          notificationsCount={0}
          onNotificationsClick={() => {}}
          onSettingsClick={() => {}}
        />
      </ErrorBoundary>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="flex space-x-4">
            {['schedule', 'staff', 'tours', 'analytics', 'ai'].map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view as any)}
                className={`px-4 py-2 rounded-md ${
                  currentView === view
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <ErrorBoundary>
          {renderView()}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default MainLayout; 