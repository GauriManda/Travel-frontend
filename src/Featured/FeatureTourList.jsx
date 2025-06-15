import React, { useEffect } from "react";
import "./FeaturedTourList.css";
import TourCard from "../Shared/TourCard";
import useFetch from "../hooks/useFetch.js";
import { BASE_URL } from "../utils/config.js";

const FeaturedTourList = () => {
  const { data: featuredTours, loading, error } = useFetch(
    `${BASE_URL}/tours/search/getFeaturedTours?limit=9`
  );

  useEffect(() => {
    if (process.env.NODE_ENV === "development" && featuredTours) {
      console.log("Fetched Featured Tours:", featuredTours);
    }
  }, [featuredTours]);

  return (
    <div className="featured-tours-container">
      <h2 className="featured-tours-heading">Explore India's Best Treks</h2>

      {loading && <h4 className="loading-text">Loading...</h4>}
      {error && <h4 className="error-text">{error}</h4>}

      {featuredTours?.length > 0 ? (
        <div className="featured-tours-grid">
          {featuredTours.map((tour) => (
            <TourCard key={tour._id} tour={tour} />

          ))}
        </div>
      ) : (
        !loading && <h4 className="no-tours-text">No featured tours available.</h4>
      )}
    </div>
  );
};

export default FeaturedTourList;
