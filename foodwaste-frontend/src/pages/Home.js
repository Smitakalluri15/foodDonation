import React from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import StatsBar from '../components/home/StatsBar';
import FoodTicker from '../components/home/FoodTicker';
import HowItWorks from '../components/home/HowItWorks';
import RoleCards from '../components/home/RoleCards';
import PartnerStrip from '../components/home/PartnerStrip';
import Testimonials from '../components/home/Testimonials';
import LeaderboardTeaser from '../components/home/LeaderboardTeaser';
import Footer from '../components/layout/Footer';

const Home = () => {
  return (
    <div className="home-page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. Navbar */}
      <Navbar />

      {/* Main content sections */}
      <main style={{ flexGrow: 1 }}>
        {/* 2. Hero */}
        <HeroSection />

        {/* 3. StatsBar */}
        <StatsBar />

        {/* 4. FoodTicker */}
        <FoodTicker />

        {/* 5. HowItWorks */}
        <HowItWorks />

        {/* 6. RoleCards */}
        <RoleCards />

        {/* 7. PartnerStrip */}
        <PartnerStrip />

        {/* 8. Testimonials */}
        <Testimonials />

        {/* 9. LeaderboardTeaser */}
        <LeaderboardTeaser />

      </main>

      {/* 11. Footer */}
      <Footer />
    </div>
  );
};

export default Home;
