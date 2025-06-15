import React from 'react';

import './Testimonials.css';
const testimonials = [
  {
    id: 1,
    text: "I had an amazing trekking experience that exceeded all my expectations! The trail was breathtaking, with stunning views at every turn and a perfect mix of challenge and adventure. Our guide was knowledgeable, friendly, and made sure everyone felt safe and included throughout the journey",
    name: "Lia Franklin",
    role: "Customer",
    image: "/Assets/profile1.png",
  },
  {
    id: 2,
    text: "The arrangements—from the food and accommodation to the planning and support—were top-notch. I especially loved the sense of camaraderie among the group and the peaceful moments in nature. This trek truly helped me disconnect, recharge, and appreciate the beauty of the outdoors. ",
    name: "John Doe",
    role: "Customer",
    image: "/Assets/profile2.png",
  },
  {
    id: 3,
    text: "We crossed serene rivers, walked through dense forests, and witnessed unforgettable sunrises from the mountaintops. Each day brought something new and exciting, and I came back not just with memories, but with a refreshed mind and a deep appreciation for nature.",
    name: "Dave Jess",
    role: "Customer",
    image: "/Assets/profile3.png",
  },
];

const Testimonials = () => {
  return (
    <div className="home-container">
      <section className="fans-testimonials-section">
        <div className="testimonials-header">
        
          <h2 className="section-title">What people say about us</h2>
        </div>

        <div className="testimonials-container">
          {testimonials.map((testimonial) => (
            <div className="testimonial-card" key={testimonial.id}>
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <img src={testimonial.image} alt={testimonial.name} className="author-image" />
                <div className="author-info">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
