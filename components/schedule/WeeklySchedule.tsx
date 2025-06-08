import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { Schedule, Shift, Staff, Tour } from '../../types';
import { ClockIcon, UserIcon } from '../common/Icons';

interface WeeklyScheduleProps {
  schedule: Schedule;
  staff: Staff[];
  tours?: Tour[];
  onShiftClick?: (shift: Shift) => void;
  showDetails?: boolean;
  highlightStaffId?: string;
  className?: string;
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  schedule,
  staff,
  tours = [],
  onShiftClick,
  showDetails = true,
  highlightStaffId,
  className = '',
}) => {
  const [days, setDays] = useState<Date[]>([]);
  const [groupedShifts, setGroupedShifts] = useState<Record<string, Shift[]>>({});

  useEffect(() => {
    // Generate array of 7 days for the week
    const firstDate = schedule.startDate ? new Date(schedule.startDate) : new Date();
    const weekDays = Array(7).fill(0).map((_, index) => {
      const day = new Date(firstDate);
      day.setDate(firstDate.getDate() + index);
      return day;
    });
    setDays(weekDays);

    // Group shifts by day
    const shiftsByDay: Record<string, Shift[]> = {};
    weekDays.forEach(day => {
      const dayStr = day.toISOString().split('T')[0];
      shiftsByDay[dayStr] = [];
    });

    schedule.shifts.forEach(shift => {
      const shiftDate = new Date(shift.startTime);
      const dayStr = shiftDate.toISOString().split('T')[0];
      
      if (shiftsByDay[dayStr]) {
        shiftsByDay[dayStr].push(shift);
      }
    });

    // Sort shifts by start time within each day
    Object.keys(shiftsByDay).forEach(day => {
      shiftsByDay[day].sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    });

    setGroupedShifts(shiftsByDay);
  }, [schedule]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStaffName = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember ? staffMember.name : 'Unassigned';
  };

  const getTourName = (tourId: string) => {
    const tour = tours.find(t => t.id === tourId);
    return tour ? tour.name : 'General';
  };

  const isCurrentDay = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <div className={`weekly-schedule ${className}`}>
      <div className="schedule-grid">
        {days.map((day, index) => {
          const dayStr = day.toISOString().split('T')[0];
          const shiftsForDay = groupedShifts[dayStr] || [];
          
          return (
            <div 
              key={dayStr} 
              className={`day-column ${isCurrentDay(day) ? 'current-day' : ''}`}
            >
              <div className="day-header">
                {formatDate(day)}
              </div>
              <div className="day-shifts">
                {shiftsForDay.length > 0 ? (
                  shiftsForDay.map(shift => {
                    const isHighlighted = highlightStaffId && shift.staffId === highlightStaffId;
                    
                    return (
                      <div 
                        key={shift.id}
                        className={`shift-card ${shift.type} ${isHighlighted ? 'highlighted' : ''}`}
                        onClick={() => onShiftClick && onShiftClick(shift)}
                      >
                        <div className="shift-time">
                          <ClockIcon /> {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                        </div>
                        
                        {showDetails && (
                          <>
                            <div className="shift-staff">
                              <UserIcon /> {getStaffName(shift.staffId)}
                            </div>
                            {shift.tourId && (
                              <div className="shift-tour">
                                {getTourName(shift.tourId)}
                              </div>
                            )}
                          </>
                        )}
                        
                        {!showDetails && shift.staffId === highlightStaffId && (
                          <div className="shift-indicator">Your Shift</div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="no-shifts">No shifts</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklySchedule;
