import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Navbar  from './components/Navbar';
import Footer  from './components/Footer';

import Home               from './pages/Home';
import Login              from './pages/Login';
import Register           from './pages/Register';
import PremiumExperience  from './pages/PremiumExperience';
import DonorDashboard     from './pages/DonorDashboard';
import NGODashboard       from './pages/NGODashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AddDonation        from './pages/AddDonation';
import AvailableFood      from './pages/AvailableFood';
import PickupTasks        from './pages/PickupTasks';
import LiveFeed           from './pages/LiveFeed';
import AdminDashboard     from './pages/AdminDashboard';
import ProtectedRoute     from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />

          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public */}
              <Route path="/"         element={<Home />} />
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/experience" element={<PremiumExperience />} />

              {/* Donor */}
              <Route path="/donor" element={
                <ProtectedRoute role="DONOR"><DonorDashboard /></ProtectedRoute>
              } />
              <Route path="/add-donation" element={
                <ProtectedRoute role="DONOR"><AddDonation /></ProtectedRoute>
              } />
              <Route path="/edit-donation/:id" element={
                <ProtectedRoute role="DONOR"><AddDonation /></ProtectedRoute>
              } />

              {/* NGO */}
              <Route path="/ngo" element={
                <ProtectedRoute role="NGO"><NGODashboard /></ProtectedRoute>
              } />

              {/* Volunteer */}
              <Route path="/volunteer" element={
                <ProtectedRoute role="VOLUNTEER"><VolunteerDashboard /></ProtectedRoute>
              } />
              <Route path="/pickup-tasks" element={
                <ProtectedRoute role="VOLUNTEER"><PickupTasks /></ProtectedRoute>
              } />

              {/* Shared */}
              <Route path="/available-food" element={
                <ProtectedRoute><AvailableFood /></ProtectedRoute>
              } />
              <Route path="/feed" element={
                <ProtectedRoute><LiveFeed /></ProtectedRoute>
              } />

              {/* Admin */}
              <Route path="/admin" element={
                <ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>
              } />

              {/* 404 */}
              <Route path="*" element={
                <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
                  <div style={{ fontSize: '64px', marginBottom: '1rem' }}>🍃</div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
                    Page not found
                  </h2>
                  <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                    The page you're looking for doesn't exist.
                  </p>
                  <a href="/" className="btn btn-primary">Go Home</a>
                </div>
              } />
            </Routes>
          </main>

          <Footer />
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
