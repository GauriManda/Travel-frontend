import React from 'react';
import { MapPin, Calendar, Users, Star, Heart, Eye } from 'lucide-react';
import './ExperienceCard.css';
const ExperienceCard = ({ experience, onLike, onClick }) => {
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
    createdAt
  } = experience;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div className="experience-card" onClick={onClick}>
      <div className="card-image">
        <img 
          src={images[0] || '/api/placeholder/400/250'} 
          alt={title}
          onError={(e) => {
            e.target.src = '/api/placeholder/400/250';
          }}
        />
        <div className="card-overlay">
          <div className="budget-badge" style={{ backgroundColor: getBudgetColor(budgetRange) }}>
            {budgetRange}
          </div>
          <button 
            className={`like-btn ${isLiked ? 'liked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onLike(_id);
            }}
          >
            <Heart size={18} fill={isLiked ? '#ef4444' : 'none'} />
            {likes}
          </button>
        </div>
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          <div className="rating">
            <Star size={16} fill="#fbbf24" color="#fbbf24" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="destination">
          <MapPin size={16} />
          <span>{destination}</span>
        </div>

        <p className="description">{description.substring(0, 120)}...</p>

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

        <div className="card-footer">
          <div className="author-info">
            <img 
              src={author.avatar || '/api/placeholder/32/32'} 
              alt={author.name}
              className="author-avatar"
            />
            <div>
              <span className="author-name">{author.name}</span>
              <span className="post-date">{formatDate(createdAt)}</span>
            </div>
          </div>
          <div className="view-more">
            <Eye size={16} />
            <span>View Details</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;