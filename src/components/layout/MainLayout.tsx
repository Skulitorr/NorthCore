import React, { useState, useEffect } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
import { Staff, Tour } from '../../types';

// Default fallback components
const FallbackComponent = ({ name }: { name: string }) => (
  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
    <p className="text-yellow-800">Component failed to load: {name}</p>
  </div>
);

// Component interfaces
interface HeaderProps {
  user: any;
  notificationsCount: number;
  onNotificationsClick: () => void;
  onSettingsClick: () => void;
}

interface ScheduleViewProps {
  date: Date;
  onDateChange: (date: Date) => void;
  staff: Staff[];
}

interface StaffViewProps {
  staff: Staff[];
  onStaffChange: (staff: Staff[]) => void;
}

interface ToursViewProps {
  onToursChange: (tours: Tour[]) => void;
}

const MainLayout: React.FC = () => {
  // Component states
  const [Header, setHeader] = useState<React.ComponentType<HeaderProps> | null>(null);
  const [ScheduleView, setScheduleView] = useState<React.ComponentType<ScheduleViewProps> | null>(null);
  const [StaffView, setStaffView] = useState<React.ComponentType<StaffViewProps> | null>(null);
  const [ToursView, setToursView] = useState<React.ComponentType<ToursViewProps> | null>(null);
  const [AnalyticsView, setAnalyticsView] = useState<React.ComponentType | null>(null);
  const [AIView, setAIView] = useState<React.ComponentType | null>(null);

  const [currentView, setCurrentView] = useState<'schedule' | 'staff' | 'tours' | 'analytics' | 'ai'>('schedule');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [staff, setStaff] = useState<Staff[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);

  // Load components dynamically
  useEffect(() => {
    const loadComponents = async () => {
      try {
        const [
          HeaderModule,
          ScheduleViewModule,
          StaffViewModule,
          ToursViewModule,
          AnalyticsViewModule,
          AIViewModule
        ] = await Promise.all([
          import('../common/Header'),
          import('../views/ScheduleView'),
          import('../views/StaffView'),
          import('../views/ToursView'),
          import('../views/AnalyticsView'),
          import('../views/AIView')
        ]);

        setHeader(() => HeaderModule.default);
        setScheduleView(() => ScheduleViewModule.default);
        setStaffView(() => StaffViewModule.default);
        setToursView(() => ToursViewModule.default);
        setAnalyticsView(() => AnalyticsViewModule.default);
        setAIView(() => AIViewModule.default);
      } catch (err) {
        console.error('Failed to load components:', err);
      }
    };

    loadComponents();
  }, []);

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
        ) : <FallbackComponent name="ScheduleView" />;
      
      case 'staff':
        return StaffView ? (
          <ErrorBoundary>
            <StaffView 
              staff={staff}
              onStaffChange={setStaff}
            />
          </ErrorBoundary>
        ) : <FallbackComponent name="StaffView" />;
      
      case 'tours':
        return ToursView ? (
          <ErrorBoundary>
            <ToursView 
              onToursChange={setTours}
            />
          </ErrorBoundary>
        ) : <FallbackComponent name="ToursView" />;
      
      case 'analytics':
        return AnalyticsView ? (
          <ErrorBoundary>
            <AnalyticsView />
          </ErrorBoundary>
        ) : <FallbackComponent name="AnalyticsView" />;
      
      case 'ai':
        return AIView ? (
          <ErrorBoundary>
            <AIView />
          </ErrorBoundary>
        ) : <FallbackComponent name="AIView" />;
      
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ErrorBoundary>
        {Header ? (
          <Header 
            user={null}
            notificationsCount={0}
            onNotificationsClick={() => {}}
            onSettingsClick={() => {}}
          />
        ) : (
          <FallbackComponent name="Header" />
        )}
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