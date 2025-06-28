import React, { useState } from 'react';
import { X, MapPin, Calendar, Users, Camera, Filter } from 'lucide-react';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const trekImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      title: 'Mountain Trek Adventure',
      location: 'Nepal Himalayas',
      date: 'March 2024',
      category: 'mountain',
      participants: 12
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
      title: 'Forest Trail Exploration',
      location: 'Western Ghats',
      date: 'February 2024',
      category: 'forest',
      participants: 8
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&h=600&fit=crop',
      title: 'Alpine Peak Expedition',
      location: 'Kashmir Valley',
      date: 'April 2024',
      category: 'mountain',
      participants: 15
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      title: 'Wilderness Camping',
      location: 'Uttarakhand',
      date: 'January 2024',
      category: 'camping',
      participants: 10
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=800&h=600&fit=crop',
      title: 'Cascade Falls Trek',
      location: 'Karnataka',
      date: 'December 2023',
      category: 'waterfall',
      participants: 18
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=600&fit=crop',
      title: 'Highland Adventure',
      location: 'Himachal Pradesh',
      date: 'November 2023',
      category: 'mountain',
      participants: 14
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=600&fit=crop',
      title: 'Desert Dune Trek',
      location: 'Rajasthan',
      date: 'October 2023',
      category: 'desert',
      participants: 9
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=600&fit=crop',
      title: 'Coastal Trail Walk',
      location: 'Goa Coastline',
      date: 'September 2023',
      category: 'coastal',
      participants: 12
    },
    {
      id: 9,
      src: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&h=600&fit=crop',
      title: 'Eastern Peaks Trek',
      location: 'Sikkim',
      date: 'August 2023',
      category: 'mountain',
      participants: 11
    },
    {
      id: 10,
      src: 'https://images.unsplash.com/photo-1440581572325-0bea30075d9d?w=800&h=600&fit=crop',
      title: 'Tropical Forest Journey',
      location: 'Kerala Backwaters',
      date: 'July 2023',
      category: 'forest',
      participants: 16
    },
    {
      id: 11,
      src: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop',
      title: 'Monsoon Falls Trek',
      location: 'Maharashtra',
      date: 'June 2023',
      category: 'waterfall',
      participants: 20
    },
    {
      id: 12,
      src: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&h=600&fit=crop',
      title: 'Hill Station Explorer',
      location: 'Tamil Nadu',
      date: 'May 2023',
      category: 'forest',
      participants: 13
    }
  ];

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'mountain', label: 'Mountain' },
    { key: 'forest', label: 'Forest' },
    { key: 'camping', label: 'Camping' },
    { key: 'waterfall', label: 'Waterfall' },
    { key: 'desert', label: 'Desert' },
    { key: 'coastal', label: 'Coastal' }
  ];

  const filteredImages = selectedCategory === 'all'
    ? trekImages
    : trekImages.filter((img) => img.category === selectedCategory);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-page" style={{
      width: '100%', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      lineHeight: '1.6',
      color: '#333',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header Section */}
      <section className="gallery-header" style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: 'white',
        padding: '80px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(255, 126, 1, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(45, 90, 39, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}
        />
        <div className="header-content" style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 20px',
          position: 'relative',
          zIndex: 1
        }}>
          <h1 className="header-title" style={{
            fontSize: '3rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <Camera size={32} />
            Trekking Gallery
          </h1>
          <p className="header-text" style={{
            fontSize: '1.2rem',
            opacity: '0.95',
            lineHeight: '1.7'
          }}>
            Explore our collection of breathtaking trekking adventures from across India
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section" style={{
        backgroundColor: 'white',
        padding: '40px 0',
        borderBottom: '1px solid #e9ecef'
      }}>
        <div className="section-container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div className="filter-header" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            fontWeight: '600',
            color: '#2d5a27',
            justifyContent: 'center'
          }}>
            
          </div>
          <div className="filter-buttons" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`filter-btn ${selectedCategory === cat.key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.key)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: selectedCategory === cat.key ? '2px solid #ff7e01' : '2px solid #e9ecef',
                  backgroundColor: selectedCategory === cat.key ? '#ff7e01' : 'white',
                  color: selectedCategory === cat.key ? 'white' : '#666',
                  borderRadius: '25px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== cat.key) {
                    e.target.style.borderColor = '#ff7e01';
                    e.target.style.color = '#ff7e01';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== cat.key) {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.color = '#666';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section" style={{
        backgroundColor: 'white',
        padding: '60px 20px',
        width: '100%'
      }}>
        <div 
          className="gallery-grid" 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            maxWidth: '1400px',
            margin: '0 auto',
            justifyItems: 'center'
          }}
        >
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="gallery-item"
              onClick={() => handleImageClick(img)}
              style={{
                cursor: 'pointer',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                backgroundColor: 'white',
                position: 'relative',
                width: '100%',
                maxWidth: '380px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
                const img = e.currentTarget.querySelector('.gallery-image');
                if (img) img.style.transform = 'scale(1.05)';
                const overlay = e.currentTarget.querySelector('.image-overlay');
                if (overlay) overlay.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                const img = e.currentTarget.querySelector('.gallery-image');
                if (img) img.style.transform = 'scale(1)';
                const overlay = e.currentTarget.querySelector('.image-overlay');
                if (overlay) overlay.style.opacity = '0';
              }}
            >
              <div 
                className="image-container"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '250px',
                  overflow: 'hidden'
                }}
              >
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="gallery-image"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    transition: 'transform 0.3s ease'
                  }}
                />
                <div 
                  className="image-overlay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.8) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1.5rem',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  <div className="camera-icon" style={{
                    alignSelf: 'flex-end',
                    color: 'white',
                    opacity: 0.8
                  }}>
                    <Camera size={20} />
                  </div>
                  <div className="overlay-content" style={{marginTop: 'auto'}}>
                    <h3 className="image-title" style={{
                      color: 'white',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      marginBottom: '0.75rem',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>{img.title}</h3>
                    <div className="image-details" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <div className="detail-item" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'white',
                        fontSize: '0.9rem',
                        opacity: 0.9
                      }}>
                        <MapPin size={16} />
                        <span>{img.location}</span>
                      </div>
                      <div className="detail-item" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'white',
                        fontSize: '0.9rem',
                        opacity: 0.9
                      }}>
                        <Calendar size={16} />
                        <span>{img.date}</span>
                      </div>
                      <div className="detail-item" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'white',
                        fontSize: '0.9rem',
                        opacity: 0.9
                      }}>
                        <Users size={16} />
                        <span>{img.participants} participants</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="lightbox-overlay" 
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
        >
          <div 
            className="lightbox-content" 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
            }}
          >
            <button 
              className="close-btn" 
              onClick={closeLightbox}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 1001,
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(0,0,0,0.9)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(0,0,0,0.7)';
              }}
            >
              <X size={20} />
            </button>
            <img 
              src={selectedImage.src} 
              alt={selectedImage.title} 
              className="lightbox-image"
              style={{
                width: '100%',
                maxWidth: '800px',
                height: 'auto',
                display: 'block'
              }}
            />
            <div className="lightbox-info" style={{
              padding: '1.5rem',
              backgroundColor: 'white'
            }}>
              <h2 className="lightbox-title" style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#2d5a27',
                marginBottom: '1rem'
              }}>{selectedImage.title}</h2>
              <div className="lightbox-details" style={{
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap'
              }}>
                <div className="detail-group" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#666',
                  fontSize: '0.95rem'
                }}>
                  <MapPin size={18} style={{color: '#ff7e01'}} />
                  <span>{selectedImage.location}</span>
                </div>
                <div className="detail-group" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#666',
                  fontSize: '0.95rem'
                }}>
                  <Calendar size={18} style={{color: '#ff7e01'}} />
                  <span>{selectedImage.date}</span>
                </div>
                <div className="detail-group" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#666',
                  fontSize: '0.95rem'
                }}>
                  <Users size={18} style={{color: '#ff7e01'}} />
                  <span>{selectedImage.participants} trekkers joined</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;