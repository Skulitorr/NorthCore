import React, { useState, useEffect } from 'react';
import Icons from '../common/Icons';
import { Shift, Staff } from '../../types';
import { apiCall, API_CONFIG } from '../../lib/api';

interface ReplacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  shift: Shift;
  onReplacementConfirmed: (shift: Shift, replacementStaff: Staff) => void;
}

const ReplacementModal: React.FC<ReplacementModalProps> = ({
  isOpen,
  onClose,
  shift,
  onReplacementConfirmed
}) => {
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (isOpen) {
      fetchStaff();
    }
  }, [isOpen]);

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

  const fetchStaff = async () => {
    try {
      const response = await apiCall<{staff: Staff[]}>(API_CONFIG.STAFF_ENDPOINT);
      setStaff(response.data?.staff || []);
      setFilteredStaff(response.data?.staff || []);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      setErrors({ fetch: 'Failed to fetch staff data' });
    }
  };

  const handleConfirm = async () => {
    if (!selectedStaff) {
      setErrors({ staff: 'Please select a replacement staff member' });
      return;
    }

    setLoading(true);
    try {
      const updatedShift: Shift = {
        ...shift,
        staffId: selectedStaff.id,
        staffName: selectedStaff.name,
        updatedAt: new Date().toISOString()
      };

      onReplacementConfirmed(updatedShift, selectedStaff);
      onClose();
    } catch (error) {
      console.error('Failed to confirm replacement:', error);
      setErrors({ submit: 'Failed to confirm replacement' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn no-print" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-2xl transform animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Icons.UserPlus className="w-7 h-7 mr-3 text-blue-600" />
            Find Replacement
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-all">
            <Icons.X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Shift Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Current Shift Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Staff:</span>
                <span className="ml-2 text-gray-900">{shift.staffName}</span>
              </div>
              <div>
                <span className="text-gray-500">Tour:</span>
                <span className="ml-2 text-gray-900">{shift.tourName}</span>
              </div>
              <div>
                <span className="text-gray-500">Start Time:</span>
                <span className="ml-2 text-gray-900">{new Date(shift.startTime).toLocaleTimeString()}</span>
              </div>
              <div>
                <span className="text-gray-500">End Time:</span>
                <span className="ml-2 text-gray-900">{new Date(shift.endTime).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Staff Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Staff</label>
            <input
              type="text"
              placeholder="Search by name, role, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Staff List */}
          <div className="border rounded-lg max-h-60 overflow-y-auto">
            {filteredStaff.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No staff members found
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredStaff.map(staffMember => (
                  <li key={staffMember.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedStaff(staffMember)}
                      className={`w-full text-left p-3 hover:bg-gray-50 transition-colors flex items-center ${
                        selectedStaff?.id === staffMember.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <img 
                        src={staffMember.avatar || staffMember.avatarUrl || `https://i.pravatar.cc/150?u=${staffMember.email}`} 
                        alt={staffMember.name} 
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{staffMember.name}</div>
                        <div className="text-sm text-gray-500">{staffMember.role} • {staffMember.department}</div>
                      </div>
                      {selectedStaff?.id === staffMember.id && (
                        <Icons.Check className="ml-auto w-5 h-5 text-blue-600" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.staff && <p className="mt-1 text-sm text-red-600">{errors.staff}</p>}
        </div>

        <div className="p-4 border-t flex justify-end space-x-4 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Confirm Replacement
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplacementModal;
