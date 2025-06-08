import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import { Schedule, Shift, Staff } from '../../types';
import ShiftModal from '../modals/ShiftModal';
import ReplacementModal from '../modals/ReplacementModal';
import Icons from '../common/Icons';

interface ScheduleViewProps {
  date: Date;
  onDateChange: (date: Date) => void;
  staff: Staff[];
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ date, onDateChange, staff }) => {
  const { fetchSchedule, updateShift, deleteShift } = useApi();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedShift, setSelectedShift] = useState<Shift | undefined>(undefined);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState<boolean>(false);
  const [showReplacementModal, setShowReplacementModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSchedule();
  }, [date]);
  const loadSchedule = async () => {
    setLoading(true);
    try {
      const scheduleData = await fetchSchedule(date);
      setSchedule(scheduleData);
      setError(null);
    } catch (err) {
      setError('Failed to load schedule. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 7);
    onDateChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 7);
    onDateChange(newDate);
  };

  const handleShiftClick = (shift: Shift) => {
    setSelectedShift(shift);
    setIsShiftModalOpen(true);
  };

  const handleFindReplacement = (shift: Shift) => {
    setSelectedShift(shift);
    setIsShiftModalOpen(false);
    setShowReplacementModal(true);
  };

  const handleShiftUpdate = async (updatedShift: Shift) => {
    try {
      await updateShift(updatedShift);
      loadSchedule();
      setIsShiftModalOpen(false);
    } catch (err) {
      setError('Failed to update shift. Please try again.');
      console.error(err);
    }
  };

  const handleShiftDelete = async (shiftId: string) => {
    try {
      await deleteShift(shiftId);
      loadSchedule();
      setIsShiftModalOpen(false);
    } catch (err) {
      setError('Failed to delete shift. Please try again.');
      console.error(err);
    }
  };

  const handleReplacementConfirm = async (shift: Shift, replacementStaff: Staff) => {
    try {
      const updatedShift: Shift = {
        ...shift,
        staffId: replacementStaff.id,
        staffName: replacementStaff.name,
        updatedAt: new Date().toISOString()
      };
      
      await updateShift(updatedShift);
      loadSchedule();
      setShowReplacementModal(false);
    } catch (err) {
      setError('Failed to assign replacement. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading schedule..." />;
  }

  const formatDateRange = () => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const startMonth = startOfWeek.toLocaleString('default', { month: 'short' });
    const endMonth = endOfWeek.toLocaleString('default', { month: 'short' });
    
    const formattedStart = `${startOfWeek.getDate()} ${startMonth}`;
    const formattedEnd = `${endOfWeek.getDate()} ${endMonth}`;
    
    return `${formattedStart} - ${formattedEnd}`;
  };

  return null; // Temporarily comment out the entire return to identify if this is the crashing component

  /* Original return statement:
  return (
    <div className="schedule-view">
      <div className="schedule-header">
        <h2><Icons.Calendar /> Schedule</h2>
        <div className="date-navigation">
          <button onClick={handlePreviousWeek} className="nav-button">
            &lt; Previous
          </button>
          <span className="current-date">{formatDateRange()}</span>
          <button onClick={handleNextWeek} className="nav-button">
            Next &gt;
          </button>
        </div>
        <div className="schedule-actions">
          <button className="action-button">
            <Icons.Edit /> Edit Schedule
          </button>
          <button className="action-button">
            <Icons.User /> Staff View
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <Icons.Alert /> {error}
        </div>
      )}

      <div className="schedule-content">
        {schedule && schedule.shifts.length > 0 ? (
          <div className="schedule-grid">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
              <div key={day} className="day-column">
                <div className="day-header">{day}</div>
                <div className="day-shifts">
                  {schedule.shifts
                    .filter((shift) => {
                      const shiftDate = new Date(shift.startTime);
                      return shiftDate.getDay() === index;
                    })
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .map((shift) => {
                      const staffMember = staff.find((s) => s.id === shift.staffId);
                      const startTime = new Date(shift.startTime);
                      const endTime = new Date(shift.endTime);
                      const formattedStart = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      const formattedEnd = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <div 
                          key={shift.id} 
                          className={`shift-card ${shift.type}`}
                          onClick={() => handleShiftClick(shift)}
                        >
                          <div className="shift-time">{formattedStart} - {formattedEnd}</div>
                          <div className="shift-staff">
                            <Icons.User /> {staffMember ? staffMember.name : 'Unassigned'}
                          </div>
                          <div className="shift-tour">{shift.tourName || 'General Shift'}</div>
                          <div className="shift-actions">
                            <button 
                              className="edit-button" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShiftClick(shift);
                              }}
                            >
                              <Icons.Edit />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-schedule">
            <p>No shifts scheduled for this week.</p>
            <button className="add-shift-button" onClick={() => {
              setSelectedShift(undefined);
              setIsShiftModalOpen(true);
            }}>
              Add New Shift
            </button>
          </div>
        )}
      </div>

      {isShiftModalOpen && (
        <ShiftModal
          isOpen={isShiftModalOpen}
          shift={selectedShift}
          staff={staff}
          onClose={() => setIsShiftModalOpen(false)}
          onSave={handleShiftUpdate}
          onDelete={selectedShift ? handleShiftDelete : undefined}
          onFindReplacement={selectedShift ? handleFindReplacement : undefined}
        />
      )}

      {showReplacementModal && selectedShift && (
        <ReplacementModal
          isOpen={showReplacementModal}
          shift={selectedShift}
          onClose={() => setShowReplacementModal(false)}
          onReplacementConfirmed={handleReplacementConfirm}
        />
      )}
    </div>
  );
  */
};

export default ScheduleView;
