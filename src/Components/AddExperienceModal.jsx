import React, { useState } from 'react';
import { X, Upload, MapPin, Calendar, Users, DollarSign, Tag, Loader2 } from 'lucide-react';
import './AddExperienceModal.css';

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
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = [
    'adventure', 'cultural', 'nature', 'food', 'photography', 
    'solo-travel', 'family', 'romantic', 'budget', 'luxury'
  ];

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_FILES = 10;
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `${file.name}: Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.`;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name}: File too large. Maximum size is 5MB.`;
    }
    
    return null;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Check total file limit
    if (imageFiles.length + files.length > MAX_FILES) {
      alert(`You can only upload up to ${MAX_FILES} images total.`);
      return;
    }

    const validFiles = [];
    const errors = [];

    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert('Some files were rejected:\n' + errors.join('\n'));
    }

    if (validFiles.length === 0) return;

    // Add valid files to state
    setImageFiles(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, {
          url: e.target.result,
          name: file.name,
          size: file.size
        }]);
      };
      reader.readAsDataURL(file);
    });

    // Clear the input so the same file can be selected again if needed
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const submitExperience = async (experienceData, files) => {
    const formDataToSend = new FormData();

    // Add all form fields
    Object.keys(experienceData).forEach(key => {
      if (key === 'itinerary' || key === 'categories') {
        formDataToSend.append(key, JSON.stringify(experienceData[key]));
      } else {
        formDataToSend.append(key, experienceData[key]);
      }
    });

    // Add image files
    files.forEach(file => {
      formDataToSend.append('images', file);
    });

    const response = await fetch('/api/v1/experiences', {
      method: 'POST',
      body: formDataToSend,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create experience');
    }

    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      alert('Please enter a title for your experience');
      return;
    }
    
    if (!formData.destination.trim()) {
      alert('Please enter a destination');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress (you can implement real progress tracking)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await submitExperience(formData, imageFiles);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Call the parent's onSubmit callback
      onSubmit(result.experience);
      
      // Close modal after short delay to show completion
      setTimeout(() => {
        onClose();
      }, 500);

    } catch (error) {
      console.error('Failed to submit experience:', error);
      alert('Failed to submit experience: ' + error.message);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const nextStep = () => {
    // Add validation for each step
    if (currentStep === 1) {
      if (!formData.title.trim() || !formData.destination.trim() || !formData.description.trim()) {
        alert('Please fill in all required fields');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="modal-overlay">
      <div className="add-experience-modal">
        <div className="modal-header">
          <h2>Share Your Travel Experience</h2>
          <button className="close-btn" onClick={onClose} disabled={isSubmitting}>
            <X size={24} />
          </button>
        </div>

        <div className="step-indicator">
          {[1, 2, 3, 4].map(step => (
            <div 
              key={step} 
              className={`step ${currentStep >= step ? 'active' : ''}`}
            >
              {step}
            </div>
          ))}
        </div>

        {isSubmitting && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p>Uploading experience... {uploadProgress}%</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="experience-form">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="form-step">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label>Experience Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Give your experience a catchy title"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <MapPin size={16} />
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
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Calendar size={16} />
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
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your experience in detail..."
                  rows="4"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <Users size={16} />
                    Group Size
                  </label>
                  <input
                    type="number"
                    name="groupSize"
                    value={formData.groupSize}
                    onChange={handleInputChange}
                    min="1"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <DollarSign size={16} />
                    Budget Range
                  </label>
                  <select
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    <option value="budget">Budget (Under 500Rs/day)</option>
                    <option value="mid-range">Mid-range (500-1500Rs/day)</option>
                    <option value="luxury">Luxury (1500Rs+/day)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Tag size={16} />
                  Categories
                </label>
                <div className="categories-grid">
                  {categories.map(category => (
                    <button
                      key={category}
                      type="button"
                      className={`category-btn ${formData.categories.includes(category) ? 'selected' : ''}`}
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

          {/* Step 2: Detailed Itinerary */}
          {currentStep === 2 && (
            <div className="form-step">
              <h3>Detailed Itinerary</h3>
              
              {formData.itinerary.map((day, index) => (
                <div key={index} className="itinerary-day">
                  <div className="day-header">
                    <h4>Day {day.day}</h4>
                    {formData.itinerary.length > 1 && (
                      <button
                        type="button"
                        className="remove-day-btn"
                        onClick={() => removeItineraryDay(index)}
                        disabled={isSubmitting}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Activities</label>
                    <textarea
                      value={day.activities}
                      onChange={(e) => handleItineraryChange(index, 'activities', e.target.value)}
                      placeholder="What did you do this day?"
                      rows="2"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Accommodation</label>
                      <input
                        type="text"
                        value={day.accommodation}
                        onChange={(e) => handleItineraryChange(index, 'accommodation', e.target.value)}
                        placeholder="Where did you stay?"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="form-group">
                      <label>Meals</label>
                      <input
                        type="text"
                        value={day.meals}
                        onChange={(e) => handleItineraryChange(index, 'meals', e.target.value)}
                        placeholder="Notable restaurants/food"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Notes</label>
                    <textarea
                      value={day.notes}
                      onChange={(e) => handleItineraryChange(index, 'notes', e.target.value)}
                      placeholder="Any additional notes or tips for this day"
                      rows="2"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="add-day-btn"
                onClick={addItineraryDay}
                disabled={isSubmitting}
              >
                Add Another Day
              </button>
            </div>
          )}

          {/* Step 3: Additional Details */}
          {currentStep === 3 && (
            <div className="form-step">
              <h3>Additional Details</h3>

              <div className="form-group">
                <label>Travel Tips</label>
                <textarea
                  name="tips"
                  value={formData.tips}
                  onChange={handleInputChange}
                  placeholder="Share your best tips for other travelers"
                  rows="4"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Best Time to Visit</label>
                  <input
                    type="text"
                    name="bestTimeToVisit"
                    value={formData.bestTimeToVisit}
                    onChange={handleInputChange}
                    placeholder="e.g., March to May"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label>Total Cost (USD)</label>
                  <input
                    type="number"
                    name="totalCost"
                    value={formData.totalCost}
                    onChange={handleInputChange}
                    placeholder="Approximate total cost"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Transportation</label>
                <textarea
                  name="transportation"
                  value={formData.transportation}
                  onChange={handleInputChange}
                  placeholder="How did you get around? Flights, trains, buses, etc."
                  rows="3"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {currentStep === 4 && (
            <div className="form-step">
              <h3>Photos</h3>
              
              <div className="image-upload-area">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  disabled={isSubmitting}
                />
                <label htmlFor="image-upload" className={`upload-label ${isSubmitting ? 'disabled' : ''}`}>
                  <Upload size={32} />
                  <span>Click to upload photos</span>
                  <small>Upload up to 10 photos (max 5MB each). Supported formats: JPEG, PNG, GIF, WebP</small>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="image-preview-grid">
                  {imagePreviews.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={image.url} alt={`Preview ${index + 1}`} />
                      <div className="image-info">
                        <span className="image-name">{image.name}</span>
                        <span className="image-size">{(image.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(index)}
                        disabled={isSubmitting}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="upload-info">
                <p>{imageFiles.length} / {MAX_FILES} images selected</p>
              </div>
            </div>
          )}

          <div className="form-actions">
            {currentStep > 1 && (
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={prevStep}
                disabled={isSubmitting}
              >
                Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button 
                type="button" 
                className="btn-primary" 
                onClick={nextStep}
                disabled={isSubmitting}
              >
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="spinning" />
                    Sharing Experience...
                  </>
                ) : (
                  'Share Experience'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExperienceModal;