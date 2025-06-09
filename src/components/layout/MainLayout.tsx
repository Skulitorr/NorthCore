import React, { useState, Suspense } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
import { Staff, Tour } from '../../types/index';
import Header from '../common/Header';
import ScheduleView from '../views/ScheduleView';
import StaffView from '../views/StaffView';
import ToursView from '../views/ToursView';
import AnalyticsView from '../views/AnalyticsView';
import AIView from '../views/AIView';

console.log('Header:', Header);
console.log('ScheduleView:', ScheduleView);
console.log('StaffView:', StaffView);
console.log('ToursView:', ToursView);
console.log('AnalyticsView:', AnalyticsView);
console.log('AIView:', AIView);

// Default fallback components
const FallbackComponent = ({ name }: { name: string }) => (
  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
    <p className="text-yellow-800">Component failed to load: {name}</p>
  </div>
);

const MainLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<'schedule' | 'staff' | 'tours' | 'analytics' | 'ai'>('schedule');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [staff, setStaff] = useState<Staff[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);

  const renderView = () => {
    switch (currentView) {
      case 'schedule':
        return (
          <ErrorBoundary>
            <Suspense fallback={<FallbackComponent name="ScheduleView" />}>
              <ScheduleView 
                date={currentDate}
                onDateChange={setCurrentDate}
                staff={staff}
              />
            </Suspense>
          </ErrorBoundary>
        );
      
      case 'staff':
        return (
          <ErrorBoundary>
            <Suspense fallback={<FallbackComponent name="StaffView" />}>
              <StaffView 
                staff={staff}
                onStaffChange={setStaff}
              />
            </Suspense>
          </ErrorBoundary>
        );
      
      case 'tours':
        return (
          <ErrorBoundary>
            <Suspense fallback={<FallbackComponent name="ToursView" />}>
              <ToursView 
                onToursChange={setTours}
              />
            </Suspense>
          </ErrorBoundary>
        );
      
      case 'analytics':
        return (
          <ErrorBoundary>
            <Suspense fallback={<FallbackComponent name="AnalyticsView" />}>
              <AnalyticsView />
            </Suspense>
          </ErrorBoundary>
        );
      
      case 'ai':
        return (
          <ErrorBoundary>
            <Suspense fallback={<FallbackComponent name="AIView" />}>
              <AIView />
            </Suspense>
          </ErrorBoundary>
        );
      
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ErrorBoundary>
        <Suspense fallback={<FallbackComponent name="Header" />}>
          <Header 
            user={null}
            notificationsCount={0}
            onNotificationsClick={() => {}}
            onSettingsClick={() => {}}
          />
        </Suspense>
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