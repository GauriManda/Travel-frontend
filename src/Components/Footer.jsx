import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  MapPin,
  Mail,
  Phone,
  Youtube,
  Github,
  HelpCircle,
  Instagram,
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">

        {/* Discover Links */}
        <div className="footer-section footer-menu">
          <h3>Discover</h3>
          <ul>
            <li> <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink></li>
            <li><NavLink to="/tours" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Tour</NavLink></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer-section footer-menu">
          <h3>Quick Links</h3>
          <ul>
            <li><NavLink to="/gallery" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Gallery</NavLink></li>
            <li><NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Login</NavLink></li>
            <li><NavLink to="/register" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Register</NavLink></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section footer-contact">
          <h3>Contact</h3>
          <p><MapPin size={18} strokeWidth={1.8} /> Maharashtra, India</p>
          <p><Mail size={18} strokeWidth={1.8} /> gauri.manda@gmail.com</p>
          <p><Phone size={18} strokeWidth={1.8} /> +0123456789</p>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="social-icons">
        <a href="#" aria-label="YouTube" title="YouTube">
          <Youtube size={20} />
        </a>
        <a href="#" aria-label="GitHub" title="GitHub">
          <Github size={20} />
        </a>
        <a href="#" aria-label="Help" title="Help Center">
          <HelpCircle size={20} />
        </a>
        <a href="#" aria-label="Instagram" title="Instagram">
          <Instagram size={20} />
        </a>
      </div>

      {/* Copyright */}
      <div className="copyright">
        <p>© 2025 — Designed and Developed by <strong>Gauri Manda</strong>. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
