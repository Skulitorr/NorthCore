import React, { useState } from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import Header from '../components/layout/Header';
import ScheduleView from '../components/views/ScheduleView';
import StaffView from '../components/views/StaffView';
import ToursView from '../components/views/ToursView';
import AnalyticsView from '../components/views/AnalyticsView';
import AIView from '../components/views/AIView';
import Icons from '../components/common/Icons';
import { Staff, Tour } from '../types';

const VaktAI: React.FC = () => {
  const [currentView, setCurrentView] = useState<'schedule' | 'staff' | 'tours' | 'analytics' | 'ai'>('schedule');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [staff, setStaff] = useState<Staff[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header 
          user={null}
          notificationsCount={0}
          onNotificationsClick={() => {}}
          onSettingsClick={() => {}}
        />

        <div className="container mx-auto px-4 py-8">
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
    </ErrorBoundary>
  );
};

export default VaktAI;
