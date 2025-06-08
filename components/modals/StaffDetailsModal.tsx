import React, { useState } from 'react';
import Icons from '../common/Icons';
import { Staff } from '../../types';
import { apiCall, API_CONFIG } from '../../lib/api';

interface StaffDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff;
  onStaffUpdated: (updatedStaff: Staff) => void;
  onDelete: (staffId: string) => void;
}

const StaffDetailsModal: React.FC<StaffDetailsModalProps> = ({ isOpen, onClose, staff, onStaffUpdated, onDelete }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editedStaff, setEditedStaff] = useState<Staff>(staff);
  
  // In a real app, you would fetch this data from your API
  const [shiftHistory, setShiftHistory] = useState([
    {
      id: '1',
      date: '2023-07-01',
      time: '08:00 - 16:00',
      position: 'Guide',
      location: 'Reykjavík',
      tour: 'Golden Circle Classic',
      status: 'completed'
    },
    {
      id: '2',
      date: '2023-07-03',
      time: '09:00 - 17:00',
      position: 'Guide',
      location: 'Reykjavík',
      tour: 'South Coast Adventure',
      status: 'completed'
    },
    {
      id: '3',
      date: '2023-07-05',
      time: '12:00 - 20:00',
      position: 'Team Leader',
      location: 'Akureyri',
      tour: 'Lake Mývatn Tour',
      status: 'completed'
    },
    {
      id: '4',
      date: '2023-07-10',
      time: '08:00 - 16:00',
      position: 'Guide',
      location: 'Reykjavík',
      tour: 'Snæfellsnes Peninsula',
      status: 'upcoming'
    },
    {
      id: '5',
      date: '2023-07-15',
      time: '14:00 - 22:00',
      position: 'Guide',
      location: 'Reykjavík',
      tour: 'Northern Lights Hunt',
      status: 'upcoming'
    }
  ]);
  
  const [availableSkills] = useState([
    'First Aid', 'CPR', 'Team Leader', 'Driver', 'Security Clearance', 
    'Fluent English', 'Fluent Danish', 'Technical Support', 'Customer Service',
    'Tour Guide', 'Cash Handling', 'Food Handling', 'Bartending'
  ]);

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // In a real app, you would call your API here
      const response = await apiCall(API_CONFIG.STAFF_MANAGEMENT_ENDPOINT, {
        method: 'PUT',
        body: JSON.stringify(editedStaff)
      });
      
      // Update the staff in the parent component
      onStaffUpdated(editedStaff);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedStaff(staff);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedStaff(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedStaff(prev => ({
      ...prev,
      preferences: {
        morningShifts: prev.preferences?.morningShifts ?? false,
        eveningShifts: prev.preferences?.eveningShifts ?? false,
        nightShifts: prev.preferences?.nightShifts ?? false,
        weekends: prev.preferences?.weekends ?? false,
        [name]: value === 'true' ? true : value === 'false' ? false : value
      }
    }));
  };

  const handlePreferenceCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditedStaff(prev => ({
      ...prev,
      preferences: {
        morningShifts: prev.preferences?.morningShifts ?? false,
        eveningShifts: prev.preferences?.eveningShifts ?? false,
        nightShifts: prev.preferences?.nightShifts ?? false,
        weekends: prev.preferences?.weekends ?? false,
        [name]: checked
      }
    }));
  };

  const handleSkillToggle = (skill: string) => {
    const skills = editedStaff.skills || [];
    const newSkills = skills.includes(skill)
      ? skills.filter(s => s !== skill)
      : [...skills, skill];
    
    setEditedStaff(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  const handleDayToggle = (day: string) => {
    const days = editedStaff.daysOff || [];
    const newDays = days.includes(day)
      ? days.filter(d => d !== day)
      : [...days, day];
    
    setEditedStaff(prev => ({
      ...prev,
      daysOff: newDays
    }));
  };

  const handleShiftToggle = (shift: string) => {
    setEditedStaff(prev => ({
      ...prev,
      shiftPreference: shift
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('is-IS');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn no-print" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-2xl transform animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Icons.User className="w-7 h-7 mr-3 text-blue-600" />
            Upplýsingar um starfsmann
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-all">
            <Icons.X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[70vh]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <div className="flex flex-col items-center mb-6">
              <div className="mb-3 relative">
                <img 
                  src={staff.avatarUrl || `https://i.pravatar.cc/150?u=${staff.email}`} 
                  alt={staff.name} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                  staff.status === 'active' ? 'bg-green-500' : 
                  staff.status === 'sick' ? 'bg-red-500' : 
                  'bg-yellow-500'
                }`}></div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900">{staff.name}</h4>
              <p className="text-sm text-gray-600">{staff.role}</p>
              <p className="text-sm text-gray-500">{staff.department}</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'info' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icons.User className="w-5 h-5 inline-block mr-2" />
                Upplýsingar
              </button>
              <button
                onClick={() => setActiveTab('shifts')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'shifts' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icons.Calendar className="w-5 h-5 inline-block mr-2" />
                Vaktir
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'skills' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icons.Star className="w-5 h-5 inline-block mr-2" />
                Hæfni
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'preferences' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icons.Settings className="w-5 h-5 inline-block mr-2" />
                Óskir
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-semibold text-gray-900">Upplýsingar um starfsmann</h4>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Icons.Edit className="w-5 h-5 mr-2" />
                      Breyta
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveChanges}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        disabled={loading}
                      >
                        <Icons.Check className="w-5 h-5 mr-2" />
                        Vista
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Icons.X className="w-5 h-5 mr-2" />
                        Hætta við
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nafn</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editedStaff.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{staff.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Netfang</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editedStaff.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{staff.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Símanúmer</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editedStaff.phone || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{staff.phone || '-'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Starfsheiti</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="role"
                        value={editedStaff.role}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{staff.role}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deild</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="department"
                        value={editedStaff.department}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{staff.department}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Staða</label>
                    {isEditing ? (
                      <select
                        name="status"
                        value={editedStaff.status || 'active'}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="active">Virkur</option>
                        <option value="sick">Veikur</option>
                        <option value="on_leave">Frí</option>
                        <option value="training">Í námi</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">
                        {staff.status === 'active' ? 'Virkur' :
                         staff.status === 'sick' ? 'Veikur' :
                         staff.status === 'on_leave' ? 'Frí' :
                         staff.status === 'training' ? 'Í námi' : 'Virkur'}
                      </p>
                    )}
                  </div>
                </div>

                {staff.emergencyContact && (
                  <div className="mt-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Neyðartengiliður</h5>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nafn</label>
                        <p className="text-gray-900">{staff.emergencyContact.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Símanúmer</label>
                        <p className="text-gray-900">{staff.emergencyContact.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tengsl</label>
                        <p className="text-gray-900">{staff.emergencyContact.relationship}</p>
                      </div>
                    </div>
                  </div>
                )}

                {staff.notes && (
                  <div className="mt-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Athugasemdir</h5>
                    <p className="text-gray-900">{staff.notes}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shifts' && (
              <div className="space-y-6">
                <h4 className="text-xl font-semibold text-gray-900">Vaktir</h4>
                <div className="space-y-4">
                  {shiftHistory.map(shift => (
                    <div key={shift.id} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-gray-900">{shift.tour}</h5>
                          <p className="text-sm text-gray-600">{shift.position}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          shift.status === 'completed' ? 'bg-green-100 text-green-800' :
                          shift.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {shift.status === 'completed' ? 'Lokið' :
                           shift.status === 'upcoming' ? 'Kemur' :
                           'Óvíst'}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Dagsetning</p>
                          <p className="text-gray-900">{formatDate(shift.date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tími</p>
                          <p className="text-gray-900">{shift.time}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Staðsetning</p>
                          <p className="text-gray-900">{shift.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-semibold text-gray-900">Hæfni og vottorð</h4>
                  {isEditing && (
                    <button
                      onClick={handleSaveChanges}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      disabled={loading}
                    >
                      <Icons.Check className="w-5 h-5 mr-2" />
                      Vista
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Hæfni</h5>
                    <div className="space-y-2">
                      {availableSkills.map(skill => (
                        <div key={skill} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`skill-${skill}`}
                            checked={editedStaff.skills?.includes(skill) || false}
                            onChange={() => handleSkillToggle(skill)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            disabled={!isEditing}
                          />
                          <label htmlFor={`skill-${skill}`} className="ml-2 text-gray-900">
                            {skill}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Vottorð</h5>
                    <div className="space-y-2">
                      {editedStaff.certifications?.map(cert => (
                        <div key={cert} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-gray-900">{cert}</span>
                          {isEditing && (
                            <button
                              onClick={() => {
                                setEditedStaff(prev => ({
                                  ...prev,
                                  certifications: prev.certifications?.filter(c => c !== cert)
                                }));
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Icons.X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <button
                          onClick={() => {
                            const newCert = prompt('Sláðu inn nýtt vottorð:');
                            if (newCert) {
                              setEditedStaff(prev => ({
                                ...prev,
                                certifications: [...(prev.certifications || []), newCert]
                              }));
                            }
                          }}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Icons.Plus className="w-4 h-4 mr-1" />
                          Bæta við vottorði
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-semibold text-gray-900">Vaktaróskir</h4>
                  {isEditing && (
                    <button
                      onClick={handleSaveChanges}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      disabled={loading}
                    >
                      <Icons.Check className="w-5 h-5 mr-2" />
                      Vista
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Vaktaróskir</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Æskileg vakt</label>
                        <div className="space-y-2">
                          {['Morgunvakt', 'Dagvakt', 'Kvöldvakt', 'Næturvakt'].map(shift => (
                            <div key={shift} className="flex items-center">
                              <input
                                type="radio"
                                id={`shift-${shift}`}
                                name="shiftPreference"
                                value={shift}
                                checked={editedStaff.shiftPreference === shift}
                                onChange={() => handleShiftToggle(shift)}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                disabled={!isEditing}
                              />
                              <label htmlFor={`shift-${shift}`} className="ml-2 text-gray-900">
                                {shift}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Helgarvaktir</label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="weekends"
                            name="weekends"
                            checked={editedStaff.preferences?.weekends || false}
                            onChange={handlePreferenceCheckboxChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            disabled={!isEditing}
                          />
                          <label htmlFor="weekends" className="ml-2 text-gray-900">
                            Get unnið á helgum
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Frí</h5>
                    <div className="space-y-2">
                      {['Mánudagur', 'Þriðjudagur', 'Miðvikudagur', 'Fimmtudagur', 'Föstudagur', 'Laugardagur', 'Sunnudagur'].map(day => (
                        <div key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`day-${day}`}
                            checked={editedStaff.daysOff?.includes(day) || false}
                            onChange={() => handleDayToggle(day)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            disabled={!isEditing}
                          />
                          <label htmlFor={`day-${day}`} className="ml-2 text-gray-900">
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetailsModal;
