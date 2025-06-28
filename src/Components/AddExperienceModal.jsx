import React, { useState } from 'react';
import { X, MapPin, Calendar, Users, DollarSign, Tag, Loader2, AlertCircle } from 'lucide-react';

const AddExperienceModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    description: '',
    duration: '',
    groupSize: '',
    budgetRange: 'mid-range',
    categories: [],
    itinerary: [{ day: 1, activities: '', accommodation: '', meals: '', notes: '' }],
    tips: '',
    bestTimeToVisit: '',
    transportation: '',
    totalCost: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Get API URL from environment
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const categories = [
    'adventure', 'cultural', 'nature', 'food', 'photography', 
    'solo-travel', 'family', 'romantic', 'budget', 'luxury'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleItineraryChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, {
        day: prev.itinerary.length + 1,
        activities: '',
        accommodation: '',
        meals: '',
        notes: ''
      }]
    }));
  };

  const removeItineraryDay = (index) => {
    if (formData.itinerary.length > 1) {
      setFormData(prev => ({
        ...prev,
        itinerary: prev.itinerary.filter((_, i) => i !== index)
          .map((item, i) => ({ ...item, day: i + 1 }))
      }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setSubmitError('Title is required');
      return false;
    }
    if (!formData.destination.trim()) {
      setSubmitError('Destination is required');
      return false;
    }
    if (!formData.description.trim()) {
      setSubmitError('Description is required');
      return false;
    }
    if (!formData.duration || parseInt(formData.duration) < 1) {
      setSubmitError('Duration must be at least 1 day');
      return false;
    }
    
    const hasValidItinerary = formData.itinerary.some(day => day.activities && day.activities.trim());
    if (!hasValidItinerary) {
      setSubmitError('Please add activities for at least one day');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Prepare the data according to your backend API structure
      const experienceData = {
        title: formData.title.trim(),
        destination: formData.destination.trim(),
        description: formData.description.trim(),
        duration: parseInt(formData.duration),
        groupSize: parseInt(formData.groupSize) || 1,
        budgetRange: formData.budgetRange,
        categories: formData.categories,
        tips: formData.tips.trim() || undefined,
        bestTimeToVisit: formData.bestTimeToVisit.trim() || undefined,
        transportation: formData.transportation.trim() || undefined,
        totalCost: formData.totalCost ? parseFloat(formData.totalCost) : undefined,
        // Filter out empty itinerary days and format properly
        itinerary: formData.itinerary
          .filter(day => day.activities && day.activities.trim())
          .map((day, index) => ({
            day: index + 1,
            activities: day.activities.trim(),
            accommodation: day.accommodation.trim() || undefined,
            meals: day.meals.trim() || undefined,
            notes: day.notes.trim() || undefined
          })),
        // Add some default values that your backend might expect
        author: {
          name: 'Anonymous User',
          avatar: '/api/placeholder/32/32'
        },
        images: [], // Empty array since we're not handling image uploads
        rating: 0, // Default rating
        likes: 0,
        isLiked: false
      };

      console.log('🚀 Submitting experience data:', experienceData);

      const response = await fetch(`${API_BASE_URL}/experiences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(experienceData)
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Experience created successfully:', result);

      // Call the onSubmit callback with the created experience
      if (onSubmit) {
        // Pass the created experience data to the parent component
        onSubmit(result);
      }

      // Close the modal
      onClose();

    } catch (error) {
      console.error('💥 Error creating experience:', error);
      
      let errorMessage = 'Failed to create experience. ';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage += 'Please check your internet connection.';
      } else if (error.message.includes('404')) {
        errorMessage += 'API endpoint not found. Please check your configuration.';
      } else if (error.message.includes('500')) {
        errorMessage += 'Server error. Please try again later.';
      } else {
        errorMessage += error.message;
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.title.trim() || !formData.destination.trim() || !formData.description.trim()) {
        setSubmitError('Please fill in all required fields');
        return;
      }
    }
    
    if (currentStep === 2) {
      const hasValidItinerary = formData.itinerary.some(day => day.activities && day.activities.trim());
      if (!hasValidItinerary) {
        setSubmitError('Please add activities for at least one day');
        return;
      }
    }
    
    setSubmitError('');
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setSubmitError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Share Your Travel Experience</h2>
          <button 
            style={styles.closeBtn} 
            onClick={onClose} 
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        <div style={styles.stepIndicator}>
          {[1, 2, 3].map(step => (
            <div 
              key={step} 
              style={{
                ...styles.step,
                ...(currentStep >= step ? styles.stepActive : {}),
                ...(currentStep === step ? styles.stepCurrent : {})
              }}
            >
              {step}
            </div>
          ))}
        </div>

        {/* Error Banner */}
        {submitError && (
          <div style={styles.errorBanner}>
            <AlertCircle size={20} />
            <span>{submitError}</span>
          </div>
        )}

        <div style={styles.formContainer}>
          {currentStep === 1 && (
            <div style={styles.formStep}>
              <h3 style={styles.stepTitle}>Basic Information</h3>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Experience Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Give your experience a catchy title"
                  required
                  disabled={isSubmitting}
                  style={styles.input}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.labelWithIcon}>
                    <MapPin size={16} style={styles.icon} />
                    Destination *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    required
                    disabled={isSubmitting}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.labelWithIcon}>
                    <Calendar size={16} style={styles.icon} />
                    Duration (days) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                    required
                    disabled={isSubmitting}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your experience in detail..."
                  rows="4"
                  required
                  disabled={isSubmitting}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.labelWithIcon}>
                    <Users size={16} style={styles.icon} />
                    Group Size
                  </label>
                  <input
                    type="number"
                    name="groupSize"
                    value={formData.groupSize}
                    onChange={handleInputChange}
                    min="1"
                    disabled={isSubmitting}
                    style={styles.input}
                    placeholder="1"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.labelWithIcon}>
                    <DollarSign size={16} style={styles.icon} />
                    Budget Range
                  </label>
                  <select
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    style={styles.select}
                  >
                    <option value="budget">Budget (Under ₹2000/day)</option>
                    <option value="mid-range">Mid-range (₹2000-6000/day)</option>
                    <option value="luxury">Luxury (₹6000+/day)</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.labelWithIcon}>
                  <Tag size={16} style={styles.icon} />
                  Categories
                </label>
                <div style={styles.categoriesGrid}>
                  {categories.map(category => (
                    <button
                      key={category}
                      type="button"
                      style={{
                        ...styles.categoryBtn,
                        ...(formData.categories.includes(category) ? styles.categoryBtnSelected : {})
                      }}
                      onClick={() => handleCategoryToggle(category)}
                      disabled={isSubmitting}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div style={styles.formStep}>
              <h3 style={styles.stepTitle}>Detailed Itinerary</h3>
              
              {formData.itinerary.map((day, index) => (
                <div key={index} style={styles.itineraryDay}>
                  <div style={styles.dayHeader}>
                    <h4 style={styles.dayTitle}>Day {day.day}</h4>
                    {formData.itinerary.length > 1 && (
                      <button
                        type="button"
                        style={styles.removeDayBtn}
                        onClick={() => removeItineraryDay(index)}
                        disabled={isSubmitting}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Activities *</label>
                    <textarea
                      value={day.activities}
                      onChange={(e) => handleItineraryChange(index, 'activities', e.target.value)}
                      placeholder="What did you do this day?"
                      rows="2"
                      disabled={isSubmitting}
                      style={styles.textarea}
                    />
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Accommodation</label>
                      <input
                        type="text"
                        value={day.accommodation}
                        onChange={(e) => handleItineraryChange(index, 'accommodation', e.target.value)}
                        placeholder="Where did you stay?"
                        disabled={isSubmitting}
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Meals</label>
                      <input
                        type="text"
                        value={day.meals}
                        onChange={(e) => handleItineraryChange(index, 'meals', e.target.value)}
                        placeholder="Notable restaurants/food"
                        disabled={isSubmitting}
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Notes</label>
                    <textarea
                      value={day.notes}
                      onChange={(e) => handleItineraryChange(index, 'notes', e.target.value)}
                      placeholder="Any additional notes or tips for this day"
                      rows="2"
                      disabled={isSubmitting}
                      style={styles.textarea}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                style={styles.addDayBtn}
                onClick={addItineraryDay}
                disabled={isSubmitting}
              >
                Add Another Day
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div style={styles.formStep}>
              <h3 style={styles.stepTitle}>Additional Details</h3>

              <div style={styles.formGroup}>
                <label style={styles.label}>Travel Tips</label>
                <textarea
                  name="tips"
                  value={formData.tips}
                  onChange={handleInputChange}
                  placeholder="Share your best tips for other travelers"
                  rows="4"
                  disabled={isSubmitting}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Best Time to Visit</label>
                  <input
                    type="text"
                    name="bestTimeToVisit"
                    value={formData.bestTimeToVisit}
                    onChange={handleInputChange}
                    placeholder="e.g., March to May"
                    disabled={isSubmitting}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Total Cost (₹)</label>
                  <input
                    type="number"
                    name="totalCost"
                    value={formData.totalCost}
                    onChange={handleInputChange}
                    placeholder="Approximate total cost"
                    disabled={isSubmitting}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Transportation</label>
                <textarea
                  name="transportation"
                  value={formData.transportation}
                  onChange={handleInputChange}
                  placeholder="How did you get around? Flights, trains, buses, etc."
                  rows="3"
                  disabled={isSubmitting}
                  style={styles.textarea}
                />
              </div>
            </div>
          )}

          <div style={styles.formActions}>
            {currentStep > 1 && (
              <button 
                type="button" 
                style={{
                  ...styles.btnSecondary,
                  ...(isSubmitting ? styles.btnDisabled : {})
                }}
                onClick={prevStep}
                disabled={isSubmitting}
              >
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button 
                type="button" 
                style={{
                  ...styles.btnPrimary,
                  ...(isSubmitting ? styles.btnDisabled : {}),
                  marginLeft: 'auto'
                }}
                onClick={nextStep}
                disabled={isSubmitting}
              >
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                style={{
                  ...styles.btnPrimary,
                  ...(isSubmitting ? styles.btnDisabled : {}),
                  marginLeft: 'auto'
                }}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span style={styles.btnContent}>
                    <Loader2 size={16} style={styles.spinner} />
                    Creating Experience...
                  </span>
                ) : (
                  'Share Experience'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    backdropFilter: 'blur(4px)',
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 30px',
    borderBottom: '1px solid #e9ecef',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '16px 16px 0 0',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  closeBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
  },
  stepIndicator: {
    display: 'flex',
    justifyContent: 'center',
    padding: '24px 30px',
    gap: '16px',
    background: '#f8f9fa',
    borderBottom: '1px solid #e9ecef',
  },
  step: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#dee2e6',
    color: '#6c757d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
  },
  stepActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    transform: 'scale(1.1)',
  },
  stepCurrent: {
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.3)',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#fee2e2',
    borderLeft: '4px solid #dc2626',
    color: '#991b1b',
    fontSize: '0.9rem',
  },
  formContainer: {
    padding: '30px',
  },
  formStep: {
    animation: 'stepFadeIn 0.3s ease-out',
  },
  stepTitle: {
    margin: '0 0 24px 0',
    color: '#1a1a1a',
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 500,
    color: '#374151',
    fontSize: '0.95rem',
  },
  labelWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
    fontWeight: 500,
    color: '#374151',
    fontSize: '0.95rem',
  },
  icon: {
    color: '#667eea',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    background: 'white',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    background: 'white',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    background: 'white',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '80px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '8px',
    marginTop: '8px',
  },
  categoryBtn: {
    padding: '8px 12px',
    border: '2px solid #e9ecef',
    background: 'white',
    borderRadius: '20px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'capitalize',
    fontWeight: 500,
    outline: 'none',
  },
  categoryBtnSelected: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderColor: '#667eea',
    color: 'white',
  },
  itineraryDay: {
    background: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
  },
  dayHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  dayTitle: {
    margin: 0,
    color: '#374151',
    fontSize: '1.1rem',
    fontWeight: 600,
  },
  removeDayBtn: {
    background: '#dc3545',
    border: 'none',
    color: 'white',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
    outline: 'none',
  },
  addDayBtn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '16px',
    outline: 'none',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e9ecef',
    gap: '16px',
  },
  btnPrimary: {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none',
    minWidth: '120px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    outline: 'none',
  },
  btnSecondary: {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid #e9ecef',
    minWidth: '120px',
    background: '#f8f9fa',
    color: '#374151',
    outline: 'none',
  },
  btnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  btnContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  },
};

export default AddExperienceModal;