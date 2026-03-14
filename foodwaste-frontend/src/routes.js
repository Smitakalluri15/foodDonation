import Home             from './pages/Home';
import Login            from './pages/Login';
import Register         from './pages/Register';
import DonorDashboard   from './pages/DonorDashboard';
import NGODashboard     from './pages/NGODashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AddDonation      from './pages/AddDonation';
import AvailableFood    from './pages/AvailableFood';
import PickupTasks      from './pages/PickupTasks';
import AdminDashboard   from './pages/AdminDashboard';
import LiveFeed         from './pages/LiveFeed';
import ProtectedRoute   from './components/ProtectedRoute';
import PremiumExperience from './pages/PremiumExperience';

// Each route: { path, element, protected: bool, role?: string }
const routes = [
  { path: '/',                element: <Home /> },
  { path: '/login',           element: <Login /> },
  { path: '/register',        element: <Register /> },
  { path: '/experience',      element: <PremiumExperience /> },
  {
    path: '/feed',
    element: (
      <ProtectedRoute>
        <LiveFeed />
      </ProtectedRoute>
    ),
  },

  {
    path: '/donor',
    element: (
      <ProtectedRoute role="DONOR">
        <DonorDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: '/admin',
    element: (
      <ProtectedRoute role="ADMIN">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/add-donation',
    element: (
      <ProtectedRoute role="DONOR">
        <AddDonation />
      </ProtectedRoute>
    ),
  },
  {
    path: '/edit-donation/:id',
    element: (
      <ProtectedRoute role="DONOR">
        <AddDonation />
      </ProtectedRoute>
    ),
  },

  {
    path: '/ngo',
    element: (
      <ProtectedRoute role="NGO">
        <NGODashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: '/volunteer',
    element: (
      <ProtectedRoute role="VOLUNTEER">
        <VolunteerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/pickup-tasks',
    element: (
      <ProtectedRoute role="VOLUNTEER">
        <PickupTasks />
      </ProtectedRoute>
    ),
  },

  // Shared (NGO + Volunteer can both view)
  {
    path: '/available-food',
    element: (
      <ProtectedRoute>
        <AvailableFood />
      </ProtectedRoute>
    ),
  },
];

export default routes;
