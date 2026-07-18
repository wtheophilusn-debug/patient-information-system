import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { patientsAPI, appointmentsAPI, usersAPI, reportsAPI } from '../services/api';
import { FaUserInjured, FaCalendarAlt, FaStethoscope, FaUsers } from 'react-icons/fa';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ patients: 0, appointments: 0, consultations: 0, users: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [p, a] = await Promise.all([
          patientsAPI.getAll(),
          appointmentsAPI.getAll(),
        ]);
        const c = await reportsAPI.consultations();
        setStats(s => ({ ...s, patients: p.data.length, appointments: a.data.length, consultations: c.data.total }));
        if (user.role === 'Administrator' || user.role === 'Doctor') {
          const u = await usersAPI.getAll();
          setStats(s => ({ ...s, users: u.data.length }));
        }
      } catch {}
    };
    load();
  }, [user]);

  const tiles = [
    { label: 'Total Patients',     value: stats.patients,      icon: <FaUserInjured size={28} />, to: '/patients',      color: 'primary',   roles: ['Administrator','Receptionist','Nurse','Doctor'] },
    { label: 'Appointments',       value: stats.appointments,  icon: <FaCalendarAlt size={28} />, to: '/appointments',  color: 'success',   roles: ['Administrator','Doctor','Receptionist','Patient'] },
    { label: 'Consultations',      value: stats.consultations, icon: <FaStethoscope size={28} />, to: '/consultations', color: 'warning',   roles: ['Administrator','Doctor'] },
    { label: 'System Users',       value: stats.users,         icon: <FaUsers size={28} />,       to: '/users',         color: 'danger',    roles: ['Administrator'] },
  ].filter(t => t.roles.includes(user?.role));

  return (
    <div>
      <h4 className="mb-1">Welcome, {user?.fullName}</h4>
      <p className="text-muted mb-4">{user?.role} Dashboard</p>
      <div className="row g-3">
        {tiles.map(t => (
          <div key={t.label} className="col-sm-6 col-lg-3">
            <Link to={t.to} className="text-decoration-none">
              <div className={`card border-0 shadow-sm h-100 border-start border-4 border-${t.color}`}>
                <div className="card-body d-flex align-items-center gap-3">
                  <div className={`text-${t.color}`}>{t.icon}</div>
                  <div>
                    <div className="fs-3 fw-bold">{t.value}</div>
                    <div className="text-muted small">{t.label}</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
