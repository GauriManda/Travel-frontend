import React, { useState, useEffect } from "react";

import TourCard from "../Shared/TourCard";
import MapIntegration from "../Pages/MapIntegration";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";
import "./Tours.css"; 

const Tours = () => {
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [filteredTours, setFilteredTours] = useState([]);
  const [showFilteredTours, setShowFilteredTours] = useState(false);
  
  const toursEndpoint = showFilteredTours 
    ? `${BASE_URL}/tours`
    : `${BASE_URL}/tours?page=${page}`;
    
  const {
    data: tours,
    loading,
    error,
  } = useFetch(toursEndpoint);
  
  const { data: tourCount } = useFetch(`${BASE_URL}/tours/search/getTourCount`);

  useEffect(() => {
    if (tourCount && !showFilteredTours) {
      const pages = Math.ceil(tourCount / 8);
      setPageCount(pages);
    } else if (showFilteredTours && filteredTours.length > 0) {
      const pages = Math.ceil(filteredTours.length / 8);
      setPageCount(pages);
    }
    window.scrollTo(0, 0);
  }, [page, tourCount, tours, filteredTours, showFilteredTours]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setPage(0);
    console.log('Selected location for tours:', location);
    
    if (!location) {
      setShowFilteredTours(false);
      setFilteredTours([]);
    }
  };

  const handleToursFiltered = (filteredToursData) => {
    setFilteredTours(filteredToursData);
    setShowFilteredTours(filteredToursData && filteredToursData.length >= 0);
    setPage(0);
    
    if (filteredToursData && filteredToursData.length > 0) {
      const pages = Math.ceil(filteredToursData.length / 8);
      setPageCount(pages);
    } else {
      setPageCount(0);
    }
  };

  const handleSearchStateChange = (isSearching) => {
    setIsSearchingLocation(isSearching);
  };

  const getDisplayTours = () => {
    if (showFilteredTours && filteredTours.length > 0) {
      const startIndex = page * 8;
      const endIndex = startIndex + 8;
      return filteredTours.slice(startIndex, endIndex);
    }
    return tours || [];
  };

  const handleClearLocationFilter = () => {
    setSelectedLocation(null);
    setFilteredTours([]);
    setShowFilteredTours(false);
    setPage(0);
  };

  const displayTours = getDisplayTours();
  const totalToursCount = showFilteredTours ? filteredTours.length : tourCount;

  return (
    <div className="tours-page">
      {/* Map Integration Section */}
      <section className="search-section">
        <div className="container">
          
          <div className="map-integration-wrapper">
            <MapIntegration 
              onLocationSelect={handleLocationSelect}
              onSearchStateChange={handleSearchStateChange}
              onToursFiltered={handleToursFiltered}
            />
          </div>
        </div>
      </section>
          
      {/* Display selected location info */}
      {selectedLocation && (
        <div className="container">
          <div className="location-alert">
            <div className="location-alert-content">
              <div className="location-info">
                <h6>🎯 Destination Selected!</h6>
                <div className="location-details">
                  <strong>{selectedLocation.display_name?.split(',')[0] || 'Selected Location'}</strong>
                  <br />
                  <small>
                    {selectedLocation.display_name || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
                    <br />
                    Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    <br />
                    {showFilteredTours ? (
                      <>Found <strong>{filteredTours.length}</strong> tour(s) for this destination.</>
                    ) : (
                      'Browse tours below for this destination.'
                    )}
                  </small>
                </div>
              </div>
              <button 
                className="clear-btn"
                onClick={handleClearLocationFilter}
                title="Clear location filter"
              >
                ✕ Clear
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Tour List Section */}
      <section className="tour-section">
        <div className="container">
          {/* Loading state for location search */}
          {isSearchingLocation && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Searching for destination and matching tours...</p>
            </div>
          )}

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading tours...</p>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <h4>{error}</h4>
            </div>
          )}
          
          {!loading && !error && (
            <>
              {/* Tours Header */}
              <div className="section-header">
                <h2 className="section-title">
                  {selectedLocation ? 'Tours Near Your Destination' : 'All Tours'}
                </h2>
                <div className="section-subtitle">
                  {selectedLocation ? (
                    <div>
                      <p>
                        Showing {showFilteredTours ? filteredTours.length : 'all'} tours for{' '}
                        <strong>
                          {selectedLocation.display_name?.split(',')[0] || 'your selected location'}
                        </strong>
                        {showFilteredTours && filteredTours.length > 0 && (
                          <span> (Page {page + 1} of {pageCount})</span>
                        )}
                      </p>
                      <div className="header-actions">
                        <button 
                          className="btn-outline"
                          onClick={handleClearLocationFilter}
                        >
                          Show All Tours
                        </button>
                        <span className="badge">
                          {showFilteredTours ? filteredTours.length : 'All'} Tours
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p></p>
                  )}
                </div>
              </div>

              {/* Tour Cards */}
              <div className="tour-list">
                {displayTours.map((tour) => (
                  <div className="tour-card-wrapper" key={tour._id}>
                    <TourCard tour={tour} />
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {displayTours.length > 0 && pageCount > 1 && (
                <div className="pagination-wrapper">
                  <div className="pagination">
                    {/* Previous button */}
                    {page > 0 && (
                      <span
                        onClick={() => setPage(page - 1)}
                        className="prev"
                      >
                        ← Previous
                      </span>
                    )}
                    
                    {/* Page numbers */}
                    {[...Array(pageCount).keys()].map((number) => {
                      if (
                        number === 0 || 
                        number === pageCount - 1 || 
                        (number >= page - 2 && number <= page + 2)
                      ) {
                        return (
                          <span
                            key={number}
                            onClick={() => setPage(number)}
                            className={page === number ? "active-page" : ""}
                          >
                            {number + 1}
                          </span>
                        );
                      } else if (number === page - 3 || number === page + 3) {
                        return <span key={number} className="pagination-ellipsis">...</span>;
                      }
                      return null;
                    })}
                    
                    {/* Next button */}
                    {page < pageCount - 1 && (
                      <span
                        onClick={() => setPage(page + 1)}
                        className="next"
                      >
                        Next →
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* No tours message */}
              {displayTours.length === 0 && !loading && (
                <div className="empty-state">
                  <div className="empty-state-icon">🏔️</div>
                  <h5 className="empty-state-title">
                    {selectedLocation ? 'No tours found for this destination' : 'No tours found'}
                  </h5>
                  <p className="empty-state-text">
                    {selectedLocation 
                      ? `We couldn't find any tours matching "${selectedLocation.display_name?.split(',')[0]}". Try selecting a different location or browse all available tours.` 
                      : "Please try again later or contact support."}
                  </p>
                  {selectedLocation && (
                    <div className="empty-state-actions">
                      <button 
                        className="btn-primary"
                        onClick={handleClearLocationFilter}
                      >
                        🌍 Show All Tours
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        🔍 Search Different Location
                      </button>
                    </div>
                  )}
                </div>
              )}

            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Tours;