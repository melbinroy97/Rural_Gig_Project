import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GigListingPage from './pages/GigListingPage';
import GigDetailPage from './pages/GigDetailPage';
import WorkerProfilePage from './pages/WorkerProfilePage';
import PostJobPage from './pages/PostJobPage';
import WorkerDashboard from './pages/WorkerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import MessagingPage from './pages/MessagingPage';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/gigs" element={<GigListingPage />} />
                <Route path="/gigs/:id" element={<GigDetailPage />} />
                <Route path="/profile/:id" element={<WorkerProfilePage />} />
                
                {/* Protected Routes wrapped manually in dashboard pages */}
                <Route path="/post-job" element={<PostJobPage />} />
                <Route path="/dashboard/worker" element={<WorkerDashboard />} />
                <Route path="/dashboard/employer" element={<EmployerDashboard />} />
                <Route path="/messages" element={<MessagingPage />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </main>
          </div>
          <ToastContainer position="bottom-right" />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
