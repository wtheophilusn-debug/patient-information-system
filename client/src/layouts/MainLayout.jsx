import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaTachometerAlt, FaUserInjured, FaHeartbeat, FaStethoscope,
  FaCalendarAlt, FaChartBar, FaUsers, FaSignOutAlt, FaBars,
} from 'react-icons/fa';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard',     label: 'Dashboard',     icon: <FaTachometerAlt />, roles: ['Administrator','Receptionist','Nurse','Doctor','Patient'] },
  { to: '/patients',      label: 'Patients',      icon: <FaUserInjured />,   roles: ['Administrator','Receptionist','Nurse','Doctor'] },
  { to: '/vitals',        label: 'Vitals',         icon: <FaHeartbeat />,     roles: ['Administrator','Nurse'] },
  { to: '/consultations', label: 'Consultations',  icon: <FaStethoscope />,   roles: ['Administrator','Doctor'] },
  { to: '/appointments',  label: 'Appointments',   icon: <FaCalendarAlt />,   roles: ['Administrator','Doctor','Receptionist','Patient'] },
  { to: '/reports',       label: 'Reports',        icon: <FaChartBar />,      roles: ['Administrator','Doctor'] },
  { to: '/users',         label: 'Users',          icon: <FaUsers />,         roles: ['Administrator'] },
];

const roleColor = {
  Administrator: '#dc3545', Doctor: '#0d6efd', Nurse: '#0dcaf0',
  Receptionist: '#198754', Patient: '#6c757d',
};

export default function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const currentPage = navItems.find(n => n.to === location.pathname)?.label || 'Dashboard';

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Sidebar */}
      <div
        className="d-flex flex-column text-white"
        style={{
          width: collapsed ? 64 : 240,
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #1a237e 0%, #0d47a1 60%, #1565c0 100%)',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div className="d-flex align-items-center gap-2 p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', minHeight: 64 }}>
          <span style={{ fontSize: 24 }}>🏥</span>
          {!collapsed && (
            <div>
              <div className="fw-bold" style={{ fontSize: 15, letterSpacing: 0.5 }}>PIS</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>Patient Info System</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-grow-1 py-2">
          {navItems.filter(item => item.roles.includes(user?.role)).map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : ''}
              className={({ isActive }) =>
                `d-flex align-items-center gap-3 text-decoration-none mx-2 mb-1 rounded px-3 py-2 ${
                  isActive
                    ? 'bg-white text-primary fw-semibold'
                    : 'text-white'
                }`
              }
              style={({ isActive }) => ({
                opacity: isActive ? 1 : 0.8,
                fontSize: 14,
                transition: 'all 0.2s',
              })}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        {!collapsed && (
          <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                style={{ width: 36, height: 36, background: roleColor[user?.role] || '#666', fontSize: 14, flexShrink: 0 }}
              >
                {user?.fullName?.charAt(0)}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div className="fw-semibold text-white" style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.fullName}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{user?.role}</div>
              </div>
            </div>
            <button className="btn btn-sm btn-outline-light w-100" onClick={handleLogout} style={{ fontSize: 12 }}>
              <FaSignOutAlt className="me-1" /> Logout
            </button>
          </div>
        )}
        {collapsed && (
          <div className="p-2 pb-3 d-flex flex-column align-items-center gap-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
              style={{ width: 32, height: 32, background: roleColor[user?.role] || '#666', fontSize: 13 }}
            >
              {user?.fullName?.charAt(0)}
            </div>
            <button className="btn btn-sm btn-outline-light p-1" onClick={handleLogout} title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        )}
      </div>

      {/* Main */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        {/* Top navbar */}
        <div
          className="d-flex align-items-center justify-content-between px-4"
          style={{ height: 64, background: '#fff', borderBottom: '1px solid #e0e0e0', flexShrink: 0 }}
        >
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-sm btn-light border" onClick={() => setCollapsed(c => !c)}>
              <FaBars />
            </button>
            <div>
              <span className="fw-semibold text-dark">{currentPage}</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span
              className="badge rounded-pill px-3 py-2"
              style={{ background: roleColor[user?.role] || '#666', fontSize: 12 }}
            >
              {user?.role}
            </span>
            <span className="fw-semibold text-dark" style={{ fontSize: 14 }}>{user?.fullName}</span>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-grow-1 p-4" style={{ overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
