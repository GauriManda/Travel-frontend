import React from 'react';
import { Mountain, Users, Shield, Star, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './About.css';


const About = () => {
  const navigate = useNavigate();
  const stats = [
    { number: '5K+', label: 'Happy Travelers' },
    { number: '200+', label: 'Adventures' },
    { number: '8+', label: 'Years Experience' },
    { number: '95%', label: 'Success Rate' }
  ];

  const features = [
    {
      icon: <Mountain size={32} color="#ff7e01" />,
      title: 'Experienced Guides',
      description: 'Knowledgeable local guides who know the terrain and ensure memorable experiences.'
    },
    {
      icon: <Shield size={32} color="#ff7e01" />,
      title: 'Safety Focused',
      description: 'We prioritize your safety with proper equipment and emergency preparedness.'
    },
    {
      icon: <Users size={32} color="#ff7e01" />,
      title: 'Group Adventures',
      description: 'Join like-minded adventurers or book private trips for your group.'
    },
    {
      icon: <Star size={32} color="#ff7e01" />,
      title: 'Quality Service',
      description: 'We strive to provide excellent service and unforgettable experiences.'
    }
  ];

  const team = [
    {
      name: 'Adventure Team',
      role: 'Trek Leaders',
      experience: 'Experienced',
      speciality: 'Mountain Adventures'
    },
    {
      name: 'Support Staff',
      role: 'Coordinators',
      experience: 'Dedicated',
      speciality: 'Trip Planning'
    },
    {
      name: 'Local Guides',
      role: 'Area Experts',
      experience: 'Knowledgeable',
      speciality: 'Regional Expertise'
    }
  ];

  return (
     <div className="container">
    <div className="about-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">About Our Adventures</h1>
          <p className="hero-text">
            We specialize in creating memorable trekking experiences for adventure enthusiasts. 
            Our team is passionate about exploring nature and sharing these incredible journeys with fellow travelers.
          </p>
          <div className="stats-container">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section white-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Who We Are</h2>
            
          </div>
          
          <div className="grid grid-two-columns">
            <div className="about-content">
              <h3 className="about-title">Our Approach</h3>
              <ul className="feature-list">
                <li className="feature-item">
                  <div className="feature-bullet"></div>
                  <strong>Nature-Focused:</strong> We believe in sustainable tourism and respecting the environment.
                </li>
                <li className="feature-item">
                  <div className="feature-bullet"></div>
                  <strong>Flexible Options:</strong> Various trek options suitable for different experience levels.
                </li>
                <li className="feature-item">
                  <div className="feature-bullet"></div>
                  <strong>Local Expertise:</strong> We work with experienced local guides and communities.
                </li>
                <li className="feature-item">
                  <div className="feature-bullet"></div>
                  <strong>Customer Care:</strong> Dedicated support throughout your journey with us.
                </li>
              </ul>
            </div>
            
            <div className="highlight-box">
              <blockquote className="quote">
                "Adventure awaits those who seek it. We're here to help you discover new paths, 
                meet new people, and create lasting memories in some of the world's most beautiful places."
              </blockquote>
              <footer className="quote-author">
                <strong>Our Adventure Team</strong>
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section gray-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">What We Offer</h2>
            <p className="section-subtitle">
              We focus on providing quality experiences with attention to detail and customer satisfaction.
            </p>
          </div>
          
          <div className="grid grid-four-columns">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section white-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Our Team</h2>
            <p className="section-subtitle">
              Meet the people who make your adventures possible and ensure you have a great experience.
            </p>
          </div>
          
          <div className="grid grid-three-columns">
            {team.map((member, index) => (
              <div key={index} className="team-member">
                <div className="team-avatar">
                  {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-details">{member.experience} • {member.speciality}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Our Values</h2>
          </div>
          
          <div className="grid grid-three-columns">
            <div className="value-item">
              <div className="value-icon safety-icon">
                <Shield size={24} color="white" />
              </div>
              <h3 className="value-title">Safety</h3>
              <p className="value-description">
                We prioritize the safety and well-being of all our travelers with proper planning and precautions.
              </p>
            </div>
            
            <div className="value-item">
              <div className="value-icon community-icon">
                <Users size={24} color="white" />
              </div>
              <h3 className="value-title">Community</h3>
              <p className="value-description">
                Building connections between travelers and supporting local communities along our routes.
              </p>
            </div>
            
            <div className="value-item">
              <div className="value-icon adventure-icon">
                <Mountain size={24} color="white" />
              </div>
              <h3 className="value-title">Adventure</h3>
              <p className="value-description">
                Creating exciting and meaningful experiences that inspire and challenge our travelers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="cta-section">
        <div className="section-container">
          <h2 className="cta-title">Ready for Your Next Adventure?</h2>
          <p className="cta-text">
            Get in touch with us to start planning your perfect trekking experience.
          </p>
          
          <div className="contact-info">
            <div className="contact-item">
              <Phone size={18} className="contact-icon" />
              <span>Call Us</span>
            </div>
            <div className="contact-item">
              <Mail size={18} className="contact-icon" />
              <span>Email Us</span>
            </div>
           
          </div>
          
          <div className="button-group">
          <button 
  className="primary-button"
  onClick={() => navigate('/tours')}
>
  Book Adventure
</button>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
};

export default About;