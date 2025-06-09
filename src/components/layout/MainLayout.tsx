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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleError = (component: string, error: string) => {
    setErrors(prev => ({ ...prev, [component]: error }));
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <Header 
            user={null}
            notificationsCount={0}
            onNotificationsClick={() => {}}
            onSettingsClick={() => {}}
          />

          <div className="mt-8">
            {currentView === 'schedule' && (
              <ScheduleView 
                date={currentDate}
                onDateChange={setCurrentDate}
                staff={staff}
              />
            )}
            {currentView === 'staff' && (
              <StaffView 
                staff={staff}
                onStaffChange={setStaff}
              />
            )}
            {currentView === 'tours' && (
              <ToursView 
                onToursChange={setTours}
              />
            )}
            {currentView === 'analytics' && (
              <AnalyticsView />
            )}
            {currentView === 'ai' && (
              <AIView />
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout; 