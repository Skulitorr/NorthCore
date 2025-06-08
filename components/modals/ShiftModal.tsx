import React, { useState, useEffect } from 'react';
import Icons from '../common/Icons';
import { Shift, Staff, Tour } from '../../types';
import { apiCall, API_CONFIG } from '../../lib/api';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  shift?: Shift;
  staffMember?: Staff;
  day?: string;
  staff: Staff[];
  onSave: (shift: Shift) => void;
  onDelete?: (shiftId: string) => void;
  onFindReplacement?: (shift: Shift) => void;
}

const ShiftModal: React.FC<ShiftModalProps> = ({ 
  isOpen, 
  onClose, 
  shift, 
  staffMember,
  day,
  staff,
  onSave,
  onDelete,
  onFindReplacement
}) => {
  const [loading, setLoading] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [newShift, setNewShift] = useState<Partial<Shift>>(shift || {
    id: '',
    staffId: '',
    staffName: '',
    tourId: '',
    tourName: '',
    role: '',
    startTime: '',
    endTime: '',
    type: 'regular',
    status: 'scheduled',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Fetch tours data when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTours();
    }
  }, [isOpen]);

  // When editing, populate form with shift data
  useEffect(() => {
    if (shift) {
      setNewShift({
        ...shift,
        startTime: new Date(shift.startTime).toISOString().split('T')[1].substring(0, 5),
        endTime: new Date(shift.endTime).toISOString().split('T')[1].substring(0, 5),
      });
    } else {
      setNewShift({
        id: '',
        staffId: '',
        staffName: '',
        tourId: '',
        tourName: '',
        role: '',
        startTime: '',
        endTime: '',
        type: 'regular',
        status: 'scheduled',
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [shift, isOpen]);

  // Filter staff based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = staff.filter(
        s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
             s.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStaff(filtered);
    } else {
      setFilteredStaff(staff);
    }
  }, [searchTerm, staff]);

  const fetchTours = async () => {
    try {
      const response = await apiCall(API_CONFIG.TOURS_ENDPOINT);
      setTours(response.data?.tours || []);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const shiftToSave: Shift = {
        ...newShift,
        id: newShift.id || Date.now().toString(),
        createdAt: newShift.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Shift;
      
      onSave(shiftToSave);
      onClose();
    } catch (error) {
      console.error('Failed to save shift:', error);
      setErrors({ submit: 'Failed to save shift' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!newShift.staffId) {
      newErrors.staff = 'Please select a staff member';
    }
    
    if (!newShift.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!newShift.endTime) {
      newErrors.endTime = 'End time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn no-print" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-2xl transform animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Icons.Clock className="w-7 h-7 mr-3 text-blue-600" />
            {shift ? 'Edit Shift' : 'Add Shift'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-all">
            <Icons.X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Staff Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Staff Member</label>
            <select
              value={newShift.staffId}
              onChange={(e) => {
                const selectedStaff = staff.find(s => s.id === e.target.value);
                setNewShift(prev => ({
                  ...prev,
                  staffId: e.target.value,
                  staffName: selectedStaff?.name || ''
                }));
              }}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={!!staffMember}
            >
              {!staffMember && <option value="">Select staff member</option>}
              {filteredStaff.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} - {s.role}
                </option>
              ))}
            </select>
            {errors.staff && <p className="mt-1 text-sm text-red-600">{errors.staff}</p>}
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={newShift.startTime}
                onChange={(e) => setNewShift(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={newShift.endTime}
                onChange={(e) => setNewShift(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>}
            </div>
          </div>

          {/* Tour Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tour</label>
            <select
              value={newShift.tourId}
              onChange={(e) => {
                const selectedTour = tours.find(t => t.id === e.target.value);
                setNewShift(prev => ({
                  ...prev,
                  tourId: e.target.value,
                  tourName: selectedTour?.name || ''
                }));
              }}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select tour</option>
              {tours.map(tour => (
                <option key={tour.id} value={tour.id}>
                  {tour.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={newShift.notes}
              onChange={(e) => setNewShift(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>

        <div className="p-4 border-t flex justify-end space-x-4 bg-gray-50">
          {onDelete && shift && (
            <button
              type="button"
              onClick={() => onDelete(shift.id)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
            >
              Delete
            </button>
          )}
          {onFindReplacement && shift && (
            <button
              type="button"
              onClick={() => onFindReplacement(shift)}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all font-medium"
            >
              Find Replacement
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {shift ? 'Save Changes' : 'Add Shift'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftModal;
