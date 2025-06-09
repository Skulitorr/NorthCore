import React, { useState } from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import Header from '../components/common/Header';
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleError = (component: string, error: string) => {
    setErrors(prev => ({ ...prev, [component]: error }));
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">🔥 Component Testing</h1>

          <div className="space-y-8">
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">🧪 Testing Header</h2>
              {errors.Header ? (
                <div className="text-red-500">❌ {errors.Header}</div>
              ) : typeof Header === 'function' ? (
                <Header 
                  user={null}
                  notificationsCount={0}
                  onNotificationsClick={() => {}}
                  onSettingsClick={() => {}}
                />
              ) : (
                <div className="text-red-500">❌ Header is undefined</div>
              )}
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">🧪 Testing ScheduleView</h2>
              {errors.ScheduleView ? (
                <div className="text-red-500">❌ {errors.ScheduleView}</div>
              ) : typeof ScheduleView === 'function' ? (
                <ScheduleView 
                  date={currentDate}
                  onDateChange={setCurrentDate}
                  staff={staff}
                />
              ) : (
                <div className="text-red-500">❌ ScheduleView is undefined</div>
              )}
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">🧪 Testing StaffView</h2>
              {errors.StaffView ? (
                <div className="text-red-500">❌ {errors.StaffView}</div>
              ) : typeof StaffView === 'function' ? (
                <StaffView 
                  staff={staff}
                  onStaffChange={setStaff}
                />
              ) : (
                <div className="text-red-500">❌ StaffView is undefined</div>
              )}
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">🧪 Testing ToursView</h2>
              {errors.ToursView ? (
                <div className="text-red-500">❌ {errors.ToursView}</div>
              ) : typeof ToursView === 'function' ? (
                <ToursView 
                  onToursChange={setTours}
                />
              ) : (
                <div className="text-red-500">❌ ToursView is undefined</div>
              )}
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">🧪 Testing AnalyticsView</h2>
              {errors.AnalyticsView ? (
                <div className="text-red-500">❌ {errors.AnalyticsView}</div>
              ) : typeof AnalyticsView === 'function' ? (
                <AnalyticsView />
              ) : (
                <div className="text-red-500">❌ AnalyticsView is undefined</div>
              )}
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">🧪 Testing AIView</h2>
              {errors.AIView ? (
                <div className="text-red-500">❌ {errors.AIView}</div>
              ) : typeof AIView === 'function' ? (
                <AIView />
              ) : (
                <div className="text-red-500">❌ AIView is undefined</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default VaktAI;
