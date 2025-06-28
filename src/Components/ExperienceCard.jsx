import React from 'react';
import { MapPin, Calendar, Users, Eye } from 'lucide-react';
import './ExperienceCard.css';

const ExperienceCard = ({ experience, onLike, onClick }) => {
  const {
    _id,
    title,
    destination,
    description,
    duration,
    groupSize,
    budgetRange,
    categories,
    image // 🔴 Make sure this exists
  } = experience;

  const getBudgetColor = (budget) => {
    switch (budget) {
      case 'budget': return '#10b981';
      case 'mid-range': return '#f59e0b';
      case 'luxury': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="experience-card" onClick={onClick}>
      {/* 🔵 Show image at top if available */}
      {image && (
        <div className="card-top-image">
          <img src={image} alt={title || 'Experience'} />
        </div>
      )}

      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          <div
            className="budget-badge"
            style={{ backgroundColor: getBudgetColor(budgetRange) }}
          >
            {budgetRange}
          </div>
        </div>

        <div className="destination">
          <MapPin size={16} />
          <span>{destination}</span>
        </div>

        <p className="description">{description?.substring(0, 120)}...</p>

        <div className="card-details">
          <div className="detail-item">
            <Calendar size={16} />
            <span>{duration} days</span>
          </div>
          <div className="detail-item">
            <Users size={16} />
            <span>{groupSize} people</span>
          </div>
        </div>

        <div className="categories">
          {categories.slice(0, 2).map((category, index) => (
            <span key={index} className="category-tag">
              {category}
            </span>
          ))}
          {categories.length > 2 && (
            <span className="category-more">+{categories.length - 2}</span>
          )}
        </div>

        <div className="view-more">
          <Eye size={16} />
          <span>View Details</span>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
