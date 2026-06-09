import React from 'react';
import SectionLabel from '../ui/SectionLabel';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "We had 40kg of biryani left after our wedding. I listed it on Plateful at 10pm. By 10:22pm Robin Hood Army had claimed it and picked it up by midnight. My family cried. This app is everything.",
      name: "Ravi Kumar",
      role: "Food Donor · Hyderabad",
      avatar: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="22" cy="22" r="21" fill="#FFF2B2" stroke="#2C1A00" strokeWidth="1.5"/>
          {/* Head/Face */}
          <circle cx="22" cy="20" r="11" fill="#FAD0C4" stroke="#2C1A00" strokeWidth="1.5"/>
          {/* Olive Green Hair */}
          <path d="M11 20c0-6 5-11 11-11s11 5 11 11v-2c0-5-4-9-11-9s-11 4-11 9z" fill="#6B8E23" />
          <path d="M11 20c0-6 5-11 11-11s11 5 11 11" fill="none" stroke="#2C1A00" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Eyes & Smile */}
          <circle cx="19" cy="19" r="1.2" fill="#2C1A00"/>
          <circle cx="25" cy="19" r="1.2" fill="#2C1A00"/>
          <path d="M20 25c1.5 1.5 2.5 1.5 4 0" stroke="#2C1A00" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          {/* Shoulders */}
          <path d="M12 36c0-4 4-6 10-6s10 2 10 6" fill="#E76F51" stroke="#2C1A00" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      quote: "Tracking food donations used to be a WhatsApp mess. Plateful's dashboard changed everything for us. We've now served 3x more families every week. Every NGO in India needs this.",
      name: "Priya Sharma",
      role: "NGO Coordinator · Bengaluru",
      avatar: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="22" cy="22" r="21" fill="#FFF2B2" stroke="#2C1A00" strokeWidth="1.5"/>
          {/* Head/Face */}
          <circle cx="22" cy="20" r="11" fill="#ECC3A4" stroke="#2C1A00" strokeWidth="1.5"/>
          {/* Dark Hair */}
          <path d="M10 21c0-6.5 5.5-12 12-12s12 5.5 12 12" fill="none" stroke="#2C1A00" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M10 21c0-6.5 5.5-12 12-12s12 5.5 12 12v3c0-3-4-8-12-8S10 18 10 21z" fill="#2C1A00"/>
          {/* Eyes & Smile */}
          <circle cx="19" cy="20" r="1.2" fill="#2C1A00"/>
          <circle cx="25" cy="20" r="1.2" fill="#2C1A00"/>
          <path d="M20 25c1.5 1.5 2.5 1.5 4 0" stroke="#2C1A00" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          {/* Shirt */}
          <path d="M12 36c0-4 4-6 10-6s10 2 10 6" fill="#4CAF7D" stroke="#2C1A00" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      quote: "I'm a 3rd year student and volunteer every Saturday morning. I've saved 180+ meals, earned my Gold badge, and I'm #3 on the Hyderabad leaderboard. Best thing I've done in college.",
      name: "Arjun Mehta",
      role: "Student Volunteer · Pune",
      avatar: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="22" cy="22" r="21" fill="#FFF2B2" stroke="#2C1A00" strokeWidth="1.5"/>
          {/* Head/Face */}
          <circle cx="22" cy="21" r="11" fill="#FAD0C4" stroke="#2C1A00" strokeWidth="1.5"/>
          {/* Short Hair */}
          <path d="M12 18c0-2 2-3 4-3h12c2 0 4 1 4 3" fill="none" stroke="#2C1A00" strokeWidth="1.5"/>
          {/* Cap */}
          <path d="M11 15c0-4 5-6 11-6s11 2 11 6H11z" fill="#E76F51" stroke="#2C1A00" strokeWidth="1.5"/>
          <path d="M22 9c2-2 6-2 9-1" stroke="#2C1A00" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* Eyes & Smile */}
          <circle cx="19" cy="20" r="1.2" fill="#2C1A00"/>
          <circle cx="25" cy="20" r="1.2" fill="#2C1A00"/>
          <path d="M20 26c1.5 1.5 2.5 1.5 4 0" stroke="#2C1A00" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          {/* Shirt */}
          <path d="M12 36c0-4 4-6 10-6s10 2 10 6" fill="#FF9A3C" stroke="#2C1A00" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="container pf-testimonials-container">
        
        {/* Header Section */}
        <div style={{ textAlign: 'center' }}>
          <SectionLabel text="What our food heroes say 💬" />
          <h2 className="pf-testimonials-headline">
            Real people. Real meals. Real change.
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {testimonials.map((item, idx) => (
            <div key={idx} className="testimonial-card">
              {/* Giant decorative quotation mark */}
              <div className="giant-quote">“</div>
              
              {/* Quote description text */}
              <p className="testimonial-quote-text">
                "{item.quote}"
              </p>

              {/* Author footer */}
              <div className="testimonial-footer">
                <div className="testimonial-user-info">
                  <div className="testimonial-avatar-wrapper">
                    {item.avatar}
                  </div>
                  <div style={{ marginLeft: '12px' }}>
                    <h4 className="testimonial-user-name">{item.name}</h4>
                    <p className="testimonial-user-role">{item.role}</p>
                  </div>
                </div>
                {/* 5 Stars on the right */}
                <div className="testimonial-stars">★★★★★</div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Pill Badges */}
        <div className="social-proof-bar">
          <div className="social-proof-pill">⭐ 4.8 average rating</div>
          <div className="social-proof-pill">💛 2,800+ community members</div>
          <div className="social-proof-pill">🍱 12,400+ meals saved</div>
        </div>

      </div>

      {/* Styled Inline CSS */}
      <style>{`
        .testimonials-section {
          background-color: #FFF6CC;
          /* Subtle repeating hand-drawn heart background pattern */
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 28.35l-1.45-1.32C13.4 22.36 10 19.28 10 15.5c0-3.08 2.42-5.5 5.5-5.5c1.74 0 3.41.81 4.5 2.09c1.09-1.28 2.76-2.09 4.5-2.09c3.08 0 5.5 2.42 5.5 5.5c0 3.78-3.4 6.86-8.55 11.54L20 28.35z' fill='none' stroke='%23FFD400' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' opacity='0.08'/%3E%3C/svg%3E");
          padding: 88px 0;
          font-family: 'Nunito', sans-serif;
        }

        .pf-testimonials-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .pf-testimonials-headline {
          font-size: 38px;
          font-weight: 800;
          color: #2C1A00;
          text-align: center;
          margin-top: 12px;
          margin-bottom: 52px;
        }

        /* Testimonials Grid */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .testimonial-card {
          background-color: #FFFFFF;
          border-radius: 24px;
          padding: 32px 28px;
          border: 1.5px solid #FFEE99;
          box-shadow: 0 4px 24px rgba(255, 212, 0, 0.12);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(255, 212, 0, 0.20);
        }

        /* Giant quotes styling */
        .giant-quote {
          font-size: 72px;
          font-weight: 800;
          color: #FFE566;
          line-height: 1;
          margin-bottom: -20px;
          user-select: none;
          font-family: Georgia, serif;
        }

        .testimonial-quote-text {
          font-size: 15px;
          color: #2C1A00;
          line-height: 1.85;
          font-style: italic;
          flex-grow: 1;
        }

        /* Testimonial Card footer */
        .testimonial-footer {
          border-top: 1.5px solid #FFEE99;
          padding-top: 20px;
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .testimonial-user-info {
          display: flex;
          align-items: center;
        }

        .testimonial-avatar-wrapper {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .testimonial-user-name {
          font-size: 15px;
          font-weight: 800;
          color: #2C1A00;
        }

        .testimonial-user-role {
          font-size: 13px;
          color: #7a6200;
          margin-top: 2px;
          font-weight: 600;
        }

        .testimonial-stars {
          color: #FFD400;
          font-size: 15px;
          white-space: nowrap;
          letter-spacing: 1px;
        }

        /* Social Proof bar */
        .social-proof-bar {
          display: flex;
          gap: 12px;
          justify-content: center;
          align-items: center;
          margin-top: 44px;
          flex-wrap: wrap;
        }

        .social-proof-pill {
          background-color: #FFF2B2;
          border: 1.5px solid #FFEE99;
          color: #2C1A00;
          font-weight: 700;
          font-size: 13px;
          padding: 8px 20px;
          border-radius: 50px;
          box-shadow: 0 2px 8px rgba(255, 212, 0, 0.05);
        }

        @media (max-width: 991px) {
          .testimonials-grid {
            grid-template-columns: 1fr;
            max-width: 480px;
            margin: 0 auto;
            gap: 28px;
          }
          
          .testimonial-card {
            padding: 28px 20px;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
