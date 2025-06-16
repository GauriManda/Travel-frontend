import React, { useState, useEffect } from 'react';

const SubTitle = () => {
  const heroImg01 = "/Assets/pic1.png";
  const heroImg02 = "/Assets/pic2.png";
  const heroImg03 = "/Assets/pic3.png";

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: isMobile ? '1.5rem' : '2rem 4rem',
      background: '#fff',
      width: '100%',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
      gap: '2rem'
    }}>
      {/* Left Text Section */}
      <div style={{ width: isMobile ? '100%' : '45%' }}>
        <h1 style={{
          color: '#1a2639',
          fontSize: isMobile ? '2rem' : '2.5rem',
          fontWeight: 'bold',
          lineHeight: '1.2',
          marginBottom: '1.5rem'
        }}>
          Traveling opens the door<br />
          to creating <span style={{ color: '#FFA500' }}>memories</span>
        </h1>
        <p style={{
          color: '#666',
          fontSize: '0.95rem',
          lineHeight: '1.6'
        }}>
          Traveling opens the door to new experiences, cultures, and adventures. It broadens perspectives, fosters personal growth, and creates lasting memories. Whether exploring distant lands or hidden local gems, every journey enriches the soul and brings a sense of wonder.
        </p>
      </div>

      {/* Right Image Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: isMobile ? '100%' : '50%',
        height: '340px',
        justifyContent: 'flex-start',
      }}>
        {/* First Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '33%',
          height: '280px',
          borderRadius: '1rem',
          backgroundImage: `url(${heroImg01})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }} />

        {/* Second Image */}
        <div style={{
          position: 'absolute',
          top: '40px',
          left: '35%',
          width: '33%',
          height: '280px',
          borderRadius: '1rem',
          backgroundImage: `url(${heroImg03})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }} />

        {/* Third Image */}
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '70%',
          width: '33%',
          height: '280px',
          borderRadius: '1rem',
          backgroundImage: `url(${heroImg02})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }} />
      </div>
    </div>
  );
};

export default SubTitle;
