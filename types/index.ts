export interface Staff {
  id: string;
  name: string;
  fullName?: string;
  role: string;
  department: string;
  sick: boolean;
  lead: boolean;
  email: string;
  phone?: string;
  skills?: string[];
  workType?: string;
  startDate?: string;
  avatar?: string;
  avatarUrl?: string;
  hoursWorked?: number;
  shiftPreference?: string;
  daysOff?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: {
    morningShifts: boolean;
    eveningShifts: boolean;
    nightShifts: boolean;
    weekends: boolean;
  };
  certifications?: string[];
  notes?: string;
  status?: 'active' | 'on_leave' | 'sick' | 'training';
  lastUpdated?: string;
}

export interface Tour {
  id: string;
  name: string;
  type: string;
  description: string;
  location: string;
  durationMinutes: number;
  frequency: string;
  capacity: number;
  minStaffRequired: number;
  price?: number;
  tags?: string[];
  requirements?: string[];
  difficulty?: string;
  included?: string[];
  meetingPoint?: string;
  active?: boolean;
  season?: string;
  imageUrl?: string;
}

export interface Shift {
  id: string;
  staffId: string;
  staffName?: string;
  startTime: string;
  endTime: string;
  tourId?: string;
  tourName?: string;
  role?: string;
  type: 'regular' | 'overtime' | 'training' | 'meeting' | 'morning' | 'evening' | 'night';
  status: 'scheduled' | 'completed' | 'cancelled' | 'sick';
  notes?: string;
  location?: string;
  requiredSkills?: string[];
  priority?: 'low' | 'medium' | 'high' | 'normal';
  department?: string;
  createdAt: string;
  lastModified?: string;
  updatedAt?: string;
}

export interface Schedule {
  id: string;
  startDate: string;
  endDate: string;
  shifts: Shift[];
  status: 'draft' | 'published' | 'archived';
  createdBy?: string;
  lastModified?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  duration?: number;
  dismissible?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

export interface LoadingState {
  isLoading: boolean;
  message: string;
  progress: number;
}

export interface Weather {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    temp: number;
    icon: string;
  }>;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  details?: string;
  priority?: 'low' | 'medium' | 'high';
  type: 'schedule' | 'staff' | 'tour' | 'general';
  actions?: Array<{
    label: string;
    action: string;
    params?: any;
  }>;
  timestamp: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

export interface StaffWorkload {
  staffId: string;
  name: string;
  role: string;
  hoursWorked: number;
  shiftsCount: number;
  efficiency: number;
}

export interface AnalyticsData {
  totalBookings: number;
  totalShifts: number;
  staffSatisfaction: number;
  averageHoursPerStaff: number;
  bookingGrowth: number;
  efficiency: number;
  coverage: number;
  costs: number;
  tourPopularity: Array<{
    tourId: string;
    tourName: string;
    bookingCount: number;
  }>;
  staffWorkload: StaffWorkload[];
  staffDistribution: Record<string, number>;
  bookingTrends: Array<{
    date: string;
    bookingCount: number;
  }>;
  recommendations: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }>;
}
