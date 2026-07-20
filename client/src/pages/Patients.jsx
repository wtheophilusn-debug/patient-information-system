import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { patientsAPI, usersAPI } from '../services/api';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaSearch, FaEye, FaEdit } from 'react-icons/fa';

const blank = { firstName:'', lastName:'', gender:'Male', dob:'', phone:'', sector:'', district:'', province:'', userId:'' };

export default function Patients() {
  const { user } = useAuth();
  const [patients, setPatients]       = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [patientUsers, setPatientUsers] = useState([]);
  const [q, setQ]               = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(blank);
  const [error, setError]       = useState('');

  const load = async () => {
    try {
      const { data } = await patientsAPI.getAll();
      setAllPatients(data);
      setPatients(data);
    } catch {}
  };

  useEffect(() => {
    load();
    API.get('/users/patients-list').then(r => setPatientUsers(r.data)).catch(() => {});
  }, []);

  // Live search
  useEffect(() => {
    if (!q.trim()) { setPatients(allPatients); return; }
    const lower = q.toLowerCase();
    setPatients(allPatients.filter(p =>
      p.patientNumber?.toLowerCase().includes(lower) ||
      p.firstName?.toLowerCase().includes(lower) ||
      p.lastName?.toLowerCase().includes(lower) ||
      p.phone?.includes(q)
    ));
  }, [q, allPatients]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      const payload = { ...form };
      if (!payload.userId) delete payload.userId;
      if (editing) {
        await patientsAPI.update(editing, payload);
      } else {
        await patientsAPI.create(payload);
      }
      setShowForm(false); setEditing(null); setForm(blank); load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving patient');
    }
  };

  const handleEdit = (p) => {
    setForm({
      firstName: p.firstName, lastName: p.lastName, gender: p.gender,
      dob: p.dob?.split('T')[0], phone: p.phone,
      sector: p.sector, district: p.district, province: p.province,
      userId: p.userId || '',
    });
    setEditing(p._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const canEdit = ['Administrator', 'Receptionist'].includes(user?.role);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Patients</h4>
        {canEdit && (
          <button className="btn btn-primary btn-sm" onClick={() => { setForm(blank); setEditing(null); setShowForm(!showForm); }}>
            <FaPlus className="me-1" /> Register Patient
          </button>
        )}
      </div>

      {showForm && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h6 className="card-title">{editing ? 'Edit Patient' : 'New Patient'}</h6>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-2">
                {[['firstName','First Name'],['lastName','Last Name']].map(([k,l]) => (
                  <div key={k} className="col-md-6">
                    <input className="form-control form-control-sm" placeholder={l}
                      value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} required />
                  </div>
                ))}
                <div className="col-md-4">
                  <select className="form-select form-select-sm" value={form.gender}
                    onChange={e => setForm({...form, gender: e.target.value})}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <input type="date" className="form-control form-control-sm" value={form.dob}
                    onChange={e => setForm({...form, dob: e.target.value})} required />
                </div>
                <div className="col-md-4">
                  <input className="form-control form-control-sm" placeholder="Phone"
                    value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
                </div>
                {[['sector','Sector'],['district','District'],['province','Province']].map(([k,l]) => (
                  <div key={k} className="col-md-4">
                    <input className="form-control form-control-sm" placeholder={l}
                      value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} required />
                  </div>
                ))}
                <div className="col-md-12">
                  <select className="form-select form-select-sm" value={form.userId}
                    onChange={e => setForm({...form, userId: e.target.value})}>
                    <option value="">-- Link Patient User Account (optional) --</option>
                    {patientUsers.map(u => <option key={u._id} value={u._id}>{u.fullName} ({u.username})</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-3 d-flex gap-2">
                <button className="btn btn-primary btn-sm">{editing ? 'Update' : 'Save'}</button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex gap-2 mb-3">
            <div className="input-group input-group-sm">
              <span className="input-group-text"><FaSearch /></span>
              <input className="form-control" placeholder="Search by name, number or phone..."
                value={q} onChange={e => setQ(e.target.value)} />
              {q && <button className="btn btn-outline-secondary" onClick={() => setQ('')}>✕</button>}
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover table-sm align-middle">
              <thead className="table-primary">
                <tr><th>#</th><th>Patient No.</th><th>Name</th><th>Gender</th><th>DoB</th><th>Phone</th><th>District</th><th></th></tr>
              </thead>
              <tbody>
                {patients.map((p, i) => (
                  <tr key={p._id}>
                    <td>{i+1}</td>
                    <td><span className="badge bg-primary">{p.patientNumber}</span></td>
                    <td>{p.firstName} {p.lastName}</td>
                    <td>{p.gender}</td>
                    <td>{new Date(p.dob).toLocaleDateString()}</td>
                    <td>{p.phone}</td>
                    <td>{p.district}</td>
                    <td className="d-flex gap-1">
                      <Link to={`/patients/${p._id}`} className="btn btn-sm btn-outline-primary"><FaEye /></Link>
                      {canEdit && <button className="btn btn-sm btn-outline-warning" onClick={() => handleEdit(p)}><FaEdit /></button>}
                    </td>
                  </tr>
                ))}
                {!patients.length && <tr><td colSpan={8} className="text-center text-muted">No patients found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
