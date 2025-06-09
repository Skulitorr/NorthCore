export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  availability: {
    [key: string]: boolean; // key is day of week
  };
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  maxParticipants: number;
  price: number;
  schedule: {
    startTime: string;
    endTime: string;
    days: string[];
  };
}

export interface Shift {
  id: number;
  staffId: number;
  day: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface SickCall {
  id: number;
  staffId: number;
  date: string;
  reason: string;
  submitted: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Suggestion {
  id: number;
  sickCallId: number;
  originalStaffId: number;
  suggestedStaffId: number;
  shiftId: number;
  date: string;
  reason: string;
}

export interface AppContextType {
  staff: Staff[];
  shifts: Shift[];
  sickCalls: SickCall[];
  suggestions: Suggestion[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  addSickCall: (sickCall: Omit<SickCall, 'id' | 'submitted' | 'status'>) => Promise<void>;
  acceptSuggestion: (suggestionId: number) => Promise<void>;
  rejectSuggestion: (suggestionId: number) => Promise<void>;
}