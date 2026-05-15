import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'

import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/admin/Login'
import DashboardLayout from './pages/admin/DashboardLayout'
import ProjectsList from './pages/admin/ProjectsList'
import ProjectEditor from './pages/admin/ProjectEditor'
import Settings from './pages/admin/Settings'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { background: '#101010', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<App />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          
          {/* Admin Authentication */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<ProjectsList />} />
              <Route path="projects" element={<ProjectsList />} />
              <Route path="projects/new" element={<ProjectEditor />} />
              <Route path="projects/edit/:id" element={<ProjectEditor />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
)
