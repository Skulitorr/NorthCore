import React, { useState } from 'react';
import { Tour } from '../../types';

interface ToursViewProps {
  onToursChange: (tours: Tour[]) => void;
}

const ToursView: React.FC<ToursViewProps> = ({ onToursChange }) => {
  const [isAddingTour, setIsAddingTour] = useState(false);
  const [newTour, setNewTour] = useState<Partial<Tour>>({
    name: '',
    description: '',
    duration: 60,
    maxParticipants: 10,
    price: 0,
    schedule: {
      startTime: '09:00',
      endTime: '17:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  });

  const handleAddTour = () => {
    if (newTour.name && newTour.description) {
      const tour: Tour = {
        id: Date.now().toString(),
        name: newTour.name,
        description: newTour.description,
        duration: newTour.duration || 60,
        maxParticipants: newTour.maxParticipants || 10,
        price: newTour.price || 0,
        schedule: newTour.schedule || {
          startTime: '09:00',
          endTime: '17:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
      };
      onToursChange([tour]);
      setNewTour({
        name: '',
        description: '',
        duration: 60,
        maxParticipants: 10,
        price: 0,
        schedule: {
          startTime: '09:00',
          endTime: '17:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
      });
      setIsAddingTour(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Tour Management</h2>
          <button
            onClick={() => setIsAddingTour(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Tour
          </button>
        </div>
      </div>

      {isAddingTour && (
        <div className="p-4 border-b">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Tour Name"
              value={newTour.name}
              onChange={(e) => setNewTour({ ...newTour, name: e.target.value })}
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Description"
              value={newTour.description}
              onChange={(e) => setNewTour({ ...newTour, description: e.target.value })}
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={newTour.duration}
              onChange={(e) => setNewTour({ ...newTour, duration: parseInt(e.target.value) })}
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Max Participants"
              value={newTour.maxParticipants}
              onChange={(e) => setNewTour({ ...newTour, maxParticipants: parseInt(e.target.value) })}
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Price"
              value={newTour.price}
              onChange={(e) => setNewTour({ ...newTour, price: parseFloat(e.target.value) })}
              className="px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setIsAddingTour(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTour}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="p-4">
        <p className="text-gray-500 text-center">No tours available. Add a tour to get started.</p>
      </div>
    </div>
  );
};

export default ToursView; 