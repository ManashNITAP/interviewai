import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminRoute from './AdminRoute.jsx';
import Shell from '../components/layout/Shell.jsx';

import Landing from '../pages/Landing.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import ForgotPassword from '../pages/auth/ForgotPassword.jsx';
import ResetPassword from '../pages/auth/ResetPassword.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import ResumeUpload from '../pages/resume/Upload.jsx';
import ResumeReport from '../pages/resume/Report.jsx';
import ResumeHistory from '../pages/resume/History.jsx';
import InterviewSetup from '../pages/interview/Setup.jsx';
import InterviewSession from '../pages/interview/Session.jsx';
import InterviewResult from '../pages/interview/Result.jsx';
import InterviewHistory from '../pages/interview/History.jsx';
import Analytics from '../pages/analytics/Overview.jsx';
import AdminUsers from '../pages/admin/Users.jsx';
import NotFound from '../pages/NotFound.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Shell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume" element={<Navigate to="/resume/upload" replace />} />
          <Route path="/resume/upload" element={<ResumeUpload />} />
          <Route path="/resume/history" element={<ResumeHistory />} />
          <Route path="/resume/:id" element={<ResumeReport />} />
          <Route path="/interview" element={<InterviewSetup />} />
          <Route path="/interview/history" element={<InterviewHistory />} />
          <Route path="/interview/:id/session" element={<InterviewSession />} />
          <Route path="/interview/:id/result" element={<InterviewResult />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
