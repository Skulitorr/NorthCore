import React, { useState } from 'react';
import Icons from '../common/Icons';
import { Tour } from '../../types';
import { apiCall, API_CONFIG } from '../../lib/api';

interface AddTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTourAdded: (tour: Tour) => void;
}

const AddTourModal: React.FC<AddTourModalProps> = ({ isOpen, onClose, onTourAdded }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [newTour, setNewTour] = useState<Partial<Tour>>({
    name: '',
    description: '',
    duration: 120,
    capacity: 10,
    price: 0,
    location: '',
    staffingRequirements: [],
    dates: [],
    isRecurring: false,
    recurringPattern: 'daily',
    category: '',
    status: 'active'
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [staffingRequirement, setStaffingRequirement] = useState({
    role: '',
    count: 1
  });

  const [availableLocations] = useState([
    'Reykjavík', 'Akureyri', 'Ísafjörður', 'Stykkishólmur', 
    'Egilsstaðir', 'Jökulsárlón', 'Mývatn', 'Vestmannaeyjar',
    'Þingvellir', 'Gullfoss', 'Geysir', 'Landmannalaugar'
  ]);

  const [availableCategories] = useState([
    'Adventure', 'Sightseeing', 'Cultural', 'Wildlife', 
    'Boat Trip', 'Hiking', 'Northern Lights', 'Food Tour',
    'City Tour', 'Historical', 'Photography', 'Whale Watching'
  ]);

  const [availableStaffRoles] = useState([
    'Guide', 'Driver', 'Assistant', 'Instructor', 
    'Safety Officer', 'Photographer', 'Customer Service', 'Team Leader'
  ]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!newTour.name?.trim()) {
      newErrors.name = 'Nafn ferðar er nauðsynlegt';
    }
    
    if (!newTour.description?.trim()) {
      newErrors.description = 'Lýsing er nauðsynleg';
    }
    
    if (!newTour.duration || newTour.duration <= 0) {
      newErrors.duration = 'Gild lengd ferðar er nauðsynleg';
    }
    
    if (!newTour.capacity || newTour.capacity <= 0) {
      newErrors.capacity = 'Gild hámarksfjöldi er nauðsynlegur';
    }
    
    if (!newTour.price && newTour.price !== 0) {
      newErrors.price = 'Verð er nauðsynlegt';
    }
    
    if (!newTour.location?.trim()) {
      newErrors.location = 'Staðsetning er nauðsynleg';
    }
    
    if (!newTour.category?.trim()) {
      newErrors.category = 'Flokkur er nauðsynlegur';
    }
    
    if (newTour.dates?.length === 0) {
      newErrors.dates = 'Að minnsta kosti ein dagsetning er nauðsynleg';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setNewTour({ ...newTour, [name]: parseFloat(value) || 0 });
    } else {
      setNewTour({ ...newTour, [name]: value });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewTour({ ...newTour, [name]: checked });
  };

  const handleAddDate = () => {
    if (!selectedDate || !selectedTime) return;
    
    const dateTime = new Date(`${selectedDate}T${selectedTime}`);
    if (isNaN(dateTime.getTime())) return;
    
    const formattedDateTime = dateTime.toISOString();
    
    // Check if this date already exists
    if (newTour.dates?.some(d => new Date(d).getTime() === dateTime.getTime())) {
      setErrors({ ...errors, dateAdd: 'Þessi dagsetning er þegar skráð' });
      return;
    }
    
    setNewTour({
      ...newTour,
      dates: [...(newTour.dates || []), formattedDateTime]
    });
    
    // Clear the inputs and errors
    setSelectedDate('');
    setSelectedTime('');
    setErrors({ ...errors, dateAdd: '' });
  };

  const handleRemoveDate = (dateToRemove: string) => {
    setNewTour({
      ...newTour,
      dates: newTour.dates?.filter(date => date !== dateToRemove)
    });
  };

  const handleAddStaffRequirement = () => {
    if (!staffingRequirement.role || staffingRequirement.count <= 0) {
      setErrors({ ...errors, staffAdd: 'Veldu starf og fjölda' });
      return;
    }
    
    // Check if this role already exists
    if (newTour.staffingRequirements?.some(sr => sr.role === staffingRequirement.role)) {
      setErrors({ ...errors, staffAdd: 'Þetta starf er þegar skráð' });
      return;
    }
    
    setNewTour({
      ...newTour,
      staffingRequirements: [...(newTour.staffingRequirements || []), { ...staffingRequirement }]
    });
    
    // Clear the inputs and errors
    setStaffingRequirement({ role: '', count: 1 });
    setErrors({ ...errors, staffAdd: '' });
  };

  const handleRemoveStaffRequirement = (roleToRemove: string) => {
    setNewTour({
      ...newTour,
      staffingRequirements: newTour.staffingRequirements?.filter(sr => sr.role !== roleToRemove)
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // In a real app, this would send to your backend API
      const response = await apiCall(API_CONFIG.ADD_TOUR_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(newTour)
      });

      // For this example, simulate a successful response
      // and generate a unique ID (this would normally come from the backend)
      const completeTour: Tour = {
        ...newTour as Tour,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        image: `https://source.unsplash.com/random/300x200/?${newTour.category?.toLowerCase()}`,
      };
      
      onTourAdded(completeTour);
      onClose();
    } catch (error) {
      console.error('Failed to add tour:', error);
      setErrors({ ...errors, submit: 'Villa kom upp við að bæta við ferð' });
    } finally {
      setLoading(false);
    }
  };

  // Format a date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('is-IS', { 
      day: 'numeric', 
      month: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn no-print" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-2xl transform animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Icons.Map className="w-7 h-7 mr-3 text-blue-600" />
            Bæta við ferð
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-all">
            <Icons.X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nafn ferðar</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newTour.name}
                onChange={handleInputChange}
                className={`w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="t.d. Gullni hringurinn"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Flokkur</label>
              <select
                id="category"
                name="category"
                value={newTour.category}
                onChange={handleInputChange}
                className={`w-full border ${errors.category ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Veldu flokk</option>
                {availableCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="other">Annað</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Lýsing</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={newTour.description}
              onChange={handleInputChange}
              className={`w-full border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Lýsing á ferðinni..."
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Lengd (mínútur)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                min="1"
                value={newTour.duration}
                onChange={handleInputChange}
                className={`w-full border ${errors.duration ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
            </div>
            
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">Hámarksfjöldi</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                min="1"
                value={newTour.capacity}
                onChange={handleInputChange}
                className={`w-full border ${errors.capacity ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Verð (ISK)</label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                value={newTour.price}
                onChange={handleInputChange}
                className={`w-full border ${errors.price ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Staðsetning</label>
            <select
              id="location"
              name="location"
              value={newTour.location}
              onChange={handleInputChange}
              className={`w-full border ${errors.location ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="">Veldu staðsetningu</option>
              {availableLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
              <option value="other">Annað</option>
            </select>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          <div className="mt-6">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="isRecurring"
                name="isRecurring"
                checked={newTour.isRecurring}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700">
                Endurtekið ferðalag
              </label>
            </div>
            
            {newTour.isRecurring && (
              <div className="pl-7 mt-3">
                <label htmlFor="recurringPattern" className="block text-sm font-medium text-gray-700 mb-1">Endurtekningamynstur</label>
                <select
                  id="recurringPattern"
                  name="recurringPattern"
                  value={newTour.recurringPattern}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">Daglega</option>
                  <option value="weekdays">Virka daga</option>
                  <option value="weekends">Um helgar</option>
                  <option value="weekly">Vikulega</option>
                  <option value="biweekly">Hálfsmánaðarlega</option>
                  <option value="monthly">Mánaðarlega</option>
                </select>
              </div>
            )}
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Dagsetningar ferða</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="selectedDate" className="block text-sm font-medium text-gray-700 mb-1">Dagsetning</label>
                <input
                  type="date"
                  id="selectedDate"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="selectedTime" className="block text-sm font-medium text-gray-700 mb-1">Tími</label>
                <input
                  type="time"
                  id="selectedTime"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddDate}
                  className="h-10 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium flex items-center justify-center"
                >
                  <Icons.Plus className="w-5 h-5 mr-1" />
                  Bæta við dagsetningu
                </button>
              </div>
            </div>
            
            {errors.dateAdd && <p className="text-red-500 text-xs mt-2">{errors.dateAdd}</p>}
            
            {newTour.dates && newTour.dates.length > 0 ? (
              <div className="mt-4">
                <ul className="max-h-40 overflow-y-auto divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  {newTour.dates.map((date, index) => (
                    <li key={index} className="flex justify-between items-center px-4 py-3 bg-white">
                      <span className="text-sm text-gray-800">{formatDate(date)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDate(date)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Icons.Trash className="w-5 h-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              errors.dates && <p className="text-red-500 text-xs mt-2">{errors.dates}</p>
            )}
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Starfsmannaþörf</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="staffRole" className="block text-sm font-medium text-gray-700 mb-1">Starf</label>
                <select
                  id="staffRole"
                  value={staffingRequirement.role}
                  onChange={(e) => setStaffingRequirement({ ...staffingRequirement, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Veldu starf</option>
                  {availableStaffRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                  <option value="other">Annað</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="staffCount" className="block text-sm font-medium text-gray-700 mb-1">Fjöldi</label>
                <input
                  type="number"
                  id="staffCount"
                  min="1"
                  value={staffingRequirement.count}
                  onChange={(e) => setStaffingRequirement({ ...staffingRequirement, count: parseInt(e.target.value) || 1 })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddStaffRequirement}
                  className="h-10 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium flex items-center justify-center"
                >
                  <Icons.Plus className="w-5 h-5 mr-1" />
                  Bæta við starfi
                </button>
              </div>
            </div>
            
            {errors.staffAdd && <p className="text-red-500 text-xs mt-2">{errors.staffAdd}</p>}
            
            {newTour.staffingRequirements && newTour.staffingRequirements.length > 0 && (
              <div className="mt-4">
                <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  {newTour.staffingRequirements.map((req, index) => (
                    <li key={index} className="flex justify-between items-center px-4 py-3 bg-white">
                      <span className="text-sm text-gray-800">
                        {req.role} x {req.count}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStaffRequirement(req.role)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Icons.Trash className="w-5 h-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Staða</label>
            <select
              id="status"
              name="status"
              value={newTour.status}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Virk</option>
              <option value="inactive">Óvirk</option>
              <option value="draft">Drög</option>
              <option value="seasonal">Árstíðabundin</option>
            </select>
          </div>

          {errors.submit && (
            <div className="mt-6 p-3 bg-red-50 text-red-700 rounded-lg">
              {errors.submit}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end space-x-4 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-medium"
          >
            Hætta við
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
            Bæta við ferð
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTourModal;
