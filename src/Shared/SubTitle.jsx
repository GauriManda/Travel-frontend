import React from 'react';

const SubTitle = () => {
  const heroImg01 = "/Assets/pic1.png";
  const heroImg02 = "/Assets/pic2.png";
  const heroImg03 = "/Assets/pic3.png"; // New image to replace video

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '2rem 4rem',
      background: 'rgb(255, 255, 255)',
      width: '100%',
      height: '400px',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
      margin: '0',
      overflow: 'hidden'
    }}>
      {/* Left Content */}
      <div style={{ 
        width: '45%', 
        paddingRight: '2rem' 
      }}>
        <h1 style={{
          color: '#1a2639',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          lineHeight: '1.2',
          marginBottom: '1.5rem'
        }}>
          Traveling opens the door<br />
          to creating <span style={{ color: '#FFA500' }}>memories</span>
        </h1>

        <p style={{
          color: '#666',
          fontSize: '0.9rem',
          lineHeight: '1.6'
        }}>
          Traveling opens the door to new experiences, cultures, and adventures. It broadens perspectives, fosters personal growth, and creates lasting memories. Whether exploring distant lands or hidden local gems, every journey enriches the soul and brings a sense of wonder.
        </p>
      </div>

      {/* Right Content - Image Gallery */}
      <div style={{ 
        display: 'flex', 
        width: '50%', 
        height: '100%', 
        gap: '1rem',
        alignItems: 'flex-start'
      }}>
        {/* First Image */}
        <div style={{
          flex: 1,
          height: '280px',
          borderRadius: '1rem',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          backgroundImage: `url(${heroImg01})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '30%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)'
          }}></div>
        </div>

        {/* Second Image - Positioned below */}
        <div style={{
          flex: 1,
          height: '280px',
          borderRadius: '1rem',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          backgroundImage: `url(${heroImg03})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          marginTop: '2rem' // This pushes the middle image down
        }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '30%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)'
          }}></div>
        </div>

        {/* Third Image */}
        <div style={{
          flex: 1,
          height: '280px',
          borderRadius: '1rem',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          backgroundImage: `url(${heroImg02})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          marginTop: '4rem' // This pushes the third image down below the second
        }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '30%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)'
          }}></div>
        </div>
      </div>
    </div>
  );
};

export default SubTitle;