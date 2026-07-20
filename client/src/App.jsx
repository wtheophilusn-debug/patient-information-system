import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, RoleRoute } from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login         from './pages/Login';
import Dashboard     from './pages/Dashboard';
import Patients      from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Vitals        from './pages/Vitals';
import Consultations from './pages/Consultations';
import Appointments  from './pages/Appointments';
import Users         from './pages/Users';
import Reports       from './pages/Reports';
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = ({ children }) => (
  <PrivateRoute>
    <MainLayout>{children}</MainLayout>
  </PrivateRoute>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard"        element={<Layout><Dashboard /></Layout>} />
          <Route path="/patients"         element={<Layout><Patients /></Layout>} />
          <Route path="/patients/:id"     element={<Layout><PatientDetail /></Layout>} />
          <Route path="/vitals"          element={<Layout><Vitals /></Layout>} />
          <Route path="/consultations"    element={<Layout><Consultations /></Layout>} />
          <Route path="/appointments"     element={<Layout><Appointments /></Layout>} />
          <Route path="/reports"          element={<Layout><RoleRoute roles={['Administrator','Doctor']}><Reports /></RoleRoute></Layout>} />
          <Route path="/users"            element={<Layout><RoleRoute roles={['Administrator']}><Users /></RoleRoute></Layout>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
