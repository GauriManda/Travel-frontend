import React, { useState, useEffect, useRef } from 'react';
import { BASE_URL } from '../utils/config';
import useFetch from '../hooks/useFetch';
import './MapIntegration.css';

const MapIntegration = ({ onLocationSelect, onSearchStateChange, onToursFiltered }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(null);
  const [filteredTours, setFilteredTours] = useState([]);
  const [isSearchingTours, setIsSearchingTours] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Fetch all tours data for filtering
  const { data: allTours, loading: toursLoading } = useFetch(`${BASE_URL}/tours`);

  // Enhanced tour filtering with multiple search strategies
  const filterToursByLocation = async (location) => {
    if (!allTours || !Array.isArray(allTours) || allTours.length === 0) {
      console.log('No tours data available for filtering');
      return [];
    }

    setIsSearchingTours(true);
    
    try {
      const searchLat = location.lat;
      const searchLng = location.lng;
      const searchLocationName = location.display_name.toLowerCase();
      
      // Extract search terms from the selected location
      const locationParts = searchLocationName.split(',').map(part => part.trim().toLowerCase());
      const mainLocation = locationParts[0]; // Primary location name
      const country = locationParts[locationParts.length - 1]; // Usually country
      const state = locationParts[locationParts.length - 2]; // Usually state/region
      
      console.log('Searching for tours with:', {
        mainLocation,
        state,
        country,
        coordinates: [searchLat, searchLng]
      });

      // Filter tours using multiple matching strategies
      const matchingTours = allTours.filter(tour => {
        if (!tour) return false;

        // Get tour location data (adapt these field names to your database schema)
        const tourCity = (tour.city || '').toLowerCase();
        const tourLocation = (tour.location || '').toLowerCase();
        const tourTitle = (tour.title || '').toLowerCase();
        const tourAddress = (tour.address || '').toLowerCase();
        const tourDescription = (tour.description || '').toLowerCase();
        const tourDestination = (tour.destination || '').toLowerCase();
        const tourState = (tour.state || '').toLowerCase();
        const tourCountry = (tour.country || '').toLowerCase();
        const tourTags = (tour.tags || []).map(tag => tag.toLowerCase());
        
        // Strategy 1: Direct exact matches
        const directMatches = [
          tourCity === mainLocation,
          tourLocation === mainLocation,
          tourDestination === mainLocation,
          tourState === mainLocation,
          mainLocation.includes(tourCity) && tourCity.length > 2,
          mainLocation.includes(tourLocation) && tourLocation.length > 2,
          mainLocation.includes(tourDestination) && tourDestination.length > 2
        ];
        
        if (directMatches.some(match => match)) {
          console.log('Direct match found:', tour.title);
          return true;
        }

        // Strategy 2: Partial matches in title and description
        const searchTerms = [mainLocation, ...locationParts.filter(part => part.length > 2)];
        const partialMatches = searchTerms.some(term => 
          tourTitle.includes(term) || 
          tourDescription.includes(term) ||
          tourAddress.includes(term) ||
          tourTags.some(tag => tag.includes(term) || term.includes(tag))
        );
        
        if (partialMatches) {
          console.log('Partial match found:', tour.title);
          return true;
        }

        // Strategy 3: Regional/State matching
        if (state && state.length > 2) {
          const stateMatches = [
            tourState.includes(state),
            state.includes(tourState) && tourState.length > 2,
            tourCity.includes(state),
            tourLocation.includes(state),
            tourTitle.includes(state),
            tourDescription.includes(state)
          ];
          
          if (stateMatches.some(match => match)) {
            console.log('State match found:', tour.title);
            return true;
          }
        }

        // Strategy 4: Coordinate-based matching (if tour has coordinates)
        if (tour.coordinates && tour.coordinates.lat && tour.coordinates.lng) {
          const distance = calculateDistance(
            searchLat, 
            searchLng, 
            tour.coordinates.lat, 
            tour.coordinates.lng
          );
          
          if (distance <= 150) { // Within 150km radius
            console.log('Coordinate match found:', tour.title, `(${distance.toFixed(2)}km away)`);
            return true;
          }
        }

        // Strategy 5: Popular destinations and regional keywords
        const popularDestinations = {
          'himachal': ['himachal pradesh', 'manali', 'shimla', 'dharamshala', 'kullu', 'spiti', 'kasol', 'mcleodganj'],
          'uttarakhand': ['uttarakhand', 'rishikesh', 'haridwar', 'dehradun', 'nainital', 'mussoorie', 'kedarnath', 'badrinath', 'chopta'],
          'kashmir': ['kashmir', 'srinagar', 'gulmarg', 'pahalgam', 'jammu', 'sonamarg', 'dal lake'],
          'ladakh': ['ladakh', 'leh', 'nubra valley', 'pangong tso', 'magnetic hill', 'khardung la'],
          'sikkim': ['sikkim', 'gangtok', 'pelling', 'yuksom', 'nathu la', 'tsomgo lake'],
          'maharashtra': ['maharashtra', 'mumbai', 'pune', 'nashik', 'aurangabad', 'lonavala', 'mahabaleshwar'],
          'karnataka': ['karnataka', 'bangalore', 'mysore', 'coorg', 'hampi', 'gokarna', 'chikmagalur'],
          'kerala': ['kerala', 'kochi', 'munnar', 'alleppey', 'thekkady', 'wayanad', 'kovalam'],
          'tamil nadu': ['tamil nadu', 'chennai', 'ooty', 'kodaikanal', 'madurai', 'rameswaram', 'kanyakumari'],
          'rajasthan': ['rajasthan', 'jaipur', 'udaipur', 'jodhpur', 'jaisalmer', 'pushkar', 'mount abu'],
          'goa': ['goa', 'panaji', 'margao', 'anjuna', 'calangute', 'baga', 'arambol'],
          'west bengal': ['west bengal', 'kolkata', 'darjeeling', 'kalimpong', 'sundarbans', 'digha'],
          'andhra pradesh': ['andhra pradesh', 'hyderabad', 'visakhapatnam', 'tirupati', 'vijayawada'],
          'telangana': ['telangana', 'hyderabad', 'warangal', 'nizamabad']
        };

        // Check for regional matches
        for (const [region, keywords] of Object.entries(popularDestinations)) {
          const regionMatches = keywords.some(keyword => 
            mainLocation.includes(keyword) || 
            keyword.includes(mainLocation) ||
            locationParts.some(part => part.includes(keyword) || keyword.includes(part))
          );
          
          if (regionMatches) {
            const tourMatches = keywords.some(keyword => 
              tourCity.includes(keyword) || 
              tourLocation.includes(keyword) || 
              tourTitle.includes(keyword) || 
              tourDescription.includes(keyword) ||
              tourDestination.includes(keyword) ||
              tourState.includes(keyword) ||
              tourTags.some(tag => tag.includes(keyword))
            );
            
            if (tourMatches) {
              console.log('Regional match found:', tour.title, 'for region:', region);
              return true;
            }
          }
        }

        // Strategy 6: Fuzzy matching for common misspellings and variations
        const commonVariations = {
          'himachal': ['himachal pradesh', 'hp'],
          'uttarakhand': ['uttrakhand', 'uk'],
          'kashmir': ['jammu and kashmir', 'j&k'],
          'tamil nadu': ['tamilnadu', 'tn'],
          'west bengal': ['westbengal', 'wb'],
          'andhra pradesh': ['andhrapradesh', 'ap'],
          'madhya pradesh': ['madhyapradesh', 'mp'],
          'uttar pradesh': ['uttarpradesh', 'up']
        };

        for (const [standard, variations] of Object.entries(commonVariations)) {
          const searchMatches = variations.some(variation => 
            mainLocation.includes(variation) || 
            variation.includes(mainLocation)
          );
          
          if (searchMatches) {
            const tourMatches = [standard, ...variations].some(term => 
              tourCity.includes(term) || 
              tourLocation.includes(term) || 
              tourTitle.includes(term) || 
              tourDescription.includes(term) ||
              tourState.includes(term)
            );
            
            if (tourMatches) {
              console.log('Variation match found:', tour.title);
              return true;
            }
          }
        }

        return false;
      });

      // Sort results by relevance
      const sortedTours = matchingTours.sort((a, b) => {
        // Calculate relevance scores
        const getRelevanceScore = (tour) => {
          let score = 0;
          const tourCity = (tour.city || '').toLowerCase();
          const tourLocation = (tour.location || '').toLowerCase();
          const tourTitle = (tour.title || '').toLowerCase();
          const tourDestination = (tour.destination || '').toLowerCase();
          
          // Exact matches get highest score
          if (tourCity === mainLocation || tourLocation === mainLocation || tourDestination === mainLocation) {
            score += 100;
          }
          
          // Partial matches in title get high score
          if (tourTitle.includes(mainLocation)) {
            score += 50;
          }
          
          // Location field matches
          if (tourCity.includes(mainLocation) || tourLocation.includes(mainLocation)) {
            score += 30;
          }
          
          // Coordinate proximity (if available)
          if (tour.coordinates && tour.coordinates.lat && tour.coordinates.lng) {
            const distance = calculateDistance(
              searchLat, searchLng, 
              tour.coordinates.lat, tour.coordinates.lng
            );
            score += Math.max(0, 50 - distance); // Closer tours get higher scores
          }
          
          return score;
        };
        
        const scoreA = getRelevanceScore(a);
        const scoreB = getRelevanceScore(b);
        
        if (scoreA !== scoreB) {
          return scoreB - scoreA; // Higher score first
        }
        
        // If scores are equal, sort by price (lower first)
        return (a.price || 0) - (b.price || 0);
      });

      console.log(`Found ${sortedTours.length} tours for location: ${location.display_name}`);
      
      // Log first few matches for debugging
      if (sortedTours.length > 0) {
        console.log('Top matches:', sortedTours.slice(0, 3).map(tour => ({
          title: tour.title,
          city: tour.city,
          location: tour.location,
          price: tour.price
        })));
      }
      
      return sortedTours;
      
    } catch (error) {
      console.error('Error filtering tours:', error);
      return [];
    } finally {
      setIsSearchingTours(false);
    }
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  // Free geocoding using OpenStreetMap Nominatim
  const geocodeLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Enhance search query for better results in Indian context
      const enhancedQuery = query.includes('india') ? query : `${query} india`;
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enhancedQuery)}&limit=8&addressdetails=1&countrycodes=in`,
        {
          headers: {
            'User-Agent': 'TourApp/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }
      
      const data = await response.json();
      
      // If no results with India filter, try without it
      let finalData = data;
      if (data.length === 0 && query.includes('india')) {
        const fallbackResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'TourApp/1.0'
            }
          }
        );
        
        if (fallbackResponse.ok) {
          finalData = await fallbackResponse.json();
        }
      }
      
      const formattedResults = finalData.map(item => ({
        place_id: item.place_id,
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type,
        importance: item.importance,
        address: item.address
      }));
      
      // Sort by importance and relevance
      const sortedResults = formattedResults.sort((a, b) => {
        // Prioritize Indian locations
        const aIsIndia = a.display_name.toLowerCase().includes('india');
        const bIsIndia = b.display_name.toLowerCase().includes('india');
        
        if (aIsIndia && !bIsIndia) return -1;
        if (!aIsIndia && bIsIndia) return 1;
        
        // Then by importance
        return (b.importance || 0) - (a.importance || 0);
      });
      
      setSearchResults(sortedResults);
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Unable to search locations. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
      onSearchStateChange?.(false);
    }
  };

  // Handle search input with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        onSearchStateChange?.(true);
        geocodeLocation(value);
      } else {
        setSearchResults([]);
        setFilteredTours([]);
        onSearchStateChange?.(false);
        onToursFiltered?.([]);
      }
    }, 500);
  };

  // Handle location selection
  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    setSearchTerm(location.display_name);
    setSearchResults([]);
    onLocationSelect?.(location);
    
    // Filter tours based on selected location
    const filtered = await filterToursByLocation(location);
    setFilteredTours(filtered);
    onToursFiltered?.(filtered);
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    onSearchStateChange?.(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            {
              headers: {
                'User-Agent': 'TourApp/1.0'
              }
            }
          );
          
          const data = await response.json();
          
          const currentLocation = {
            place_id: data.place_id || 'current',
            display_name: data.display_name || `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            lat: lat,
            lng: lng,
            type: 'current_location',
            address: data.address
          };
          
          await handleLocationSelect(currentLocation);
        } catch (err) {
          const currentLocation = {
            place_id: 'current',
            display_name: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            lat: lat,
            lng: lng,
            type: 'current_location'
          };
          
          await handleLocationSelect(currentLocation);
        }
        
        setIsLoading(false);
        onSearchStateChange?.(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Unable to get your current location.');
        setIsLoading(false);
        onSearchStateChange?.(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedLocation(null);
    setFilteredTours([]);
    setError(null);
    onLocationSelect?.(null);
    onToursFiltered?.([]);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="map-integration">
          <div className="search-header">
            <h4 className="mb-3">🗺️ Find Your Destination</h4>
            <p className="text-muted mb-4">
              Search for cities, states, landmarks, or addresses to find tours in that area. 
              Our smart search matches tours by location, coordinates, and regional keywords.
            </p>
          </div>

          <div className="search-controls">
            <div className="search-input-group">
              <div className="search-input-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search destinations (e.g., Himachal Pradesh, Manali, Kashmir, Uttarakhand...)"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  disabled={isLoading}
                />
                {searchTerm && (
                  <button 
                    className="clear-btn"
                    onClick={clearSearch}
                    type="button"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <button
                className="current-location-btn"
                onClick={getCurrentLocation}
                disabled={isLoading}
                title="Use current location"
              >
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  '📍 '
                )}
                Current Location
              </button>
            </div>

            {error && (
              <div className="error-alert">
                <small>⚠️ {error}</small>
                <button 
                  className="btn btn-sm btn-outline-secondary ms-2"
                  onClick={() => setError(null)}
                >
                  Dismiss
                </button>
              </div>
            )}

            {(isLoading || isSearchingTours) && (
              <div className="loading-container">
                <div className="loading-spinner-large"></div>
                <p className="loading-text">
                  {isSearchingTours 
                    ? 'Analyzing tours database for matching destinations...' 
                    : 'Searching for locations...'}
                </p>
                {isSearchingTours && (
                  <small className="text-muted">
                    Checking location names, coordinates, and regional keywords
                  </small>
                )}
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="search-results mt-3">
                <h6 className="results-header">📍 Select a destination:</h6>
                <div className="results-list">
                  {searchResults.map((result) => (
                    <div
                      key={result.place_id}
                      className="result-item"
                      onClick={() => handleLocationSelect(result)}
                    >
                      <div className="result-content">
                        <div className="result-name">
                          <strong>{result.display_name.split(',')[0]}</strong>
                          {result.address?.state && (
                            <span className="badge bg-light text-dark ms-2">
                              {result.address.state}
                            </span>
                          )}
                        </div>
                        <div className="result-address">
                          {result.display_name}
                        </div>
                        <div className="result-coords">
                          📍 {result.lat.toFixed(4)}, {result.lng.toFixed(4)}
                          {result.type && (
                            <span className="ms-2 text-muted">({result.type})</span>
                          )}
                        </div>
                      </div>
                      <div className="result-arrow">→</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedLocation && (
              <div className="selected-location">
                <div className="success-alert">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6>✅ Selected Destination</h6>
                      <div className="location-details">
                        <strong>{selectedLocation.display_name.split(',')[0]}</strong>
                        {selectedLocation.address?.state && (
                          <span className="badge bg-success ms-2">
                            {selectedLocation.address.state}
                          </span>
                        )}
                        <br />
                        <small>
                          {selectedLocation.display_name}
                          <br />
                          📍 Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                        </small>
                      </div>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={clearSearch}
                      title="Clear selection"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Tours Found Section */}
                  <div className="tours-found-section mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="tours-count">
                        <strong>🎯 {filteredTours.length} Tour(s) Found</strong>
                      </div>
                      {filteredTours.length > 0 && (
                        <span className="badge bg-primary">
                          {filteredTours.length} matches
                        </span>
                      )}
                    </div>
                    
                    {filteredTours.length > 0 ? (
                      <div className="tours-preview mt-2">
                        <small className="text-muted">🏔️ Available tours:</small>
                        <div className="tours-grid mt-2">
                          {filteredTours.slice(0, 4).map(tour => (
                            <div key={tour._id} className="tour-preview-card">
                              <div className="tour-preview-content">
                                <div className="tour-name">{tour.title}</div>
                                <div className="tour-location">
                                  📍 {tour.city || tour.location || 'Location TBD'}
                                </div>
                                <div className="tour-price">
                                  💰 ${tour.price || 'Price on request'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {filteredTours.length > 4 && (
                          <div className="more-tours-info mt-2">
                            <small className="text-muted">
                              <strong>+{filteredTours.length - 4} more tours</strong> available.
                              Scroll down to see all results.
                            </small>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="no-tours-found mt-2">
                        <small className="text-muted">
                          ℹ️ No tours found for this specific location. 
                          Try searching for a nearby city or popular destination.
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {searchTerm && !isLoading && searchResults.length === 0 && !error && !selectedLocation && (
              <div className="no-results">
                <div className="info-alert">
                  <div className="d-flex align-items-center">
                    <span className="me-2">🔍</span>
                    <div>
                      <small>
                        <strong>No locations found for "{searchTerm}"</strong>
                        <br />
                        Try searching for:
                        <br />
                        • Popular destinations (Himachal Pradesh, Kashmir, Uttarakhand)
                        <br />
                        • City names (Manali, Rishikesh, Srinagar)
                        <br />
                        • State names or landmarks
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Popular Destinations Quick Access */}
          <div className="popular-destinations mt-4">
            <h6 className="mb-3">🔥 Popular Destinations</h6>
            <div className="destination-tags">
              {[
                'Himachal Pradesh',
                'Uttarakhand', 
                'Kashmir',
                'Ladakh',
                'Kerala',
                'Rajasthan',
                'Goa',
                'Karnataka'
              ].map(destination => (
                <button
                  key={destination}
                  className="destination-tag"
                  onClick={() => {
                    setSearchTerm(destination);
                    geocodeLocation(destination);
                  }}
                  disabled={isLoading}
                >
                  {destination}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapIntegration;