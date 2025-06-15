import React, { useEffect } from "react";
import "./FeaturedTourList.css";
import TourCard from "../Shared/TourCard";
import useSimpleFetch from "../hooks/useFetch.js";
import { BASE_URL } from "../utils/config.js";

// Move API URL outside component to prevent recreation
const FEATURED_TOURS_API_URL = `${BASE_URL}/tours/search/getFeaturedTours?limit=9`;

const FeaturedTourList = () => {
  
  const { data: featuredTours, loading, error } = useSimpleFetch(FEATURED_TOURS_API_URL);

  // Combine all your debugging logs into one useEffect to reduce noise
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("FeaturedTourList Debug:", {
        apiUrl: FEATURED_TOURS_API_URL,
        featuredToursCount: featuredTours?.length || 0,
        loading,
        error: error || 'none'
      });
    }
  }, [featuredTours?.length, loading, error]); // Removed apiUrl dependency

  // Remove the test fetch useEffect - it's causing unnecessary calls
  // If you need to debug, do it manually in browser console or add it temporarily

  return (
    <div className="featured-tours-container">
      <h2 className="featured-tours-heading">Explore India's Best Treks</h2>
      
      {loading && <h4 className="loading-text">Loading...</h4>}
      {error && (
        <div className="error-container">
          <h4 className="error-text">Error: {error}</h4>
          <p>Check the browser console for more details.</p>
        </div>
      )}
      
      {featuredTours?.length > 0 ? (
        <div className="featured-tours-grid">
          {featuredTours.map((tour) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>
      ) : (
        !loading && !error && <h4 className="no-tours-text">No featured tours available.</h4>
      )}
    </div>
  );
};

export default FeaturedTourList;