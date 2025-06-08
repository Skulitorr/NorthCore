import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import { Tour } from '../../types';
import AddTourModal from '../modals/AddTourModal';
import { MapIcon, EditIcon, PlusIcon, ClockIcon, AlertIcon, CalendarIcon } from '../common/Icons';

interface ToursViewProps {
  onToursChange?: (tours: Tour[]) => void;
}

const ToursView: React.FC<ToursViewProps> = ({ onToursChange }) => {
  const { fetchTours, updateTour, deleteTour } = useApi();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddTourModalOpen, setIsAddTourModalOpen] = useState<boolean>(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadTours();
  }, []);
  const loadTours = async () => {
    setLoading(true);
    try {
      const toursData = await fetchTours();
      setTours(toursData);
      if (onToursChange) {
        onToursChange(toursData);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load tours data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTourSelect = (tour: Tour) => {
    setSelectedTour(tour);
    setIsAddTourModalOpen(true);
  };

  const handleTourUpdate = async (updatedTour: Tour) => {
    try {
      await updateTour(updatedTour);
      await loadTours();
      setIsAddTourModalOpen(false);
    } catch (err) {
      setError('Failed to update tour. Please try again.');
      console.error(err);
    }
  };

  const handleTourDelete = async (tourId: string) => {
    try {
      await deleteTour(tourId);
      await loadTours();
      setIsAddTourModalOpen(false);
    } catch (err) {
      setError('Failed to delete tour. Please try again.');
      console.error(err);
    }
  };

  const handleAddTour = async (newTour: Tour) => {
    try {
      await updateTour(newTour);
      await loadTours();
      setIsAddTourModalOpen(false);
    } catch (err) {
      setError('Failed to add tour. Please try again.');
      console.error(err);
    }
  };

  const filteredTours = searchQuery
    ? tours.filter(
        (tour) =>
          tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tours;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return <LoadingSpinner size={60} message="Loading tours data..." />;
  }

  return (
    <div className="tours-view">
      <div className="tours-header">
        <h2><MapIcon /> Tours Management</h2>
        <button 
          className="add-tour-button" 
          onClick={() => {
            setSelectedTour(null);
            setIsAddTourModalOpen(true);
          }}
        >
          <PlusIcon /> Add New Tour
        </button>
      </div>

      {error && (
        <div className="error-message">
          <AlertIcon /> {error}
        </div>
      )}

      <div className="tours-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="tours-list">
        {filteredTours.length > 0 ? (
          filteredTours.map((tour) => (
            <div 
              key={tour.id} 
              className="tour-card"
              onClick={() => handleTourSelect(tour)}
            >
              <div className="tour-header">
                <h3 className="tour-name">{tour.name}</h3>
                <div className="tour-actions">
                  <button 
                    className="edit-button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTourSelect(tour);
                    }}
                  >
                    <EditIcon />
                  </button>
                </div>
              </div>
              <p className="tour-description">{tour.description}</p>
              <div className="tour-details">
                <div className="tour-detail">
                  <MapIcon /> {tour.location}
                </div>
                <div className="tour-detail">
                  <ClockIcon /> {formatDuration(tour.durationMinutes)}
                </div>
                <div className="tour-detail">
                  <CalendarIcon /> {tour.frequency}
                </div>
              </div>
              <div className="tour-capacity">
                <span>Capacity: {tour.capacity} guests</span>
                <span>Min Staff: {tour.minStaffRequired}</span>
              </div>
              {tour.tags && tour.tags.length > 0 && (
                <div className="tour-tags">
                  {tour.tags.map((tag, index) => (
                    <span key={index} className="tour-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-tours">
            <p>No tours found matching your criteria.</p>
          </div>
        )}
      </div>

      {isAddTourModalOpen && (
        <AddTourModal
          tour={selectedTour}
          onClose={() => setIsAddTourModalOpen(false)}
          onSave={selectedTour ? handleTourUpdate : handleAddTour}
          onDelete={selectedTour ? handleTourDelete : undefined}
        />
      )}
    </div>
  );
};

export default ToursView;
