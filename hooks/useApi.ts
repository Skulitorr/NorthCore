import { useState, useEffect } from 'react';
import { apiCall, API_CONFIG } from '../lib/api';
import { Staff, Tour, Shift, Schedule, AIRecommendation, AnalyticsData, NotificationItem, Weather, UserProfile } from '../types';

interface StaffResponse {
  staff: Staff[];
}

interface StaffUpdateResponse {
  staff: Staff;
}

interface TourResponse {
  tour: Tour;
}

interface ToursResponse {
  tours: Tour[];
}

interface ScheduleResponse {
  schedule: Schedule;
}

interface ShiftResponse {
  shift: Shift;
}

interface AnalyticsResponse {
  analytics: AnalyticsData;
}

interface WeatherResponse {
  weather: Weather;
}

interface NotificationsResponse {
  notifications: NotificationItem[];
}

interface AIRecommendationsResponse {
  schedule: {
    suggestions: Array<{
      staffId: number;
      from: string;
      to: string;
      day: string;
    }>;
  };
}

interface AIMessageResponse {
  response: string;
  suggestions?: string[];
}

interface UserProfileResponse {
  user: UserProfile;
}

export const useApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Staff-related API calls
  const fetchStaff = async (): Promise<Staff[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<StaffResponse>(API_CONFIG.STAFF_MANAGEMENT_ENDPOINT, {}, 'GET');
      return response.data?.staff || [];
    } catch (err) {
      setError('Failed to fetch staff data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStaff = async (staff: Staff): Promise<Staff> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<StaffUpdateResponse>(API_CONFIG.STAFF_MANAGEMENT_ENDPOINT, { staff }, 'POST');
      return response.data?.staff || staff;
    } catch (err) {
      setError('Failed to update staff data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteStaff = async (staffId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall(API_CONFIG.STAFF_MANAGEMENT_ENDPOINT, { staffId }, 'DELETE');
      return response.success;
    } catch (err) {
      setError('Failed to delete staff member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Tour-related API calls
  const fetchTours = async (): Promise<Tour[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<ToursResponse>(API_CONFIG.TOURS_ENDPOINT, {}, 'GET');
      return response.data?.tours || [];
    } catch (err) {
      setError('Failed to fetch tours data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTour = async (tour: Tour): Promise<Tour> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<TourResponse>(API_CONFIG.TOURS_ENDPOINT, { tour }, 'POST');
      return response.data?.tour || tour;
    } catch (err) {
      setError('Failed to update tour data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTour = async (tourId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall(API_CONFIG.TOURS_ENDPOINT, { tourId }, 'DELETE');
      return response.success;
    } catch (err) {
      setError('Failed to delete tour');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Schedule-related API calls
  const fetchSchedule = async (date: Date): Promise<Schedule> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<ScheduleResponse>(API_CONFIG.SHIFT_MANAGEMENT_ENDPOINT, { date: date.toISOString() }, 'GET');
      return response.data?.schedule || {
        id: '1',
        startDate: date.toISOString(),
        endDate: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        shifts: [],
        status: 'draft'
      };
    } catch (err) {
      setError('Failed to fetch schedule');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateShift = async (shift: Shift): Promise<Shift> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<ShiftResponse>(API_CONFIG.SHIFT_MANAGEMENT_ENDPOINT, { shift }, 'POST');
      return response.data?.shift || shift;
    } catch (err) {
      setError('Failed to update shift');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteShift = async (shiftId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall(API_CONFIG.SHIFT_MANAGEMENT_ENDPOINT, { shiftId }, 'DELETE');
      return response.success;
    } catch (err) {
      setError('Failed to delete shift');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Analytics-related API calls
  const fetchAnalytics = async (startDate: Date, endDate: Date): Promise<AnalyticsData> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<AnalyticsResponse>(API_CONFIG.ANALYTICS_ENDPOINT, { startDate, endDate }, 'GET');
      return response.data?.analytics || {
        totalBookings: 0,
        totalShifts: 0,
        staffSatisfaction: 0,
        averageHoursPerStaff: 0,
        bookingGrowth: 0,
        tourPopularity: [],
        staffWorkload: [],
        staffDistribution: {},
        bookingTrends: [],
        recommendations: []
      };
    } catch (err) {
      setError('Failed to fetch analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // AI-related API calls
  const fetchAIRecommendations = async (): Promise<AIRecommendation[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<AIRecommendationsResponse>(API_CONFIG.AI_SCHEDULE_ENDPOINT, {}, 'GET');
      const suggestions = response.data?.schedule?.suggestions || [];
      return suggestions.map((suggestion, index) => ({
        id: index.toString(),
        title: `Schedule Optimization: ${suggestion.staffId}`,
        description: `Move staff #${suggestion.staffId} from ${suggestion.from} shift to ${suggestion.to} on ${suggestion.day}`,
        type: 'schedule',
        priority: index < 2 ? 'high' : 'medium',
        timestamp: new Date().toISOString()
      }));
    } catch (err) {
      setError('Failed to fetch AI recommendations');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendAIMessage = async (message: string, contextData?: any): Promise<{message: string, recommendation?: string}> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<AIMessageResponse>(API_CONFIG.AI_CHAT_ENDPOINT, { message, contextData }, 'POST');
      return {
        message: response.data?.response || 'No response from AI',
        recommendation: response.data?.suggestions?.[0]
      };
    } catch (err) {
      setError('Failed to send message to AI');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Weather-related API calls
  const fetchWeather = async (): Promise<Weather> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<WeatherResponse>(API_CONFIG.WEATHER_ENDPOINT, {}, 'GET');
      return response.data?.weather || {
        temperature: 0,
        description: 'Unknown',
        icon: '❓',
        humidity: 0,
        windSpeed: 0,
        forecast: []
      };
    } catch (err) {
      setError('Failed to fetch weather');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Notification-related API calls
  const fetchNotifications = async (): Promise<NotificationItem[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<NotificationsResponse>(API_CONFIG.NOTIFICATIONS_ENDPOINT, {}, 'GET');
      return response.data?.notifications || [];
    } catch (err) {
      setError('Failed to fetch notifications');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall(API_CONFIG.NOTIFICATIONS_ENDPOINT, { notificationId }, 'POST');
      return response.success;
    } catch (err) {
      setError('Failed to mark notification as read');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // User-related API calls
  const fetchUserProfile = async (): Promise<UserProfile> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall<UserProfileResponse>(API_CONFIG.USER_PROFILE_ENDPOINT, {}, 'GET');
      return response.data?.user || {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'is'
        }
      };
    } catch (err) {
      setError('Failed to fetch user profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchStaff,
    updateStaff,
    deleteStaff,
    fetchTours,
    updateTour,
    deleteTour,
    fetchSchedule,
    updateShift,
    deleteShift,
    fetchAIRecommendations,
    sendAIMessage,
    fetchWeather,
    fetchNotifications,
    markNotificationAsRead,
    fetchUserProfile,
    fetchAnalytics
  };
};
