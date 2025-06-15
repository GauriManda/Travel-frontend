import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";
import "./TourDetails.css";

const calculateAvgRating = (reviews) => {
  if (!reviews || reviews.length === 0) return { avgRating: 0, totalReviews: 0 };
  const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  return { avgRating: (totalRating / reviews.length).toFixed(1), totalReviews: reviews.length };
};

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Tour and booking states
  const [members, setMembers] = useState(1);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bookAt, setBookAt] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  // Review states
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [localReviews, setLocalReviews] = useState([]);
  const [tokenError, setTokenError] = useState(false);

  // Using your existing useFetch hook for tour data
  const { data: tour, loading, error } = useFetch(`${BASE_URL}/tours/${id}`);

  const {
    title = "Loading tour...",
    desc = "No description available",
    price = 0,
    location = "Unknown location",
    image,
    photo,
    difficulty,
    duration,
    highlights = [],
    itinerary = []
  } = tour || {};

  // Calculate rating based on localReviews
  const { avgRating, totalReviews } = calculateAvgRating(localReviews);

  // Calculate minimum date (tomorrow) for booking
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Check token validity
  useEffect(() => {
    if (user && user.token) {
      try {
        const tokenPayload = JSON.parse(atob(user.token.split('.')[1]));
        const isExpired = tokenPayload.exp * 1000 < Date.now();
        if (isExpired) {
          setTokenError(true);
        } else {
          setTokenError(false);
        }
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, [user]);

  // Fetch reviews separately
  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

const fetchReviews = async () => {
  try {
    const res = await fetch(`${BASE_URL}/reviews/tour/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    const data = await res.json();
    
    if (res.ok) {
      // Fix: Access the reviews array specifically
      setLocalReviews(data.data.reviews || []);
      console.log("Reviews fetched:", data.data.reviews); // Debug log
    } else {
      console.error("Failed to fetch reviews:", data.message);
      setLocalReviews([]); // Set empty array on error
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    setLocalReviews([]); // Set empty array on error
  }
};
  const handleMembersChange = (change) => {
    setMembers((prev) => Math.max(1, Math.min(prev + change, 10)));
  };

  const handleRatingClick = (rating) => {
    setUserRating(rating);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    // Check if rating is provided
    if (!userRating || userRating < 1) {
      setSubmitMessage("Please select a rating");
      return;
    }
    
    // Check if review text is provided
    if (!reviewText.trim()) {
      setSubmitMessage("Please enter some review text");
      return;
    }
    
    setSubmitting(true);
    setSubmitMessage("");
    
    try {
      if (!user || !user.token) {
        throw new Error("You must be logged in to submit a review");
      }
      
      const res = await fetch(`${BASE_URL}/reviews/tour/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          reviewText: reviewText.trim(),
          rating: userRating
        }),
      });
      
      const data = await res.json();
    
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      
      setSubmitMessage("Review submitted successfully!");
      setUserRating(0);
      setReviewText("");
      
      // Add the new review locally and refresh reviews from server
      fetchReviews();
      
    } catch (error) {
      setSubmitMessage(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

 const handleBookingSubmit = async (e) => {
  e.preventDefault();
  setBookingLoading(true);
  setBookingError("");

  if (tokenError) {
    setBookingError("Your session has expired. Please log in again.");
    setBookingLoading(false);
    return;
  }

  if (!user || !user.token) {
    setBookingError("You must be logged in to book a tour");
    setBookingLoading(false);
    return;
  }

  try {
    // Fixed: Access user properties directly since data.data is spread at top level
    const bookingData = {
      userId: user._id || user.id, // Try both _id and id
      userEmail: user.email,
      tourName: title,
      fullName,
      phone: parseInt(phone, 10),
      guestSize: members,
      bookAt: new Date(bookAt).toISOString(),
    };

    // Debug log to see what's available
    console.log("User object:", user);
    console.log("Booking data:", bookingData);

    const res = await fetch(`${BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify(bookingData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to book tour");
    }

    // Successful booking
    setBookingSuccess(true);
    setBookingId(data.data._id);
    setFullName("");
    setPhone("");
    setBookAt("");

    // Show success message for 3 seconds then navigate to home page
    setTimeout(() => {
      navigate("/");
    }, 3000);

  } catch (err) {
    console.error("Booking error:", err);
    setBookingError(err.message || "Something went wrong");
  } finally {
    setBookingLoading(false);
  }
};   
const handlePayment = async () => {
  const amount = price * members;

  const res = await fetch(`${BASE_URL}/payment/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ amount })
  });

  const data = await res.json();

  if (!data.success) {
    alert("Payment initialization failed");
    return;
  }

  const options = {
    key: "rzp_test_MfTWfSQ9Pdc9r9", // from Razorpay dashboard
    amount: data.order.amount,
    currency: "INR",
    name: "Trek Booking",
    description: title,
    order_id: data.order.id,
    handler: async function (response) {
      alert("Payment successful!");
      // Optional: Send booking data to backend here
      handleBookingSubmit(); // your existing booking logic
    },
    prefill: {
      name: fullName,
      email: user.email,
      contact: phone
    },
    theme: {
      color: "#0b5ed7"
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


  return (
    <div className="tour-details-container">
      <Link to="/" className="back-btn">← Back to Treks</Link>
      <h1 className="tour-title">{title}</h1>

      {tokenError && (
        <div className="token-error-message">
          Your session has expired. Please <Link to="/login">log in again</Link>.
        </div>
      )}

      <div className="tour-details-header">
        <div className="tour-details-image-container">
          <img 
            src={image || photo} 
            alt={title} 
            className="tour-details-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/800x500";
            }}
          />
          <div className="tour-badges">
            <span className={`difficulty-badge ${difficulty?.toLowerCase()}`}>{difficulty}</span>
            <span className="duration-badge">{duration}</span>
          </div>
        </div>

        <div className="tour-details-info">
          <div className="tour-details-rating">
            <span className="rating-stars">★ {avgRating}</span>
            <span className="reviews-count">({totalReviews} review{totalReviews !== 1 ? "s" : ""})</span>
          </div>

          <div className="tour-details-location">
            <span>{location}</span>
          </div>

          <div className="tour-description">
            <h2>Description</h2>
            <p>{desc || "No description available."}</p>
          </div>

          <div className="tour-highlights">
            <h2>Highlights</h2>
            <ul className="highlights-list">
              {highlights?.length ? highlights.map((highlight, index) => (
                <li key={index} className="highlight-item">{highlight}</li>
              )) : <li>No highlights available.</li>}
            </ul>
          </div>

          <div className="tour-booking-section">
            <div className="tour-price-display">
              <h3>Tour Price</h3>
              <div className="price-per-person">
                <span className="price">₹{price?.toLocaleString("en-IN")}</span>
                <span className="price-unit">/per person</span>
              </div>

              <div className="members-selector">
                <h4>Number of Members</h4>
                <div className="members-control">
                  <button 
                    type="button"
                    className="decrement-btn" 
                    onClick={() => handleMembersChange(-1)} 
                    disabled={members <= 1}
                  >-</button>
                  <span className="members-count">{members}</span>
                  <button 
                    type="button"
                    className="increment-btn" 
                    onClick={() => handleMembersChange(1)} 
                    disabled={members >= 10}
                  >+</button>
                </div>
              </div>

              <div className="total-price">
                <h4>Total Price</h4>
                <span className="price-total">₹{(price * members).toLocaleString("en-IN")}</span>
              </div>

              {bookingSuccess ? (
                <div className="booking-success-message">
                  <h3>🎉 Booking Confirmed!</h3>
                  <p>Your booking has been successfully processed.</p>
                  <p><strong>Booking ID:</strong> {bookingId}</p>
                  <p>We'll send the details to your email.</p>
                  <p>Redirecting to home page in a few seconds...</p>
                  <Link to="/" className="home-link-btn">Go to Home Now</Link>
                </div>
              ) : (
                <button 
                  type="button" 
                  className="book-tour-btn"
                  onClick={() => setShowBookingForm(!showBookingForm)}
                >
                  {showBookingForm ? "Hide Booking Form" : "Book This Trek"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showBookingForm && !bookingSuccess && (
        <div className="booking-form-container">
          <h2>Complete Your Booking</h2>
          
          {!user ? (
            <div className="login-required-message">
              <p>You must be <Link to="/login">logged in</Link> to book this trek.</p>
            </div>
          ) : (
            <form className="booking-form" onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bookAt">Booking Date</label>
                <input
                  type="date"
                  id="bookAt"
                  value={bookAt}
                  onChange={(e) => setBookAt(e.target.value)}
                  min={minDate}
                  required
                />
              </div>

              <div className="booking-summary">
                <h4>Booking Summary</h4>
                <div className="summary-row">
                  <span>Trek:</span>
                  <span>{title}</span>
                </div>
                <div className="summary-row">
                  <span>Members:</span>
                  <span>{members}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>₹{(price * members).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {bookingError && <div className="booking-error">{bookingError}</div>}
<button 
  type="button" 
  className="confirm-booking-btn" 
  onClick={handlePayment}
  disabled={bookingLoading || tokenError}
>
  {bookingLoading ? "Processing..." : "Pay & Confirm Booking"}
</button>

            </form>
          )}
        </div>
      )}

      <section className="tour-itinerary">
        <h2>Itinerary</h2>
        <ul className="itinerary-list">
          {itinerary?.length ? itinerary.map((item, index) => {
            const parts = typeof item === 'string' ? item.split(":") : [item];
            return (
              <li key={index} className="itinerary-item">
                <span className="itinerary-day">{parts[0]}</span>
                <span className="itinerary-details">{parts.length > 1 ? parts[1] : ''}</span>
              </li>
            );
          }) : <li>No itinerary available.</li>}
        </ul>
      </section>

      <section className="tour-reviews-section">
        <h2>Rate This Trek</h2>

        {user && !tokenError ? (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <div className="rating-selector">
              <p>Your Rating:</p>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`rating-star ${userRating >= star ? 'active' : ''}`}
                    onClick={() => handleRatingClick(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="review-text-area">
              <label htmlFor="reviewText">Your Review</label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this trek..."
                rows={4}
                required
              />
            </div>

            {submitMessage && <div className="submit-message">{submitMessage}</div>}

            <button
              type="submit"
              className="submit-review-btn"
              disabled={submitting || userRating === 0}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="login-required-message">
            <p>You must be <Link to="/login">logged in</Link> to leave a review.</p>
          </div>
        )}

        <div className="existing-reviews">
          <h3>User Reviews ({totalReviews})</h3>
          {localReviews.length > 0 ? (
            <ul className="reviews-list">
              {localReviews.map((review, index) => (
                <li key={index} className="review-item">
                  <div className="review-header">
                    <span className="reviewer-name">{review.username || "Anonymous User"}</span>
                    <div className="review-rating">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="review-content">{review.reviewText || "No comment provided."}</div>
                  <div className="review-date">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-reviews">Be the first to review this trek!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default TourDetails;