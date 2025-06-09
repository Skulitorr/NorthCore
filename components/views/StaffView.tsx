import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { Staff } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import Icons from '../common/Icons';
import AddStaffModal from '../modals/AddStaffModal';
import StaffDetailsModal from '../modals/StaffDetailsModal';

interface StaffViewProps {
  staff: Staff[];
  onStaffChange: (updatedStaff: Staff[]) => void;
}

const StaffView: React.FC<StaffViewProps> = ({ staff, onStaffChange }) => {
  const { fetchStaff, updateStaff, deleteStaff } = useApi();
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const staffData = await fetchStaff();
      setFilteredStaff(staffData);
      if (onStaffChange) {
        onStaffChange(staffData);
      }
    } catch (err) {
      setError('Failed to load staff data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = staff.filter(s => 
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.role.toLowerCase().includes(query.toLowerCase()) ||
      s.department.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStaff(filtered);
  };

  const handleAddStaff = async (newStaff: Staff) => {
    try {
      const updatedStaff = await updateStaff(newStaff);
      setFilteredStaff(prev => [...prev, updatedStaff]);
      if (onStaffChange) {
        onStaffChange([...staff, updatedStaff]);
      }
      setShowAddModal(false);
    } catch (err) {
      setError('Failed to add staff member');
      console.error(err);
    }
  };

  const handleUpdateStaff = async (updatedStaff: Staff) => {
    try {
      const result = await updateStaff(updatedStaff);
      setFilteredStaff(prev => prev.map(s => s.id === result.id ? result : s));
      if (onStaffChange) {
        onStaffChange(staff.map(s => s.id === result.id ? result : s));
      }
      setSelectedStaff(null);
    } catch (err) {
      setError('Failed to update staff member');
      console.error(err);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    try {
      await deleteStaff(staffId);
      setFilteredStaff(prev => prev.filter(s => s.id !== staffId));
      if (onStaffChange) {
        onStaffChange(staff.filter(s => s.id !== staffId));
      }
      setSelectedStaff(null);
    } catch (err) {
      setError('Failed to delete staff member');
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading staff data..." />;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        <Icons.Alert className="w-6 h-6 inline-block mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Icons.Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icons.Plus className="w-5 h-5 mr-2" />
          Add Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map(staffMember => (
          <div
            key={staffMember.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedStaff(staffMember)}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Icons.User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{staffMember.name}</h3>
                <p className="text-sm text-gray-600">{staffMember.role}</p>
                <p className="text-sm text-gray-500">{staffMember.department}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddStaffModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onStaffAdded={handleAddStaff}
        />
      )}

      {selectedStaff && (
        <StaffDetailsModal
          isOpen={!!selectedStaff}
          onClose={() => setSelectedStaff(null)}
          staff={selectedStaff}
          onStaffUpdated={handleUpdateStaff}
          onDelete={handleDeleteStaff}
        />
      )}
    </div>
  );
};

export default StaffView;
