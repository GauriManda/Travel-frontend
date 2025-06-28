import React, { memo } from "react";
import { Link } from "react-router-dom";
import "./TourCard.css";

const TourCard = memo(({ tour }) => {
  // Memoize the difficulty class to prevent recalculation
  const difficultyClass = React.useMemo(() => {
    return `difficulty-badge ${tour.difficulty?.toLowerCase?.() || "unknown"}`;
  }, [tour.difficulty]);

  return (
    <Link to={`/trek/${tour._id}`} className="tour-card">
      <div className="tour-card-image">
        <img
          src={tour.photo || '/Assets/default.jpg'}
          alt={tour.title}
          className="tour-image"
          onError={(e) => (e.target.src = '/Assets/default.jpg')}
        />

        <div className="tour-card-badge">
          <span className={difficultyClass}>
            {tour.difficulty || "Unknown"}
          </span>
        </div>
      </div>

      <div className="tour-card-content">
        <div className="tour-card-location">
          <span>{tour.location}</span>
        </div>
        <h3 className="tour-card-title">{tour.title}</h3>

        <div className="tour-card-duration">
          <span>{tour.duration}</span>
        </div>

        <div className="tour-card-price">
          <span className="price-amount">₹{tour.price}</span>
          <span className="price-per">/person</span>
        </div>
      </div>
    </Link>
  );
});

// Set display name for debugging
TourCard.displayName = 'TourCard';

export default TourCard;