import React, { useState } from 'react';
import { X, MapPin, Calendar, Users, DollarSign, Star, Heart, Share2, Clock, Utensils, Bed } from 'lucide-react';
import './ExperienceDetail.css';

const ExperienceDetail = ({ experience, onClose, onLike }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullItinerary, setShowFullItinerary] = useState(false);

  const {
    _id,
    title,
    destination,
    description,
    images,
    duration,
    groupSize,
    rating,
    likes,
    isLiked,
    budgetRange,
    categories,
    author,
    createdAt,
    itinerary,
    tips,
    bestTimeToVisit,
    transportation,
    totalCost
  } = experience;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBudgetColor = (budget) => {
    switch (budget) {
      case 'budget': return '#10b981';
      case 'mid-range': return '#f59e0b';
      case 'luxury': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
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
          {/* Image Gallery */}
          <div className="image-gallery">
            {images && images.length > 0 ? (
              <>
                <img 
                  src={images[currentImageIndex]} 
                  alt={`${title} - Image ${currentImageIndex + 1}`}
                  className="main-image"
                />
                {images.length > 1 && (
                  <>
                    <button className="nav-btn prev-btn" onClick={prevImage}>‹</button>
                    <button className="nav-btn next-btn" onClick={nextImage}>›</button>
                    <div className="image-indicators">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="no-image">
                <MapPin size={48} />
                <span>No images available</span>
              </div>
            )}
          </div>

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
                <button 
                  className={`like-btn ${isLiked ? 'liked' : ''}`}
                  onClick={() => onLike(_id)}
                >
                  <Heart size={20} fill={isLiked ? '#ef4444' : 'none'} />
                  {likes}
                </button>
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
              <div className="meta-item">
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <span>{rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="categories">
              {categories.map((category, index) => (
                <span key={index} className="category-tag">
                  {category}
                </span>
              ))}
            </div>

            <div className="author-section">
              <img 
                src={author.avatar || '/api/placeholder/40/40'} 
                alt={author.name}
                className="author-avatar"
              />
              <div className="author-info">
                <span className="author-name">{author.name}</span>
                <span className="post-date">Shared on {formatDate(createdAt)}</span>
              </div>
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