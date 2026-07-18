import { useEffect, useState } from 'react';
import { appointmentsAPI, patientsAPI, usersAPI } from '../services/api';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaPlus } from 'react-icons/fa';

const statusColor = { Pending: 'warning', Completed: 'success', Cancelled: 'danger' };
const blank = { patientId: '', doctorId: '', appointmentDate: '', appointmentTime: '', reason: '' };

export default function Appointments() {
  const { user } = useAuth();
  const [appts, setAppts]     = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors]   = useState([]);
  const [form, setForm]         = useState(blank);
  const [showForm, setShowForm] = useState(false);
  const [error, setError]       = useState('');

  const load = () => appointmentsAPI.getAll().then(r => setAppts(r.data)).catch(() => {});

  useEffect(() => {
    load();
    patientsAPI.getAll().then(r => setPatients(r.data));
    API.get('/users/doctors').then(r => setDoctors(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      await appointmentsAPI.add(form);
      setForm(blank); setShowForm(false); load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving appointment');
    }
  };

  const updateStatus = async (id, status) => {
    await appointmentsAPI.update(id, { status });
    setAppts(prev => prev.map(a => a._id === id ? { ...a, status } : a));
  };

  const canAdd = ['Administrator', 'Doctor', 'Receptionist'].includes(user?.role);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Appointments</h4>
        {canAdd && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
            <FaPlus className="me-1" /> Add Appointment
          </button>
        )}
      </div>

      {showForm && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h6>New Appointment</h6>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleSubmit} className="row g-2">
              <div className="col-md-6">
                <select className="form-select form-select-sm" value={form.patientId}
                  onChange={e => setForm({ ...form, patientId: e.target.value })} required>
                  <option value="">-- Select Patient --</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.patientNumber} — {p.firstName} {p.lastName}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <select className="form-select form-select-sm" value={form.doctorId}
                  onChange={e => setForm({ ...form, doctorId: e.target.value })} required>
                  <option value="">-- Select Doctor --</option>
                  {doctors.map(d => <option key={d._id} value={d._id}>{d.fullName}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <input type="date" className="form-control form-control-sm" value={form.appointmentDate}
                  onChange={e => setForm({ ...form, appointmentDate: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <input type="time" className="form-control form-control-sm" value={form.appointmentTime}
                  onChange={e => setForm({ ...form, appointmentTime: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <input className="form-control form-control-sm" placeholder="Reason" value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })} />
              </div>
              <div className="col-12 d-flex gap-2">
                <button className="btn btn-primary btn-sm">Save</button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover table-sm align-middle">
            <thead className="table-primary">
              <tr><th>#</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {appts.map((a, i) => (
                <tr key={a._id}>
                  <td>{i + 1}</td>
                  <td>{a.patientId?.firstName} {a.patientId?.lastName} <span className="badge bg-secondary">{a.patientId?.patientNumber}</span></td>
                  <td>{a.doctorId?.fullName}</td>
                  <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                  <td>{a.appointmentTime}</td>
                  <td>{a.reason}</td>
                  <td><span className={`badge bg-${statusColor[a.status]}`}>{a.status}</span></td>
                  <td>
                    <select className="form-select form-select-sm" style={{ width: 120 }} value={a.status}
                      onChange={e => updateStatus(a._id, e.target.value)}>
                      <option>Pending</option><option>Completed</option><option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {!appts.length && <tr><td colSpan={8} className="text-center text-muted">No appointments</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
