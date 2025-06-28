import React, { useState, useEffect, useCallback } from 'react';
import { Plus, MapPin, Calendar, Users, Star, Heart, Share2, Filter, Search, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import ExperienceCard from './ExperienceCard';
import AddExperienceModal from './AddExperienceModal';
import ExperienceDetail from './ExperienceDetail';
import { useAuth } from '../context/AuthContext'; // Import the auth context
import './Experience.css';

const Experience = () => {
  // Get auth state from context
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  
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

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Retry fetching if we were offline
      if (experiences.length === 0 && !loading) {
        fetchExperiences();
      }
      // Re-check auth status when coming back online
      if (!isLoggedIn && !authLoading) {
        // Auth context will handle this automatically
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [experiences.length, loading, isLoggedIn, authLoading]);

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
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        signal: AbortSignal.timeout(10000)
      });
      
      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        const responseText = await response.text();
        
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
      
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON but got ${contentType}. Response: ${responseText.substring(0, 200)}...`);
      }
      
      const data = JSON.parse(responseText);
      
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
        
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to fetch experiences');
      }
    } catch (error) {
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

  const handleAddExperience = (createdExperienceData) => {
    try {
      // The experience is already created by AddExperienceModal
      // We just need to add it to our local state
      const experienceToAdd = createdExperienceData.data || 
                             createdExperienceData.experience || 
                             createdExperienceData;
      
      // Add the new experience to the beginning of the list
      setExperiences(prev => [experienceToAdd, ...prev]);
      setTotalExperiences(prev => prev + 1);
      
      // Close the modal
      setShowAddModal(false);
      
      // Clear any previous errors
      setError(null);
      
    } catch (error) {
      setError('Failed to add experience to the list');
    }
  };

  // Handle share experience button click
  const handleShareExperienceClick = () => {
    // Debug log
    console.log('Share button clicked', { authLoading, isLoggedIn, isOnline, user });
    
    // If still checking authentication, do nothing
    if (authLoading) {
      console.log('Still loading auth status...');
      return;
    }
    
    if (!isLoggedIn) {
      console.log('User not authenticated, redirecting to login');
      alert('Please log in to share your travel experience!');
      // Redirect to login page
      window.location.href = '/login';
      return;
    }
    
    console.log('Opening add experience modal');
    setShowAddModal(true);
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
  if ((loading && experiences.length === 0) || authLoading) {
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
        </div>
        <button 
          className="add-experience-btn"
          onClick={handleShareExperienceClick}
          disabled={!isOnline || authLoading}
        >
          <Plus size={20} />
          {authLoading ? 'Loading...' : 'Share Your Experience'}
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
        />
      )}
    </div>
  );
};

export default Experience;