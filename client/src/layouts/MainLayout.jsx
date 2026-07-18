import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaTachometerAlt, FaUserInjured, FaHeartbeat, FaStethoscope,
  FaCalendarAlt, FaChartBar, FaUsers, FaSignOutAlt,
} from 'react-icons/fa';

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',    icon: <FaTachometerAlt />, roles: ['Administrator','Receptionist','Nurse','Doctor','Patient'] },
  { to: '/patients',     label: 'Patients',     icon: <FaUserInjured />,   roles: ['Administrator','Receptionist','Nurse','Doctor'] },
  { to: '/vitals',       label: 'Vitals',       icon: <FaHeartbeat />,     roles: ['Administrator','Nurse'] },
  { to: '/consultations',label: 'Consultations',icon: <FaStethoscope />,   roles: ['Administrator','Doctor'] },
  { to: '/appointments', label: 'Appointments', icon: <FaCalendarAlt />,   roles: ['Administrator','Doctor','Receptionist','Patient'] },
  { to: '/reports',      label: 'Reports',      icon: <FaChartBar />,      roles: ['Administrator','Doctor'] },
  { to: '/users',        label: 'Users',        icon: <FaUsers />,         roles: ['Administrator'] },
];

export default function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="bg-primary text-white d-flex flex-column" style={{ width: 230, minHeight: '100vh' }}>
        <div className="p-3 border-bottom border-white border-opacity-25">
          <h5 className="mb-0 fw-bold">🏥 PIS</h5>
          <small className="opacity-75">Patient Info System</small>
        </div>
        <nav className="flex-grow-1 p-2">
          {navItems
            .filter(item => item.roles.includes(user?.role))
            .map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none mb-1 ${
                    isActive ? 'bg-white text-primary fw-semibold' : 'text-white-50 hover-white'
                  }`
                }
              >
                {item.icon} {item.label}
              </NavLink>
            ))}
        </nav>
        <div className="p-3 border-top border-white border-opacity-25">
          <div className="small mb-2 opacity-75">
            <div className="fw-semibold text-white">{user?.fullName}</div>
            <div>{user?.role}</div>
          </div>
          <button className="btn btn-sm btn-outline-light w-100" onClick={handleLogout}>
            <FaSignOutAlt className="me-1" /> Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 bg-light">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
