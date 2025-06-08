import React, { useState, useEffect } from 'react';
import Icons from '../common/Icons';
import { Staff } from '../../types';
import { apiCall, API_CONFIG } from '../../lib/api';

interface ShiftPreferences {
  preferredShifts: string[];
  preferredDays: string[];
  maxShiftsPerWeek: number;
  maxHoursPerWeek: number;
  canWorkWeekends: boolean;
  canWorkNights: boolean;
  notes: string;
}

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStaffAdded: (staff: Staff) => void;
}

interface AddStaffFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  startDate: string;
  employmentType: 'full-time' | 'part-time' | 'contract';
  certificationsAndSkills: string[];
  shiftPreferences: ShiftPreferences;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, onStaffAdded }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [newStaff, setNewStaff] = useState<AddStaffFormData>({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    startDate: '',
    employmentType: 'full-time',
    certificationsAndSkills: [],
    shiftPreferences: {
      preferredShifts: [],
      preferredDays: [],
      maxShiftsPerWeek: 5,
      maxHoursPerWeek: 40,
      canWorkWeekends: false,
      canWorkNights: false,
      notes: ''
    }
  });

  const [availableSkills, setAvailableSkills] = useState([
    'First Aid', 'CPR', 'Team Leader', 'Driver', 'Security Clearance', 
    'Fluent English', 'Fluent Danish', 'Technical Support', 'Customer Service',
    'Tour Guide', 'Cash Handling', 'Food Handling', 'Bartending'
  ]);

  const [availableDepartments, setAvailableDepartments] = useState([
    'Administration', 'Front Desk', 'Guiding', 'Maintenance', 'Marketing',
    'Sales', 'Operations', 'Customer Support', 'Management'
  ]);

  const [availablePositions, setAvailablePositions] = useState([
    'Manager', 'Team Leader', 'Guide', 'Receptionist', 'Driver',
    'Salesperson', 'Operator', 'Support Agent', 'Administrative Assistant',
    'Marketing Specialist', 'Maintenance Technician'
  ]);

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Clear form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setErrors({});
      setNewStaff({
        name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        startDate: '',
        employmentType: 'full-time',
        certificationsAndSkills: [],
        shiftPreferences: {
          preferredShifts: [],
          preferredDays: [],
          maxShiftsPerWeek: 5,
          maxHoursPerWeek: 40,
          canWorkWeekends: false,
          canWorkNights: false,
          notes: ''
        }
      });
    }
  }, [isOpen]);

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!newStaff.name?.trim()) {
      newErrors.name = 'Nafn er nauðsynlegt';
    }
    
    if (!newStaff.email?.trim()) {
      newErrors.email = 'Netfang er nauðsynlegt';
    } else if (!/\S+@\S+\.\S+/.test(newStaff.email)) {
      newErrors.email = 'Ógilt netfang';
    }
    
    if (!newStaff.phone?.trim()) {
      newErrors.phone = 'Símanúmer er nauðsynlegt';
    }
    
    if (!newStaff.position?.trim()) {
      newErrors.position = 'Starfsheiti er nauðsynlegt';
    }
    
    if (!newStaff.department?.trim()) {
      newErrors.department = 'Deild er nauðsynleg';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!newStaff.shiftPreferences?.maxShiftsPerWeek) {
      newErrors.maxShiftsPerWeek = 'Hámarksfjöldi vakta er nauðsynlegt';
    }
    
    if (!newStaff.shiftPreferences?.maxHoursPerWeek) {
      newErrors.maxHoursPerWeek = 'Hámarksfjöldi klukkustunda er nauðsynlegt';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      addStaff();
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewStaff({ ...newStaff, [name]: checked });
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewStaff({
      ...newStaff,
      shiftPreferences: {
        ...newStaff.shiftPreferences,
        [name]: value
      }
    });
  };

  const handlePreferenceCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewStaff({
      ...newStaff,
      shiftPreferences: {
        ...newStaff.shiftPreferences,
        [name]: checked
      }
    });
  };

  const handleSkillToggle = (skill: string) => {
    const skills = newStaff.certificationsAndSkills || [];
    const newSkills = skills.includes(skill)
      ? skills.filter(s => s !== skill)
      : [...skills, skill];
    
    setNewStaff({
      ...newStaff,
      certificationsAndSkills: newSkills
    });
  };

  const handleDayToggle = (day: string) => {
    const days = newStaff.shiftPreferences?.preferredDays || [];
    const newDays = days.includes(day)
      ? days.filter(d => d !== day)
      : [...days, day];
    
    setNewStaff({
      ...newStaff,
      shiftPreferences: {
        ...newStaff.shiftPreferences,
        preferredDays: newDays
      }
    });
  };

  const handleShiftToggle = (shift: string) => {
    const shifts = newStaff.shiftPreferences?.preferredShifts || [];
    const newShifts = shifts.includes(shift)
      ? shifts.filter(s => s !== shift)
      : [...shifts, shift];
    
    setNewStaff({
      ...newStaff,
      shiftPreferences: {
        ...newStaff.shiftPreferences,
        preferredShifts: newShifts
      }
    });
  };

  const addStaff = async () => {
    setLoading(true);
    try {
      const staffData: Staff = {
        id: `staff-${Date.now()}`,
        name: newStaff.name,
        email: newStaff.email,
        phone: newStaff.phone,
        role: newStaff.position,
        department: newStaff.department,
        sick: false,
        lead: false,
        skills: newStaff.certificationsAndSkills,
        workType: newStaff.employmentType,
        startDate: newStaff.startDate,
        preferences: {
          morningShifts: newStaff.shiftPreferences.preferredShifts.includes('morning'),
          eveningShifts: newStaff.shiftPreferences.preferredShifts.includes('evening'),
          nightShifts: newStaff.shiftPreferences.canWorkNights,
          weekends: newStaff.shiftPreferences.canWorkWeekends
        }
      };

      const response = await apiCall(API_CONFIG.STAFF_MANAGEMENT_ENDPOINT, staffData);

      if (response.success) {
        onStaffAdded(staffData);
        onClose();
      } else {
        throw new Error('Failed to add staff');
      }
    } catch (error) {
      console.error('Error adding staff:', error);
      setErrors({ submit: 'Failed to add staff. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn no-print" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-2xl transform animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Icons.UserPlus className="w-7 h-7 mr-3 text-blue-600" />
            Bæta við starfsmanni
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-all">
            <Icons.X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>1</div>
                <div className={`h-1 w-12 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}>2</div>
              </div>
              <div className="text-sm text-gray-500">
                {step === 1 ? 'Grunnupplýsingar' : 'Vaktafyrirkomulag'}
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nafn</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newStaff.name}
                    onChange={handleInputChange}
                    className={`w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Fullt nafn"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Netfang</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newStaff.email}
                    onChange={handleInputChange}
                    className={`w-full border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="netfang@fyrirtaeki.is"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Símanúmer</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={newStaff.phone}
                    onChange={handleInputChange}
                    className={`w-full border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="5551234"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Upphafsdagur</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={newStaff.startDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Starfsheiti</label>
                  <select
                    id="position"
                    name="position"
                    value={newStaff.position}
                    onChange={handleInputChange}
                    className={`w-full border ${errors.position ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Veldu starfsheiti</option>
                    {availablePositions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                    <option value="other">Annað</option>
                  </select>
                  {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                </div>
                
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Deild</label>
                  <select
                    id="department"
                    name="department"
                    value={newStaff.department}
                    onChange={handleInputChange}
                    className={`w-full border ${errors.department ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Veldu deild</option>
                    {availableDepartments.map(department => (
                      <option key={department} value={department}>{department}</option>
                    ))}
                    <option value="other">Annað</option>
                  </select>
                  {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">Tegund ráðningar</label>
                <select
                  id="employmentType"
                  name="employmentType"
                  value={newStaff.employmentType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="full-time">Fullt starf</option>
                  <option value="part-time">Hlutastarf</option>
                  <option value="contract">Verktaki</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hæfni og réttindi</label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        newStaff.certificationsAndSkills?.includes(skill)
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kjördagar</label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        newStaff.shiftPreferences?.preferredDays?.includes(day)
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day === 'Monday' && 'Mánudagur'}
                      {day === 'Tuesday' && 'Þriðjudagur'}
                      {day === 'Wednesday' && 'Miðvikudagur'}
                      {day === 'Thursday' && 'Fimmtudagur'}
                      {day === 'Friday' && 'Föstudagur'}
                      {day === 'Saturday' && 'Laugardagur'}
                      {day === 'Sunday' && 'Sunnudagur'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kjörvaktir</label>
                <div className="flex flex-wrap gap-2">
                  {['Morning', 'Day', 'Evening', 'Night'].map(shift => (
                    <button
                      key={shift}
                      type="button"
                      onClick={() => handleShiftToggle(shift)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        newStaff.shiftPreferences?.preferredShifts?.includes(shift)
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {shift === 'Morning' && 'Morgunvakt'}
                      {shift === 'Day' && 'Dagvakt'}
                      {shift === 'Evening' && 'Kvöldvakt'}
                      {shift === 'Night' && 'Næturvakt'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="maxShiftsPerWeek" className="block text-sm font-medium text-gray-700 mb-1">Hámarksfjöldi vakta á viku</label>
                  <input
                    type="number"
                    id="maxShiftsPerWeek"
                    name="maxShiftsPerWeek"
                    min="1"
                    max="7"
                    value={newStaff.shiftPreferences?.maxShiftsPerWeek}
                    onChange={handlePreferenceChange}
                    className={`w-full border ${errors.maxShiftsPerWeek ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.maxShiftsPerWeek && <p className="text-red-500 text-xs mt-1">{errors.maxShiftsPerWeek}</p>}
                </div>
                
                <div>
                  <label htmlFor="maxHoursPerWeek" className="block text-sm font-medium text-gray-700 mb-1">Hámarksfjöldi klukkustunda á viku</label>
                  <input
                    type="number"
                    id="maxHoursPerWeek"
                    name="maxHoursPerWeek"
                    min="1"
                    max="168"
                    value={newStaff.shiftPreferences?.maxHoursPerWeek}
                    onChange={handlePreferenceChange}
                    className={`w-full border ${errors.maxHoursPerWeek ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.maxHoursPerWeek && <p className="text-red-500 text-xs mt-1">{errors.maxHoursPerWeek}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="canWorkWeekends"
                    name="canWorkWeekends"
                    checked={newStaff.shiftPreferences?.canWorkWeekends || false}
                    onChange={handlePreferenceCheckboxChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="canWorkWeekends" className="ml-2 block text-sm text-gray-700">
                    Getur unnið um helgar
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="canWorkNights"
                    name="canWorkNights"
                    checked={newStaff.shiftPreferences?.canWorkNights || false}
                    onChange={handlePreferenceCheckboxChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="canWorkNights" className="ml-2 block text-sm text-gray-700">
                    Getur unnið næturvaktir
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Athugasemdir og séróskir</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={newStaff.shiftPreferences?.notes || ''}
                  onChange={handlePreferenceChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Skrá inn athugasemdir eða sérstakar óskir varðandi vaktaplan..."
                ></textarea>
              </div>
            </div>
          )}

          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {errors.submit}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-between bg-gray-50">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-medium"
              >
                Til baka
              </button>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Hætta við
            </button>
            <button
              type="button"
              onClick={nextStep}
              disabled={loading}
              className={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {step === 1 ? 'Áfram' : 'Bæta við starfsmanni'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
