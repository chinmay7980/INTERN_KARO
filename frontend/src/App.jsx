import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import SavedInternships from './pages/SavedInternships';
import InternshipDetails from './pages/InternshipDetails';
import Internships from './pages/Internships';
import Profile from './pages/Profile';
import OAuthSuccess from './pages/OAuthSuccess';
import { AuthProvider } from './context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard' ||
    location.pathname === '/admin-dashboard' ||
    location.pathname === '/saved-internships' ||
    location.pathname === '/profile';

  if (isDashboard) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/saved-internships" element={<SavedInternships />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/internships/:id" element={<InternshipDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth/success" element={<OAuthSuccess />} />
          </Routes>
          <ToastContainer position="bottom-right" />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
