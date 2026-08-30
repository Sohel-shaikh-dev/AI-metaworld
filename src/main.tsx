import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'

import { AuthProvider } from './contexts/AuthContext'
import { SettingsProvider } from './contexts/SettingsContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/admin/Login'
import DashboardLayout from './pages/admin/DashboardLayout'
import Overview from './pages/admin/Overview'
import ProjectsList from './pages/admin/ProjectsList'
import ProjectEditor from './pages/admin/ProjectEditor'
import Settings from './pages/admin/Settings'
import SystemSettings from './pages/admin/SystemSettings'
import ResetPassword from './pages/admin/ResetPassword'
import Messages from './pages/admin/Messages'

const LegacySettingsRedirect = () => {
  const { section } = useParams();
  const validSections = ['brand', 'hero', 'about', 'stats', 'contact', 'social', 'footer'];
  if (section && validSections.includes(section)) {
    return <Navigate to={`/admin/${section}`} replace />;
  }
  return <Navigate to="/admin" replace />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <SettingsProvider>
        <Toaster position="top-right" toastOptions={{ style: { background: '#101010', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<App />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          
          {/* Admin Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/reset-password" element={<ResetPassword />} />
          
          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="projects" element={<ProjectsList />} />
              <Route path="projects/new" element={<ProjectEditor />} />
              <Route path="projects/edit/:id" element={<ProjectEditor />} />
              <Route path="messages" element={<Messages />} />
              
              <Route path="brand" element={<Settings section="brand" />} />
              <Route path="hero" element={<Settings section="hero" />} />
              <Route path="about" element={<Settings section="about" />} />
              <Route path="stats" element={<Settings section="stats" />} />
              <Route path="contact" element={<Settings section="contact" />} />
              <Route path="social" element={<Settings section="social" />} />
              <Route path="footer" element={<Settings section="footer" />} />
              
              <Route path="settings" element={<SystemSettings />} />
              <Route path="settings/:section" element={<LegacySettingsRedirect />} />
              
              <Route path="*" element={
                <div className="flex-1 w-full h-full flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                  <h1 className="text-3xl font-serif text-white mb-2">Page Not Found</h1>
                  <p className="text-gray-400">The page you are looking for does not exist in the Admin Panel.</p>
                </div>
              } />
            </Route>
            
            {/* Dashboard alias to Admin */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<ProjectsList />} />
            </Route>
          </Route>
        </Routes>
          </SettingsProvider>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
)
