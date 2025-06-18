import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Profile from '@/pages/Profile';
import Companies from '@/pages/Companies';
import Sectors from '@/pages/Sectors';
import Roles from '@/pages/Roles';
import Employees from '@/pages/Employees';
import ChecklistTemplates from '@/pages/ChecklistTemplates';
import AssessmentScheduling from '@/pages/AssessmentScheduling';
import AssessmentResults from '@/pages/AssessmentResults';
import Settings from '@/pages/Settings';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { PermissionDenied } from '@/components/auth/PermissionDenied';
import { Permissions } from '@/pages/Permissions';
import { Users } from '@/pages/Users';
import { EmployeeSimpleDashboard } from '@/components/employee/EmployeeSimpleDashboard';
import { Assessments } from '@/pages/Assessments';

export function AppContent() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Dashboard />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Dashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/portal/:templateId" element={<EmployeeSimpleDashboard />} />

      {/* Private Routes - accessible only when authenticated */}
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <Login />} />
      <Route path="/profile" element={isAuthenticated ? <Profile /> : <Login />} />
      <Route path="/permission-denied" element={<PermissionDenied />} />

      {/* Routes with RouteGuard - checking company access */}
      <Route
        path="/companies"
        element={
          <RouteGuard companyId={user?.user_metadata?.companyId}>
            <Companies />
          </RouteGuard>
        }
      />
      <Route
        path="/sectors"
        element={
          <RouteGuard companyId={user?.user_metadata?.companyId}>
            <Sectors />
          </RouteGuard>
        }
      />
      <Route
        path="/roles"
        element={
          <RouteGuard companyId={user?.user_metadata?.companyId}>
            <Roles />
          </RouteGuard>
        }
      />
      <Route
        path="/employees"
        element={
          <RouteGuard companyId={user?.user_metadata?.companyId}>
            <Employees />
          </RouteGuard>
        }
      />

      {/* Routes with RoleGuard - checking user role */}
      <Route
        path="/checklists"
        element={
          <RoleGuard allowedRoles={['admin', 'superadmin']}>
            <ChecklistTemplates />
          </RoleGuard>
        }
      />
      <Route
        path="/assessment-scheduling"
        element={
          <RoleGuard allowedRoles={['admin', 'superadmin']}>
            <AssessmentScheduling />
          </RoleGuard>
        }
      />
       <Route
        path="/assessments"
        element={
          <RoleGuard allowedRoles={['admin', 'superadmin']}>
            <Assessments />
          </RoleGuard>
        }
      />
      <Route
        path="/assessment-results"
        element={
          <RoleGuard allowedRoles={['admin', 'superadmin']}>
            <AssessmentResults />
          </RoleGuard>
        }
      />
      <Route
        path="/settings"
        element={
          <RoleGuard allowedRoles={['admin', 'superadmin']}>
            <Settings />
          </RoleGuard>
        }
      />
       <Route
        path="/permissions"
        element={
          <RoleGuard allowedRoles={['admin', 'superadmin']}>
            <Permissions />
          </RoleGuard>
        }
      />
      <Route
        path="/users"
        element={
          <RoleGuard allowedRoles={['admin', 'superadmin']}>
            <Users />
          </RoleGuard>
        }
      />
    </Routes>
  );
}
