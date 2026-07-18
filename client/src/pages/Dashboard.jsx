import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { patientsAPI, appointmentsAPI, usersAPI, reportsAPI } from '../services/api';
import {
  FaUserInjured, FaCalendarAlt, FaStethoscope, FaUsers,
  FaUserPlus, FaClipboardList, FaChartPie, FaClock, FaCheckCircle, FaTimesCircle,
} from 'react-icons/fa';

const StatCard = ({ label, value, icon, color, to }) => (
  <Link to={to} className="text-decoration-none">
    <div className="card border-0 shadow-sm h-100" style={{ borderLeft: `4px solid var(--bs-${color})` }}>
      <div className="card-body d-flex align-items-center gap-3">
        <div className={`rounded-circle bg-${color} bg-opacity-10 p-3 text-${color}`}>{icon}</div>
        <div>
          <div className="fs-2 fw-bold text-dark">{value}</div>
          <div className="text-muted small">{label}</div>
        </div>
      </div>
    </div>
  </Link>
);

const statusColor = { Pending: 'warning', Completed: 'success', Cancelled: 'danger' };
const roleColor   = { Administrator: 'danger', Doctor: 'primary', Nurse: 'info', Receptionist: 'success', Patient: 'secondary' };

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats]               = useState({ patients: 0, appointments: 0, consultations: 0, users: 0 });
  const [recentPatients, setRecentPatients]     = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [genderData, setGenderData]     = useState([]);
  const [apptStatus, setApptStatus]     = useState([]);
  const [userRoles, setUserRoles]       = useState([]);
  const [time, setTime]                 = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, a, c] = await Promise.all([
          patientsAPI.getAll(),
          appointmentsAPI.getAll(),
          reportsAPI.consultations(),
        ]);
        setStats(s => ({ ...s, patients: p.data.length, appointments: a.data.length, consultations: c.data.total }));
        setRecentPatients(p.data.slice(0, 5));
        setRecentAppointments(a.data.slice(0, 5));

        if (user.role === 'Administrator') {
          const [u, pr, ar] = await Promise.all([
            usersAPI.getAll(),
            reportsAPI.patients(),
            reportsAPI.appointments(),
          ]);
          setStats(s => ({ ...s, users: u.data.length }));
          setGenderData(pr.data.byGender);
          setApptStatus(ar.data.byStatus);
          setUserRoles(u.data.reduce((acc, usr) => {
            acc[usr.role] = (acc[usr.role] || 0) + 1;
            return acc;
          }, {}));
        }
      } catch {}
    };
    load();
  }, [user]);

  const isAdmin = user?.role === 'Administrator';

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h4 className="mb-0 fw-bold">Welcome back, {user?.fullName} 👋</h4>
          <p className="text-muted mb-0">{user?.role} Dashboard — {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="text-end">
          <div className="fs-4 fw-bold text-primary">{time.toLocaleTimeString()}</div>
          <small className="text-muted">Live</small>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Patients',  value: stats.patients,      icon: <FaUserInjured size={22} />,  color: 'primary', to: '/patients',      roles: ['Administrator','Receptionist','Nurse','Doctor'] },
          { label: 'Appointments',    value: stats.appointments,  icon: <FaCalendarAlt size={22} />,  color: 'success', to: '/appointments',  roles: ['Administrator','Doctor','Receptionist','Patient'] },
          { label: 'Consultations',   value: stats.consultations, icon: <FaStethoscope size={22} />,  color: 'warning', to: '/consultations', roles: ['Administrator','Doctor'] },
          { label: 'System Users',    value: stats.users,         icon: <FaUsers size={22} />,        color: 'danger',  to: '/users',         roles: ['Administrator'] },
        ].filter(t => t.roles.includes(user?.role)).map(t => (
          <div key={t.label} className="col-sm-6 col-lg-3">
            <StatCard {...t} />
          </div>
        ))}
      </div>

      {/* Quick Actions - Admin only */}
      {isAdmin && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h6 className="fw-bold mb-3">⚡ Quick Actions</h6>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/patients" className="btn btn-primary btn-sm"><FaUserPlus className="me-1" /> Add Patient</Link>
              <Link to="/appointments" className="btn btn-success btn-sm"><FaCalendarAlt className="me-1" /> New Appointment</Link>
              <Link to="/users" className="btn btn-danger btn-sm"><FaUsers className="me-1" /> Manage Users</Link>
              <Link to="/reports" className="btn btn-warning btn-sm"><FaChartPie className="me-1" /> View Reports</Link>
              <Link to="/consultations" className="btn btn-info btn-sm text-white"><FaClipboardList className="me-1" /> Consultations</Link>
            </div>
          </div>
        </div>
      )}

      <div className="row g-3 mb-4">
        {/* Recent Patients */}
        <div className={isAdmin ? 'col-lg-6' : 'col-12'}>
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-3">
              <h6 className="fw-bold mb-0">🧑‍⚕️ Recent Patients</h6>
              <Link to="/patients" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover table-sm mb-0">
                <thead className="table-light">
                  <tr><th>No.</th><th>Name</th><th>Gender</th><th>District</th></tr>
                </thead>
                <tbody>
                  {recentPatients.length ? recentPatients.map(p => (
                    <tr key={p._id}>
                      <td><span className="badge bg-primary">{p.patientNumber}</span></td>
                      <td>{p.firstName} {p.lastName}</td>
                      <td>{p.gender}</td>
                      <td>{p.district}</td>
                    </tr>
                  )) : <tr><td colSpan={4} className="text-center text-muted py-3">No patients yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className={isAdmin ? 'col-lg-6' : 'col-12'}>
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-3">
              <h6 className="fw-bold mb-0">📅 Recent Appointments</h6>
              <Link to="/appointments" className="btn btn-sm btn-outline-success">View All</Link>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover table-sm mb-0">
                <thead className="table-light">
                  <tr><th>Patient</th><th>Date</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {recentAppointments.length ? recentAppointments.map(a => (
                    <tr key={a._id}>
                      <td>{a.patientId?.firstName} {a.patientId?.lastName}</td>
                      <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                      <td><span className={`badge bg-${statusColor[a.status]}`}>{a.status}</span></td>
                    </tr>
                  )) : <tr><td colSpan={3} className="text-center text-muted py-3">No appointments yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Admin only: Gender breakdown + Appointment status + User roles */}
      {isAdmin && (
        <div className="row g-3">
          {/* Patients by Gender */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 pt-3">
                <h6 className="fw-bold mb-0">👥 Patients by Gender</h6>
              </div>
              <div className="card-body">
                {genderData.length ? genderData.map(g => (
                  <div key={g._id} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small fw-semibold">{g._id}</span>
                      <span className="small text-muted">{g.count}</span>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                      <div
                        className={`progress-bar ${g._id === 'Male' ? 'bg-primary' : g._id === 'Female' ? 'bg-danger' : 'bg-secondary'}`}
                        style={{ width: `${(g.count / stats.patients) * 100}%` }}
                      />
                    </div>
                  </div>
                )) : <p className="text-muted small">No data yet</p>}
              </div>
            </div>
          </div>

          {/* Appointment Status */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 pt-3">
                <h6 className="fw-bold mb-0">📊 Appointment Status</h6>
              </div>
              <div className="card-body">
                {apptStatus.length ? apptStatus.map(s => (
                  <div key={s._id} className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                      {s._id === 'Completed' ? <FaCheckCircle className="text-success" /> :
                       s._id === 'Cancelled' ? <FaTimesCircle className="text-danger" /> :
                       <FaClock className="text-warning" />}
                      <span className="small fw-semibold">{s._id}</span>
                    </div>
                    <span className={`badge bg-${statusColor[s._id]} fs-6`}>{s.count}</span>
                  </div>
                )) : <p className="text-muted small">No data yet</p>}
              </div>
            </div>
          </div>

          {/* Users by Role */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 pt-3">
                <h6 className="fw-bold mb-0">🔐 Users by Role</h6>
              </div>
              <div className="card-body">
                {Object.keys(userRoles).length ? Object.entries(userRoles).map(([role, count]) => (
                  <div key={role} className="d-flex align-items-center justify-content-between mb-2">
                    <span className={`badge bg-${roleColor[role] || 'secondary'}`}>{role}</span>
                    <span className="fw-bold">{count}</span>
                  </div>
                )) : <p className="text-muted small">No data yet</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
