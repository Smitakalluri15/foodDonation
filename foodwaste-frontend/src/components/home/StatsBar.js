import React, { useState, useEffect, useRef } from 'react';

const StatsBar = () => {
  const sectionRef = useRef(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  
  // Animated states
  const [mealsSaved, setMealsSaved] = useState(0);
  const [ngoPartners, setNgoPartners] = useState(0);
  const [activeDonors, setActiveDonors] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          startCountAnimation();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, [hasTriggered]);

  const startCountAnimation = () => {
    const duration = 2200; // 2200ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic timing
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setMealsSaved(Math.floor(easeProgress * 12400));
      setNgoPartners(Math.floor(easeProgress * 340));
      setActiveDonors(Math.floor(easeProgress * 2800));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <section ref={sectionRef} className="pf-stats-bar-section">
      <div className="container">
        <div className="pf-stats-grid">
          {/* Stat A */}
          <div className="pf-stat-cell">
            <div className="pf-stat-number">
              {mealsSaved.toLocaleString()}+
            </div>
            <div className="pf-stat-label">Meals saved</div>
            {/* Hand-drawn Star SVG */}
            <div className="pf-stat-star">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C1A00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.5 l2.8 5.8 6.4.5-4.8 4.2 1.5 6.3-5.9-3.4-5.5 3.4 1.2-6.3-4.5-4.2 6.2-.5z" />
              </svg>
            </div>
          </div>

          {/* Stat B */}
          <div className="pf-stat-cell">
            <div className="pf-stat-number">
              {ngoPartners}
            </div>
            <div className="pf-stat-label">NGO partners</div>
            <div className="pf-stat-star">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C1A00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.5 l2.8 5.8 6.4.5-4.8 4.2 1.5 6.3-5.9-3.4-5.5 3.4 1.2-6.3-4.5-4.2 6.2-.5z" />
              </svg>
            </div>
          </div>

          {/* Stat C */}
          <div className="pf-stat-cell">
            <div className="pf-stat-number">
              {activeDonors.toLocaleString()}+
            </div>
            <div className="pf-stat-label">Active donors</div>
            <div className="pf-stat-star">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C1A00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.5 l2.8 5.8 6.4.5-4.8 4.2 1.5 6.3-5.9-3.4-5.5 3.4 1.2-6.3-4.5-4.2 6.2-.5z" />
              </svg>
            </div>
          </div>

          {/* Stat D */}
          <div className="pf-stat-cell">
            <div className="pf-stat-number">
              0 kg
            </div>
            <div className="pf-stat-label">Food wasted today</div>
            {/* Target Goal Pill Badge */}
            <div className="pf-stat-goal-badge">
              Our goal every day 🎯
            </div>
            <div className="pf-stat-star">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C1A00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.5 l2.8 5.8 6.4.5-4.8 4.2 1.5 6.3-5.9-3.4-5.5 3.4 1.2-6.3-4.5-4.2 6.2-.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Styled Inline Styles */}
      <style>{`
        .pf-stats-bar-section {
          background-color: #FFD400; /* --y10 primary accent background */
          padding: 60px 0;
          position: relative;
          z-index: 10;
          font-family: 'Nunito', sans-serif;
          
          /* Tiny repeating dots texture overlay */
          background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='3' cy='3' r='1.5' fill='%232C1A00' fill-opacity='0.06'/%3E%3C/svg%3E");
        }

        .pf-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          align-items: flex-start;
        }

        .pf-stat-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 52px;
          border-right: 1px solid rgba(44, 26, 0, 0.15);
          text-align: center;
        }

        .pf-stat-cell:last-child {
          border-right: none;
        }

        .pf-stat-number {
          font-size: 56px;
          font-weight: 800;
          color: #2C1A00;
          letter-spacing: -1.5px;
          line-height: 1.1;
        }

        .pf-stat-label {
          font-size: 15px;
          font-weight: 600;
          color: rgba(44, 26, 0, 0.65);
          margin-top: 8px;
        }

        .pf-stat-star {
          margin-top: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.85;
        }

        .pf-stat-goal-badge {
          background-color: rgba(44, 26, 0, 0.1);
          color: #2C1A00;
          font-size: 12px;
          font-weight: 700;
          border-radius: 50px;
          padding: 3px 10px;
          margin-top: 8px;
          display: inline-block;
        }

        /* Responsive Breakpoints */
        @media (max-width: 991px) {
          .pf-stat-cell {
            padding: 0 20px;
          }
        }

        @media (max-width: 767px) {
          .pf-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .pf-stat-cell {
            border-right: none;
            padding: 28px 16px;
            width: 100%;
          }
          
          /* Horizontal divider after Row 1 in 2x2 grid */
          .pf-stat-cell:nth-child(1),
          .pf-stat-cell:nth-child(2) {
            border-bottom: 1px solid rgba(44, 26, 0, 0.12);
          }
          
          .pf-stat-number {
            font-size: 44px;
          }
        }
      `}</style>
    </section>
  );
};

export default StatsBar;
