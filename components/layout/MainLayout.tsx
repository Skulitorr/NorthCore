import React, { useState, useEffect } from 'react';
import Header from './Header';
import ScheduleView from '../views/ScheduleView';
import StaffView from '../views/StaffView';
import ToursView from '../views/ToursView';
import AnalyticsView from '../views/AnalyticsView';
import AIView from '../views/AIView';
import { Staff, Tour, Shift, Toast, Weather, AnalyticsData } from '../../types';
import { apiCall, API_CONFIG } from '../../lib/api';
import ErrorBoundary from '../common/ErrorBoundary';
import ToastComponent from '../common/Toast';

const MainLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<'schedule' | 'staff' | 'tours' | 'analytics' | 'ai'>('schedule');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [staff, setStaff] = useState<Staff[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchWeather();
    checkAPIConnectivity();
    fetchAnalytics();
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await apiCall(API_CONFIG.WEATHER_ENDPOINT);
      if (response.success) {
        setWeather(response.data);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const checkAPIConnectivity = async () => {
    try {
      const response = await apiCall(API_CONFIG.SYSTEM_UPDATE_ENDPOINT);
      if (!response.success) {
        showToast('Villa í tengingu við API', 'error');
      }
    } catch (error) {
      console.error('API Connectivity Error:', error);
      showToast('Villa í tengingu við API', 'error');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await apiCall(API_CONFIG.ANALYTICS_ENDPOINT);
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info', actions: any[] = []) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, actions }]);
    if (type !== 'error') {
      setTimeout(() => removeToast(id), 4000);
    }
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleError = (component: string, error: string) => {
    setErrors(prev => ({ ...prev, [component]: error }));
    showToast(error, 'error');
  };

  const handleAddStaff = (newStaff: Staff) => {
    setStaff(prev => [...prev, newStaff]);
    showToast('Starfsmaður bætt við', 'success');
  };

  const handleReportSick = async (staffMember: Staff) => {
    try {
      const response = await apiCall(API_CONFIG.SICK_CALL_ENDPOINT, { staffId: staffMember.id });
      if (response.success) {
        showToast('Veikindi skráð', 'success');
      }
    } catch (error) {
      console.error('Error reporting sick:', error);
      showToast('Villa við að skrá veikindi', 'error');
    }
  };

  const handleAddTour = (newTour: Tour) => {
    setTours(prev => [...prev, newTour]);
    showToast('Ferð bætt við', 'success');
  };

  const handleAddShift = (shiftData: Shift) => {
    setShifts(prev => [...prev, shiftData]);
    showToast('Vakt bætt við', 'success');
  };

  const handleEditShift = (shiftData: Shift) => {
    setShifts(prev => prev.map(shift => shift.id === shiftData.id ? shiftData : shift));
    showToast('Vakt uppfærð', 'success');
  };

  const handleDeleteShift = (shift: Shift) => {
    setShifts(prev => prev.filter(s => s.id !== shift.id));
    showToast('Vakt eytt', 'success');
  };

  const handleSubmitSchedule = () => {
    showToast('Vaktaplan vistaður', 'success');
  };

  const handleAIOptimize = async () => {
    try {
      setLoading(true);
      const response = await apiCall(API_CONFIG.AI_SCHEDULE_ENDPOINT);
      if (response.success) {
        showToast('Vaktaplan bætt', 'success');
      }
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      showToast('Villa við að bæta vaktaplan', 'error');
    } finally {
      setLoading(false);
    }
  };

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
          {toasts.map(toast => (
            <ToastComponent
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
              actions={toast.actions}
            />
          ))}

          {currentView === 'schedule' && (
            <ScheduleView
              date={currentDate}
              onDateChange={setCurrentDate}
              staff={staff}
              shifts={shifts}
              onAddShift={handleAddShift}
              onEditShift={handleEditShift}
              onDeleteShift={handleDeleteShift}
              onSubmitSchedule={handleSubmitSchedule}
              onFindReplacement={handleReportSick}
            />
          )}

          {currentView === 'staff' && (
            <StaffView
              staff={staff}
              onStaffChange={setStaff}
              onAddStaff={handleAddStaff}
              onReportSick={handleReportSick}
            />
          )}

          {currentView === 'tours' && (
            <ToursView
              tours={tours}
              onToursChange={setTours}
              onAddTour={handleAddTour}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView
              analytics={analytics}
              weather={weather}
            />
          )}

          {currentView === 'ai' && (
            <AIView
              onOptimize={handleAIOptimize}
              loading={loading}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout; 