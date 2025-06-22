import React, { useState, useEffect, useCallback } from 'react';
import { Plus, MapPin, Calendar, Users, Star, Heart, Share2, Filter, Search, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import ExperienceCard from './ExperienceCard';
import AddExperienceModal from './AddExperienceModal';
import ExperienceDetail from './ExperienceDetail';
import './Experience.css';

const Experience = () => {
  // State management
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExperiences, setTotalExperiences] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Network status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;


  // Debug logging
  console.log('🌐 Using API URL:', API_BASE_URL);
  console.log('🔧 Environment variables:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    NODE_ENV: import.meta.env.NODE_ENV
  });

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🌐 Connection restored');
      // Retry fetching if we were offline
      if (experiences.length === 0 && !loading) {
        fetchExperiences();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('📵 Connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [experiences.length, loading]);

  // Fetch experiences with improved error handling
 const fetchExperiences = useCallback(async (page = 1, append = false) => {
  try {
    if (!append) {
      setLoading(true);
      setError(null);
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: '12',
      ...(filterBy !== 'all' && { category: filterBy }),
      ...(searchTerm && { search: searchTerm }),
      sortBy: sortBy
    }).toString();

    const url = `${API_BASE_URL}/experiences?${queryParams}`;
    console.log('🔄 Fetching experiences from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal: AbortSignal.timeout(10000)
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const contentType = response.headers.get('content-type');
    console.log('📄 Content-Type:', contentType);
    
    if (!response.ok) {
      const responseText = await response.text();
      console.log('❌ Error response body:', responseText);
      
      let errorMessage = `HTTP ${response.status}`;
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = responseText || response.statusText || errorMessage;
        }
      } else {
        errorMessage = responseText || response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    const responseText = await response.text();
    console.log('✅ Response text preview:', responseText.substring(0, 200));
    
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Expected JSON but got ${contentType}. Response: ${responseText.substring(0, 200)}...`);
    }
    
    const data = JSON.parse(responseText);
    console.log('📄 Parsed response data:', data);
    
    if (data.success) {
      const newExperiences = data.experiences || [];
      const pagination = data.pagination || {};
      
      if (append) {
        setExperiences(prev => [...prev, ...newExperiences]);
      } else {
        setExperiences(newExperiences);
      }
      
      setCurrentPage(pagination.currentPage || page);
      setTotalPages(pagination.totalPages || 1);
      setTotalExperiences(pagination.totalExperiences || newExperiences.length);
      setHasMore(pagination.hasNext || false);
      
      console.log('✅ Successfully loaded', newExperiences.length, 'experiences');
      setError(null);
    } else {
      throw new Error(data.message || 'Failed to fetch experiences');
    }
  } catch (error) {
    console.error('💥 Error fetching experiences:', error);
    
    let errorMessage = 'Something went wrong!';
    
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      errorMessage = 'Request timed out. Please check your internet connection.';
    } else if (error.message.includes('Failed to fetch') || !isOnline) {
      errorMessage = 'Unable to connect to server. Please check your internet connection.';
    } else if (error.message.includes('404')) {
      errorMessage = 'Service not found. Please check your API URL configuration.';
    } else if (error.message.includes('500')) {
      errorMessage = 'Server error. Please try again later.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    setError(errorMessage);
    
    if (!append) {
      setExperiences([]);
    }
  } finally {
    setLoading(false);
  }
}, [API_BASE_URL, filterBy, searchTerm, sortBy, isOnline]);
  // Initial load
  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  // Handle search and filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchExperiences(1, false);
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterBy, sortBy]);

  // Enhanced handleAddExperience function with better error debugging
const handleAddExperience = async (experienceData) => {
  try {
    console.log('🚀 Starting to add experience:', experienceData);
    setError(null);
    
    // Create FormData for file upload
    const formData = new FormData();
    
    // Append all experience data
    Object.keys(experienceData).forEach(key => {
      if (key === 'images' && experienceData[key]) {
        console.log(`📷 Adding ${experienceData[key].length} images`);
        for (let i = 0; i < experienceData[key].length; i++) {
          formData.append('images', experienceData[key][i]);
        }
      } else if (key === 'itinerary' || key === 'categories') {
        const jsonData = JSON.stringify(experienceData[key]);
        console.log(`📝 Adding ${key}:`, jsonData);
        formData.append(key, jsonData);
      } else if (experienceData[key] !== undefined && experienceData[key] !== null) {
        console.log(`📋 Adding ${key}:`, experienceData[key]);
        formData.append(key, experienceData[key]);
      }
    });

    const submitUrl = `${API_BASE_URL}/experiences`;
    console.log('🌐 Making request to:', submitUrl);
    
    const response = await fetch(submitUrl, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      signal: AbortSignal.timeout(30000) // 30 second timeout for uploads
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Check the content type to see if we're getting HTML instead of JSON
    const contentType = response.headers.get('content-type');
    console.log('📄 Content-Type:', contentType);
    
    if (!response.ok) {
      // Get the response text first to see what we're actually receiving
      const responseText = await response.text();
      console.log('❌ Error response body:', responseText);
      
      let errorMessage = `HTTP ${response.status}`;
      
      // Try to parse as JSON if it looks like JSON
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
          if (errorData.errors) {
            errorMessage = errorData.errors.join(', ');
          }
        } catch (e) {
          console.log('Failed to parse error response as JSON:', e);
          errorMessage = responseText || response.statusText || errorMessage;
        }
      } else {
        // If it's HTML or plain text, use it directly (but truncate if too long)
        errorMessage = responseText.length > 200 
          ? responseText.substring(0, 200) + '...' 
          : responseText || response.statusText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
    
    // Check if response is actually JSON before parsing
    const responseText = await response.text();
    console.log('✅ Response text:', responseText);
    
    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ Expected JSON but got:', contentType);
      throw new Error(`Server returned ${contentType || 'unknown content type'} instead of JSON. Response: ${responseText.substring(0, 200)}...`);
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Parsed response data:', data);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      console.error('❌ Response text was:', responseText);
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
    }
    
    if (data.success) {
      // Add new experience to the beginning of the list
      setExperiences(prev => [data.experience, ...prev]);
      setShowAddModal(false);
      setTotalExperiences(prev => prev + 1);
      console.log('🎉 Experience added successfully!');
    } else {
      throw new Error(data.message || 'Failed to add experience');
    }
  } catch (error) {
    console.error('💥 Error adding experience:', error);
    
    let errorMessage = 'Failed to add experience!';
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      errorMessage = 'Upload timed out. Please try again.';
    } else if (error.message.includes('Failed to fetch') || !isOnline) {
      errorMessage = 'Cannot connect to server. Please check your internet connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    setError(errorMessage);
  }
};
  // Handle like/unlike experience
  const handleLikeExperience = async (experienceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/experiences/${experienceId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'current-user-id' }), // Replace with actual user ID
        credentials: 'include',
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setExperiences(experiences.map(exp => 
          exp._id === experienceId 
            ? { ...exp, likes: data.likes, isLiked: data.isLiked }
            : exp
        ));
      } else {
        throw new Error(data.message || 'Failed to like experience');
      }
    } catch (error) {
      console.error('Error liking experience:', error);
      // You might want to show a toast notification here
    }
  };

  // Load more experiences (pagination)
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchExperiences(currentPage + 1, true);
    }
  };

  // Filter and sort experiences
  const filteredAndSortedExperiences = experiences.filter(exp => {
    const matchesSearch = exp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'budget') return matchesSearch && exp.budgetRange === 'budget';
    if (filterBy === 'luxury') return matchesSearch && exp.budgetRange === 'luxury';
    if (filterBy === 'adventure') return matchesSearch && exp.categories?.includes('adventure');
    if (filterBy === 'cultural') return matchesSearch && exp.categories?.includes('cultural');
    
    return matchesSearch;
  });

  // Loading state
  if (loading && experiences.length === 0) {
    return (
      <div className="experience-loading">
        <div className="loading-spinner"></div>
        <p>Loading travel experiences...</p>
      </div>
    );
  }

  return (
    <div className="experience-container">
      {/* Connection status indicator */}
      {!isOnline && (
        <div className="connection-status offline">
          <WifiOff size={16} />
          <span>You're offline. Some features may not work.</span>
        </div>
      )}

      {/* Header */}
      <div className="experience-header">
        <div className="header-content">
          <h1>Travel Experiences</h1>
          <p>Discover amazing travel stories and itineraries from fellow travelers</p>
          {totalExperiences > 0 && (
            <span className="experience-count">{totalExperiences} experiences shared</span>
          )}
        </div>
        <button 
          className="add-experience-btn"
          onClick={() => setShowAddModal(true)}
          disabled={!isOnline}
        >
          <Plus size={20} />
          Share Your Experience
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => fetchExperiences()} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="experience-filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search destinations, experiences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select 
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="adventure">Adventure</option>
            <option value="cultural">Cultural</option>
            <option value="budget">Budget Travel</option>
            <option value="luxury">Luxury Travel</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Experiences grid */}
      <div className="experiences-grid">
        {filteredAndSortedExperiences.length === 0 ? (
          <div className="no-experiences">
            <h3>No experiences found</h3>
            <p>
              {experiences.length === 0 && !error
                ? "Be the first to share your travel story!" 
                : "Try adjusting your search or filters."}
            </p>
            {error && (
              <button onClick={() => fetchExperiences()} className="retry-btn">
                Try Again
              </button>
            )}
          </div>
        ) : (
          <>
            {filteredAndSortedExperiences.map(experience => (
              <ExperienceCard
                key={experience._id}
                experience={experience}
                onLike={handleLikeExperience}
                onClick={() => setSelectedExperience(experience)}
              />
            ))}
          </>
        )}
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="load-more-container">
          <button 
            onClick={handleLoadMore} 
            disabled={loading}
            className="load-more-btn"
          >
            {loading ? 'Loading...' : 'Load More Experiences'}
          </button>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddExperienceModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddExperience}
        />
      )}

      {selectedExperience && (
        <ExperienceDetail
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
          onLike={handleLikeExperience}
        />
      )}
    </div>
  );
};

export default Experience;