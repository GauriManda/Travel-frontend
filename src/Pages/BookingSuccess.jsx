import React from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import "./BookingSuccess.css"; // You'll need to create this CSS file

const BookingSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const { bookingInfo, tourTitle, totalPrice } = location.state || {};

  if (!bookingInfo) {
    return (
      <div className="booking-not-found">
        <h2>Booking Information Not Available</h2>
        <p>We couldn't find information about your booking.</p>
        <Link to="/" className="return-home-btn">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="booking-success-container">
      <div className="success-icon">✓</div>
      <h1>Booking Confirmed!</h1>
      <p className="success-message">
        Your trek has been successfully booked. We're excited to have you join us!
      </p>

      <div className="booking-details">
        <h2>Booking Details</h2>
        <div className="detail-row">
          <span className="detail-label">Booking ID:</span>
          <span className="detail-value">{id}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Trek:</span>
          <span className="detail-value">{tourTitle}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Guest Name:</span>
          <span className="detail-value">{bookingInfo.fullName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Number of Guests:</span>
          <span className="detail-value">{bookingInfo.guestSize}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Booking Date:</span>
          <span className="detail-value">
            {new Date(bookingInfo.bookAt).toLocaleDateString()}
          </span>
        </div>
        <div className="detail-row total-price">
          <span className="detail-label">Total Amount:</span>
          <span className="detail-value">₹{totalPrice?.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="next-steps">
        <h3>What's Next?</h3>
        <ul>
          <li>A confirmation email has been sent to your registered email address.</li>
          <li>Our team will contact you at {bookingInfo.phone} with final details.</li>
          <li>Please arrive at the meeting point 15 minutes before departure.</li>
        </ul>
      </div>

      <div className="action-buttons">
        <Link to="/" className="btn home-btn">Return to Home</Link>
        <Link to="/my-bookings" className="btn bookings-btn">View All My Bookings</Link>
      </div>
    </div>
  );
};

export default BookingSuccess;