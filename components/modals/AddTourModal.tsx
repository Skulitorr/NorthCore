import React, { useState } from 'react';
import Icons from '../common/Icons';
import { Tour } from '../../types';
import { apiCall, API_CONFIG } from '../../lib/api';

interface AddTourModalProps {
  tour?: Tour | null;
  onClose: () => void;
  onSave: (tour: Tour) => void;
  onDelete?: (tourId: string) => void;
}

const AddTourModal: React.FC<AddTourModalProps> = ({ tour, onClose, onSave, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [newTour, setNewTour] = useState<Partial<Tour>>(tour || {
    name: '',
    type: '',
    description: '',
    location: '',
    durationMinutes: 120,
    frequency: 'daily',
    capacity: 10,
    minStaffRequired: 1,
    price: 0,
    tags: [],
    requirements: [],
    difficulty: 'medium',
    included: [],
    meetingPoint: '',
    active: true,
    season: 'all'
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
    
    if (!newTour.durationMinutes || newTour.durationMinutes <= 0) {
      newErrors.durationMinutes = 'Gild lengd ferðar er nauðsynleg';
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
    
    if (!newTour.type?.trim()) {
      newErrors.type = 'Tegund ferðar er nauðsynleg';
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
      const response = await apiCall(API_CONFIG.TOURS_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(newTour)
      });

      // For this example, simulate a successful response
      // and generate a unique ID (this would normally come from the backend)
      const completeTour: Tour = {
        ...newTour as Tour,
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: `https://source.unsplash.com/random/300x200/?${newTour.type?.toLowerCase()}`
      };
      
      onSave(completeTour);
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

  if (!tour) return null;

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
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tegund ferðar</label>
              <select
                id="type"
                name="type"
                value={newTour.type}
                onChange={handleInputChange}
                className={`w-full border ${errors.type ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Veldu tegund</option>
                <option value="Adventure">Ævintýri</option>
                <option value="Sightseeing">Skoðun</option>
                <option value="Cultural">Menning</option>
                <option value="Wildlife">Dýralíf</option>
                <option value="Boat Trip">Bátsferð</option>
                <option value="Hiking">Gönguferð</option>
                <option value="Northern Lights">Norðurljós</option>
                <option value="Food Tour">Matarferð</option>
                <option value="City Tour">Borgarferð</option>
                <option value="Historical">Söguleg</option>
                <option value="Photography">Ljósmyndun</option>
                <option value="Whale Watching">Hvalaskoðun</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Lýsing</label>
              <textarea
                id="description"
                name="description"
                value={newTour.description}
                onChange={handleInputChange}
                className={`w-full border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                rows={3}
                placeholder="Skrifaðu stutta lýsingu á ferðinni..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Staðsetning</label>
              <input
                type="text"
                id="location"
                name="location"
                value={newTour.location}
                onChange={handleInputChange}
                className={`w-full border ${errors.location ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="t.d. Reykjavík"
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            <div>
              <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700 mb-1">Lengd (mínútur)</label>
              <input
                type="number"
                id="durationMinutes"
                name="durationMinutes"
                value={newTour.durationMinutes}
                onChange={handleInputChange}
                className={`w-full border ${errors.durationMinutes ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                min="0"
              />
              {errors.durationMinutes && <p className="text-red-500 text-xs mt-1">{errors.durationMinutes}</p>}
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">Hámarksfjöldi</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={newTour.capacity}
                onChange={handleInputChange}
                className={`w-full border ${errors.capacity ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                min="1"
              />
              {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
            </div>

            <div>
              <label htmlFor="minStaffRequired" className="block text-sm font-medium text-gray-700 mb-1">Lágmarks starfsfólk</label>
              <input
                type="number"
                id="minStaffRequired"
                name="minStaffRequired"
                value={newTour.minStaffRequired}
                onChange={handleInputChange}
                className={`w-full border ${errors.minStaffRequired ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                min="1"
              />
              {errors.minStaffRequired && <p className="text-red-500 text-xs mt-1">{errors.minStaffRequired}</p>}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Verð</label>
              <input
                type="number"
                id="price"
                name="price"
                value={newTour.price}
                onChange={handleInputChange}
                className={`w-full border ${errors.price ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                min="0"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>

          {errors.submit && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hætta við
            </button>
            {onDelete && tour && (
              <button
                onClick={() => onDelete(tour.id)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eyða
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Vista...' : 'Vista'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTourModal;
