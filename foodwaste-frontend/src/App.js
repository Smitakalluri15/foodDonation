import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PremiumExperience from './pages/PremiumExperience';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AddDonation from './pages/AddDonation';
import AvailableFood from './pages/AvailableFood';
import PickupTasks from './pages/PickupTasks';
import LiveFeed from './pages/LiveFeed';
import AdminDashboard from './pages/AdminDashboard';
import MapView from './pages/MapView';
import Leaderboard from './pages/Leaderboard';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  React.useEffect(() => {
    let ws;
    const connect = () => {
      // Connect to Spring Boot WebSocket notifications endpoint
      ws = new WebSocket('ws://localhost:8080/ws/notifications');
      
      ws.onopen = () => {
        console.log('Connected to Plateful WebSocket notifications server');
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Dispatch custom window event so specific pages (like MapView) can auto-refresh
          window.dispatchEvent(new CustomEvent('plateful-ws-alert', { detail: data }));

          // Trigger appropriate global visual toast notifications
          if (data.type === 'DONATION_CREATED') {
            toast.info(`🍱 New food donation in ${data.city || 'your area'}: ${data.name}`);
          } else if (data.type === 'DONATION_CLAIMED') {
            toast.success(`🤝 Food donation claimed: ${data.name}`);
          } else if (data.type === 'TASK_ACCEPTED') {
            toast.info(`🚴 Rider ${data.volunteerName} accepted task: ${data.foodName}`);
          } else if (data.type === 'TASK_COMPLETED') {
            toast.success(`🎉 Rider ${data.volunteerName} completed pickup: ${data.foodName}`);
          }
        } catch (e) {
          console.error('Failed parsing websocket payload', e);
        }
      };
      
      ws.onclose = () => {
        console.log('WebSocket closed. Reconnecting in 5s...');
        setTimeout(connect, 5000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket connection error:', err);
        ws.close();
      };
    };

    connect();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isHome && !isAuthPage && <Navbar />}

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/experience" element={<PremiumExperience />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

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
          <Route path="/map" element={
            <ProtectedRoute><MapView /></ProtectedRoute>
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

      {!isHome && !isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />

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
