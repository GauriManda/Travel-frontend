import React, { useState } from 'react';
import { X, MapPin, Calendar, Users, DollarSign, Share2, Clock, Utensils, Bed } from 'lucide-react';
import './ExperienceDetail.css';

const ExperienceDetail = ({ experience, onClose }) => {
  const [showFullItinerary, setShowFullItinerary] = useState(false);

  const {
    _id,
    title,
    destination,
    description,
    duration,
    groupSize,
    budgetRange,
    categories,
    itinerary,
    tips,
    bestTimeToVisit,
    transportation,
    totalCost
  } = experience;

  const getBudgetColor = (budget) => {
    switch (budget) {
      case 'budget': return '#10b981';
      case 'mid-range': return '#f59e0b';
      case 'luxury': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="experience-detail-modal">
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="detail-content">
          {/* Content */}
          <div className="detail-info">
            <div className="experience-header">
              <div className="title-section">
                <h1>{title}</h1>
                <div className="location">
                  <MapPin size={20} />
                  <span>{destination}</span>
                </div>
              </div>

              <div className="action-buttons">
                <button className="share-btn" onClick={handleShare}>
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <div className="experience-meta">
              <div className="meta-item">
                <Calendar size={16} />
                <span>{duration} days</span>
              </div>
              <div className="meta-item">
                <Users size={16} />
                <span>{groupSize} people</span>
              </div>
              <div className="meta-item">
                <DollarSign size={16} />
                <span className="budget-badge" style={{ backgroundColor: getBudgetColor(budgetRange) }}>
                  {budgetRange}
                </span>
              </div>
            </div>

            <div className="categories">
              {categories.map((category, index) => (
                <span key={index} className="category-tag">
                  {category}
                </span>
              ))}
            </div>

            <div className="description-section">
              <h3>About This Experience</h3>
              <p>{description}</p>
            </div>

            {/* Quick Info */}
            <div className="quick-info">
              {bestTimeToVisit && (
                <div className="info-card">
                  <Clock size={20} />
                  <div>
                    <h4>Best Time to Visit</h4>
                    <p>{bestTimeToVisit}</p>
                  </div>
                </div>
              )}
              
              {totalCost && (
                <div className="info-card">
                  <DollarSign size={20} />
                  <div>
                    <h4>Total Cost</h4>
                    <p>${totalCost} USD</p>
                  </div>
                </div>
              )}
            </div>

            {/* Itinerary */}
            {itinerary && itinerary.length > 0 && (
              <div className="itinerary-section">
                <div className="section-header">
                  <h3>Day-by-Day Itinerary</h3>
                  <button 
                    className="toggle-btn"
                    onClick={() => setShowFullItinerary(!showFullItinerary)}
                  >
                    {showFullItinerary ? 'Show Less' : 'Show All Days'}
                  </button>
                </div>

                <div className="itinerary-list">
                  {(showFullItinerary ? itinerary : itinerary.slice(0, 3)).map((day, index) => (
                    <div key={index} className="itinerary-day">
                      <div className="day-number">Day {day.day}</div>
                      <div className="day-content">
                        {day.activities && (
                          <div className="day-section">
                            <h5>Activities</h5>
                            <p>{day.activities}</p>
                          </div>
                        )}
                        
                        <div className="day-details">
                          {day.accommodation && (
                            <div className="detail-item">
                              <Bed size={16} />
                              <span>{day.accommodation}</span>
                            </div>
                          )}
                          {day.meals && (
                            <div className="detail-item">
                              <Utensils size={16} />
                              <span>{day.meals}</span>
                            </div>
                          )}
                        </div>

                        {day.notes && (
                          <div className="day-notes">
                            <p><strong>Notes:</strong> {day.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transportation */}
            {transportation && (
              <div className="section">
                <h3>Transportation</h3>
                <p>{transportation}</p>
              </div>
            )}

            {/* Tips */}
            {tips && (
              <div className="tips-section">
                <h3>Travel Tips</h3>
                <div className="tips-content">
                  <p>{tips}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;