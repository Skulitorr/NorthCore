import React, { useState, useEffect } from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import Toast from '../components/common/Toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SettingsModal from '../components/modals/SettingsModal';
import NotificationsModal from '../components/modals/NotificationsModal';
import AddStaffModal from '../components/modals/AddStaffModal';
import AddTourModal from '../components/modals/AddTourModal';
import StaffDetailsModal from '../components/modals/StaffDetailsModal';
import ShiftModal from '../components/modals/ShiftModal';
import ReplacementModal from '../components/modals/ReplacementModal';
import ScheduleView from '../components/views/ScheduleView';
import StaffView from '../components/views/StaffView';
import ToursView from '../components/views/ToursView';
import AnalyticsView from '../components/views/AnalyticsView';
import AIView from '../components/views/AIView';
import { useApi } from '../hooks/useApi';
import { Staff, Tour, Shift, Schedule, Toast as ToastType, NotificationItem, UserProfile, AnalyticsData, Weather } from '../types';
import Icons from '../components/common/Icons';

interface LoadingState {
  isLoading: boolean;
  message: string;
  progress: number;
}

const VaktAI: React.FC = () => {
  // View state
  const [currentView, setCurrentView] = useState<'schedule' | 'staff' | 'tours' | 'analytics' | 'ai'>('schedule');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedWeek, setSelectedWeek] = useState<number>(getCurrentWeekNumber());
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Data state
  const [staff, setStaff] = useState<Staff[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalBookings: 0,
    totalShifts: 0,
    staffSatisfaction: 0,
    averageHoursPerStaff: 0,
    bookingGrowth: 0,
    efficiency: 0,
    coverage: 0,
    costs: 0,
    tourPopularity: [],
    staffWorkload: [],
    staffDistribution: {},
    bookingTrends: [],
    recommendations: []
  });
  const [weather, setWeather] = useState<Weather | null>(null);
  
  // UI state
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: '',
    progress: 0
  });
  
  // Modals state
  const [modals, setModals] = useState({
    settings: false,
    notifications: false,
    addStaff: false,
    addTour: false,
    staffDetails: null as Staff | null,
    editShift: null as Shift | null,
    sickCall: null as Staff | null,
    replacement: null as Staff | null,
    addShift: null as { staff: Staff; day: string } | null
  });
  
  // Use API hook
  const { 
    fetchStaff, 
    fetchTours, 
    fetchSchedule, 
    fetchNotifications,
    fetchUserProfile,
    fetchAnalytics,
    updateStaff,
    updateShift,
    deleteShift,
    loading,
    error
  } = useApi();
  
  // Load initial data
  useEffect(() => {
    loadData();
  }, []);
  
  // Count unread notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const unreadCount = notifications.filter(n => !n.read).length;
      setUnreadNotificationsCount(unreadCount);
    }
  }, [notifications]);
  
  function getCurrentWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return Math.ceil(day / 7);
  }
  
  const loadData = async () => {
    setLoadingState({
      isLoading: true,
      message: 'Hleð gögnum...',
      progress: 30
    });
    
    try {
      // Load all necessary data in parallel
      const [staffData, toursData, scheduleData, notificationsData, profileData, analyticsData] = await Promise.all([
        fetchStaff(),
        fetchTours(),
        fetchSchedule(currentDate),
        fetchNotifications(),
        fetchUserProfile(),
        fetchAnalytics(new Date(new Date().setDate(new Date().getDate() - 30)), new Date())
      ]);
      
      setStaff(staffData);
      setTours(toursData);
      setSchedule(scheduleData);
      setShifts(scheduleData?.shifts || []);
      setNotifications(notificationsData);
      setUserProfile(profileData);
      setAnalytics(analyticsData);
      
      // Show welcome toast
      addToast({
        id: 'welcome',
        message: 'Velkomin í VaktAI vaktakerfið',
        type: 'info',
        duration: 5000
      });
    } catch (err) {
      console.error('Error loading initial data:', err);
      addToast({
        id: 'error',
        message: 'Villa við að sækja gögn. Reyndu aftur.',
        type: 'error',
        duration: 10000
      });
    } finally {
      setLoadingState({
        isLoading: false,
        message: '',
        progress: 100
      });
    }
  };
  
  const refreshSchedule = async () => {
    try {
      const scheduleData = await fetchSchedule(currentDate);
      setSchedule(scheduleData);
      setShifts(scheduleData?.shifts || []);
    } catch (err) {
      console.error('Error refreshing schedule:', err);
      addToast({
        id: 'error',
        message: 'Villa við að uppfæra vaktaplan. Reyndu aftur.',
        type: 'error',
        duration: 5000
      });
    }
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    refreshSchedule();
  };
  
  const addToast = (toast: ToastType) => {
    const newToast = { ...toast, id: toast.id || `toast-${Date.now()}` };
    setToasts(prevToasts => [...prevToasts, newToast]);
    
    // Auto-remove toast after duration
    if (toast.duration) {
      setTimeout(() => {
        removeToast(newToast.id);
      }, toast.duration);
    }
  };
  
  const removeToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };
  
  const handleStaffChange = (updatedStaff: Staff[]) => {
    setStaff(updatedStaff);
  };
  
  const handleToursChange = (updatedTours: Tour[]) => {
    setTours(updatedTours);
  };
  
  const handleAddStaff = (newStaff: Staff) => {
    setStaff(prev => [...prev, newStaff]);
    addToast({
      id: `staff-add-${Date.now()}`,
      message: `${newStaff.name} hefur verið bætt við!`,
      type: 'success',
      duration: 3000
    });
  };
  
  const handleAddTour = (newTour: Tour) => {
    setTours(prev => [...prev, newTour]);
    addToast({
      id: `tour-add-${Date.now()}`,
      message: `Ferð "${newTour.name}" hefur verið bætt við!`,
      type: 'success',
      duration: 3000
    });
  };
  
  const handleReportSick = async (staffMember: Staff) => {
    setLoadingState({
      isLoading: true,
      message: 'Tilkynnir veikindi...',
      progress: 50
    });
    
    try {
      // Update staff member to be marked as sick
      const updatedStaff = { ...staffMember, sick: true };
      await updateStaff(updatedStaff);
      
      // Update staff list
      setStaff(prev => prev.map(s => 
        s.id === staffMember.id ? { ...s, sick: true } : s
      ));
      
      // Show replacement modal
      setModals(prev => ({ ...prev, replacement: updatedStaff }));
      
      addToast({
        id: `sick-${Date.now()}`,
        message: `Veikindi ${staffMember.name} hafa verið skráð`,
        type: 'warning',
        duration: 5000,
        actions: [
          { 
            label: 'Finna staðgengil', 
            onClick: () => setModals(prev => ({ ...prev, replacement: staffMember })) 
          }
        ]
      });
    } catch (err) {
      addToast({
        id: `error-${Date.now()}`,
        message: 'Villa við að tilkynna veikindi',
        type: 'error',
        duration: 5000
      });
    } finally {
      setLoadingState({ isLoading: false, message: '', progress: 0 });
    }
  };
  
  const handleAddShift = (newShift: Shift) => {
    setShifts(prev => [...prev, newShift]);
    addToast({
      id: `shift-add-${Date.now()}`,
      message: 'Vakt hefur verið bætt við',
      type: 'success',
      duration: 3000
    });
  };
  
  const handleEditShift = (updatedShift: Shift) => {
    setShifts(prev => prev.map(s => s.id === updatedShift.id ? updatedShift : s));
    addToast({
      id: `shift-update-${Date.now()}`,
      message: 'Vakt hefur verið uppfærð',
      type: 'success',
      duration: 3000
    });
  };
  
  const handleDeleteShift = (shift: Shift) => {
    setShifts(prev => prev.filter(s => s.id !== shift.id));
    addToast({
      id: `shift-delete-${Date.now()}`,
      message: 'Vakt hefur verið eytt',
      type: 'info',
      duration: 3000
    });
  };
  
  const handleNextWeek = () => {
    setSelectedWeek(prev => prev + 1);
    addToast({
      id: `week-next-${Date.now()}`,
      message: `Færði í viku ${selectedWeek + 1}`,
      type: 'info',
      duration: 2000
    });
  };
  
  const handlePreviousWeek = () => {
    setSelectedWeek(prev => Math.max(prev - 1, 1));
    addToast({
      id: `week-prev-${Date.now()}`,
      message: `Færði í viku ${Math.max(selectedWeek - 1, 1)}`,
      type: 'info',
      duration: 2000
    });
  };
  
  const handleSubmitSchedule = () => {
    addToast({
      id: `schedule-submit-${Date.now()}`,
      message: 'Vaktaplan hefur verið staðfest og sent á starfsfólk',
      type: 'success',
      duration: 5000
    });
  };
  
  const handleAIOptimize = async () => {
    setLoadingState({
      isLoading: true,
      message: 'AI er að búa til bestu vaktaáætlun...',
      progress: 0
    });
    
    const progressInterval = setInterval(() => {
      setLoadingState(prev => ({
        ...prev,
        progress: Math.min(prev.progress + 10, 90)
      }));
    }, 300);
    
    try {
      // Here we would call the AI optimization API
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        clearInterval(progressInterval);
        setLoadingState(prev => ({ ...prev, progress: 100 }));
        
        setTimeout(() => {
          addToast({
            id: `ai-optimize-${Date.now()}`,
            message: 'AI hefur bætt vaktaplanið! 12% skilvirkari',
            type: 'success',
            duration: 5000
          });
          setLoadingState({ isLoading: false, message: '', progress: 0 });
        }, 500);
      }, 3000);
    } catch (err) {
      clearInterval(progressInterval);
      addToast({
        id: `error-${Date.now()}`,
        message: 'Villa við að búa til AI vaktaplan',
        type: 'error',
        duration: 5000
      });
      setLoadingState({ isLoading: false, message: '', progress: 0 });
    }
  };
  
  const handleExport = async (format: string) => {
    setLoadingState({
      isLoading: true,
      message: `Útflytjir í ${format.toUpperCase()} sniði...`,
      progress: 50
    });
    
    try {
      // Here we would call the export API
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        addToast({
          id: `export-${Date.now()}`,
          message: `Vaktaplan hefur verið flutt út sem ${format.toUpperCase()}`,
          type: 'success',
          duration: 3000
        });
        setLoadingState({ isLoading: false, message: '', progress: 0 });
      }, 1000);
    } catch (err) {
      addToast({
        id: `error-${Date.now()}`,
        message: 'Villa við útflutning',
        type: 'error',
        duration: 5000
      });
      setLoadingState({ isLoading: false, message: '', progress: 0 });
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const stats = {
    totalStaff: staff.length,
    activeStaff: staff.filter(s => !s.sick).length,
    sickStaff: staff.filter(s => s.sick).length,
    totalShifts: shifts.length
  };
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* <Header 
          currentView={currentView}
          onViewChange={setCurrentView}
          onSearch={setSearchQuery}
          onSettingsClick={() => setModals(prev => ({ ...prev, settings: true }))}
          onNotificationsClick={() => setModals(prev => ({ ...prev, notifications: true }))}
          unreadNotificationsCount={unreadNotificationsCount}
          userProfile={userProfile}
        /> */}

        <div className="bg-white shadow-md sticky top-0 z-40 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Icons.Map className="h-8 w-8 text-indigo-600" />
                </div>
                <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <button
                    onClick={() => setCurrentView('schedule')}
                    className={`${
                      currentView === 'schedule'
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    <Icons.Calendar className="h-5 w-5 mr-2" />
                    Vaktir
                  </button>
                  <button
                    onClick={() => setCurrentView('staff')}
                    className={`${
                      currentView === 'staff'
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    <Icons.User className="h-5 w-5 mr-2" />
                    Starfsmenn
                  </button>
                  <button
                    onClick={() => setCurrentView('tours')}
                    className={`${
                      currentView === 'tours'
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    <Icons.Map className="h-5 w-5 mr-2" />
                    Ferðir
                  </button>
                  <button
                    onClick={() => setCurrentView('analytics')}
                    className={`${
                      currentView === 'analytics'
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    <Icons.Chart className="h-5 w-5 mr-2" />
                    Greining
                  </button>
                  <button
                    onClick={() => setCurrentView('ai')}
                    className={`${
                      currentView === 'ai'
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    <Icons.Brain className="h-5 w-5 mr-2" />
                    AI
                  </button>
                </nav>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setModals(prev => ({ ...prev, notifications: true }))}
                    className="relative p-2 text-gray-600 hover:text-gray-900"
                  >
                    <Icons.Bell className="h-6 w-6" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setModals(prev => ({ ...prev, settings: true }))}
                    className="p-2 text-gray-600 hover:text-gray-900"
                  >
                    <Icons.Settings className="h-6 w-6" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setModals(prev => ({ ...prev, profile: true }))}
                      className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900"
                    >
                      <Icons.User className="h-6 w-6" />
                      <span className="text-sm font-medium">{userProfile?.name || 'Notandi'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 no-print">
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Starfsfólk alls</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalStaff}</p>
                  <p className="text-xs text-green-600 mt-1">+2 frá síðustu viku</p>
                </div>
                <div className="p-4 bg-blue-100 rounded-full">
                  <Icons.User className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Virkir í dag</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeStaff}</p>
                  <p className="text-xs text-gray-600 mt-1">{((stats.activeStaff / stats.totalStaff) * 100 || 0).toFixed(0)}% mætt</p>
                </div>
                <div className="p-4 bg-green-100 rounded-full">
                  <Icons.Check className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Veikindi</p>
                  <p className="text-3xl font-bold text-red-600">{stats.sickStaff}</p>
                  <p className="text-xs text-orange-600 mt-1">⚠️ Þarf staðgengla</p>
                </div>
                <div className="p-4 bg-red-100 rounded-full">
                  <Icons.Alert className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Skilvirkni</p>
                  <p className="text-3xl font-bold text-purple-600">{analytics.efficiency}%</p>
                  <p className="text-xs text-purple-600 mt-1">↑ {analytics.efficiency - 90}% bæting</p>
                </div>
                <div className="p-4 bg-purple-100 rounded-full">
                  <Icons.Star className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* {currentView === 'schedule' && (
            <ScheduleView 
              date={currentDate}
              onDateChange={handleDateChange}
              staff={staff}
            />
          )} */}

          {/* {currentView === 'staff' && (
            <StaffView 
              staff={staff}
              onStaffChange={handleStaffChange}
              onAddStaff={() => setModals(prev => ({ ...prev, addStaff: true }))}
              onStaffClick={(staff) => setModals(prev => ({ ...prev, staffDetails: staff }))}
              onReportSick={(staff) => setModals(prev => ({ ...prev, sickCall: staff }))}
            />
          )} */}

          {/* {currentView === 'tours' && (
            <ToursView 
              tours={tours}
              onToursChange={handleToursChange}
              onAddTour={() => setModals(prev => ({ ...prev, addTour: true }))}
            />
          )} */}

          {/* {currentView === 'analytics' && (
            <AnalyticsView 
              data={analytics}
              staff={staff}
              tours={tours}
            />
          )} */}

          {/* {currentView === 'ai' && (
            <AIView 
              staffCount={staff.length}
              tourCount={tours.length}
            />
          )} */}
        </main>

        {/* <Footer /> */}

        {/* Modals */}
        {/* {modals.settings && (
          <SettingsModal 
            isOpen={modals.settings}
            onClose={() => setModals(prev => ({ ...prev, settings: false }))}
            userProfile={userProfile}
            onProfileUpdate={setUserProfile}
          />
        )} */}

        {/* {modals.notifications && (
          <NotificationsModal 
            isOpen={modals.notifications}
            onClose={() => setModals(prev => ({ ...prev, notifications: false }))}
            notifications={notifications}
            onNotificationRead={(id) => {
              setNotifications(prev => prev.map(n => 
                n.id === id ? { ...n, read: true } : n
              ));
            }}
          />
        )} */}

        {/* {modals.addStaff && (
          <AddStaffModal 
            isOpen={modals.addStaff}
            onClose={() => setModals(prev => ({ ...prev, addStaff: false }))}
            onAdd={handleAddStaff}
          />
        )} */}

        {/* {modals.addTour && (
          <AddTourModal 
            isOpen={modals.addTour}
            onClose={() => setModals(prev => ({ ...prev, addTour: false }))}
            onAdd={handleAddTour}
          />
        )} */}

        {/* {modals.staffDetails && (
          <StaffDetailsModal 
            isOpen={!!modals.staffDetails}
            staff={modals.staffDetails}
            onClose={() => setModals(prev => ({ ...prev, staffDetails: null }))}
            onUpdate={handleStaffChange}
          />
        )} */}

        {/* {modals.editShift && (
          <ShiftModal 
            isOpen={!!modals.editShift}
            shift={modals.editShift}
            staff={staff}
            onClose={() => setModals(prev => ({ ...prev, editShift: null }))}
            onSave={handleEditShift}
            onDelete={handleDeleteShift}
          />
        )} */}

        {/* {modals.sickCall && (
          <SickCallModal 
            isOpen={!!modals.sickCall}
            staff={modals.sickCall}
            onClose={() => setModals(prev => ({ ...prev, sickCall: null }))}
            onConfirm={handleReportSick}
          />
        )} */}

        {/* {modals.replacement && (
          <ReplacementModal 
            isOpen={!!modals.replacement}
            staff={modals.replacement}
            onClose={() => setModals(prev => ({ ...prev, replacement: null }))}
            onConfirm={handleFindReplacement}
          />
        )} */}

        {/* {modals.addShift && (
          <ShiftModal 
            isOpen={!!modals.addShift}
            staff={modals.addShift.staff}
            day={modals.addShift.day}
            onClose={() => setModals(prev => ({ ...prev, addShift: null }))}
            onSave={handleAddShift}
          />
        )} */}

        {/* Toasts */}
        <div className="toast-container">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
              autoClose={!!toast.duration}
              duration={toast.duration}
            />
          ))}
        </div>

        {/* Loading Spinner */}
        {loadingState.isLoading && (
          <LoadingSpinner 
            message={loadingState.message}
            progress={loadingState.progress}
          />
        )}
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutDown {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }
        
        .animate-slideOutDown {
          animation: slideOutDown 0.5s ease-out;
        }
        
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </ErrorBoundary>
  );
};

export default VaktAI;
