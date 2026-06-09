import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Hero = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/register';
    const map = { DONOR: '/donor', NGO: '/ngo', VOLUNTEER: '/volunteer', ADMIN: '/admin' };
    return map[user.role] || '/';
  };

  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-left">
          <div className="hero-badge">🌿 Fighting hunger, reducing waste</div>
          <h1 className="hero-headline">
            Surplus food finds its way <span className="hero-highlight">to those who need it</span>
          </h1>
          <p className="hero-subtext">
            Connecting local donors, volunteers, and NGOs to rescue food before it goes to waste.
            Fast, secure, transparent, and direct to community distribution centers.
          </p>
          <div className="hero-buttons">
            {isAuthenticated() ? (
              <Link to={getDashboardLink()} className="btn btn-primary">
                Go to Dashboard &rarr;
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-image-container float-animation">
            <img
              src="/images/indian_food_hero.png"
              alt="Plateful Food Sharing Community"
              className="hero-image"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=600&q=80';
              }}
            />
            <div className="hero-image-overlay">
              <span className="overlay-badge">❤️ Active Platform</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Injecting Hero-specific CSS styles
const injectHeroStyles = () => {
  if (typeof document === 'undefined') return;
  const styleId = 'hero-custom-css';
  if (document.getElementById(styleId)) return;

  const styleSheet = document.createElement('style');
  styleSheet.id = styleId;
  styleSheet.innerText = `
    .hero-section {
      background: linear-gradient(135deg, #F5FFFE 0%, #E6FAF8 100%);
      padding: 100px 0;
      border-bottom: 1px solid rgba(42, 157, 143, 0.1);
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 60px;
      align-items: center;
    }
    .hero-left {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 24px;
    }
    .hero-badge {
      display: inline-block;
      background-color: var(--white);
      border: 1px solid rgba(42, 157, 143, 0.25);
      border-radius: 20px;
      padding: 6px 18px;
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-teal);
      box-shadow: 0 4px 12px rgba(42, 157, 143, 0.05);
    }
    .hero-highlight {
      color: var(--primary-teal);
      display: inline-block;
      position: relative;
    }
    .hero-subtext {
      font-size: 18px;
      color: var(--muted-text);
      line-height: 1.7;
      max-width: 540px;
    }
    .hero-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .hero-right {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .hero-image-container {
      position: relative;
      width: 100%;
      max-width: 480px;
    }
    .hero-image {
      width: 100%;
      height: auto;
      border-radius: 24px;
      box-shadow: 0 20px 48px rgba(42, 157, 143, 0.15);
      border: 6px solid var(--white);
      object-fit: cover;
      aspect-ratio: 4/3;
    }
    .hero-image-overlay {
      position: absolute;
      bottom: 20px;
      right: 20px;
      background-color: var(--white);
      padding: 8px 16px;
      border-radius: 20px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
    }
    .overlay-badge {
      font-size: 12px;
      font-weight: 700;
      color: var(--dark-teal);
    }

    @media (max-width: 991px) {
      .hero-grid {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 48px;
      }
      .hero-left {
        align-items: center;
      }
      .hero-subtext {
        margin: 0 auto;
      }
      .hero-buttons {
        justify-content: center;
      }
    }
  `;
  document.head.appendChild(styleSheet);
};
injectHeroStyles();

export default Hero;
