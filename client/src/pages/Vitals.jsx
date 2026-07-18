import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Vitals() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ patientId: '', weight: '', height: '', temperature: '' });
  const [vitals, setVitals] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/patients').then(r => setPatients(r.data));
  }, []);

  const handlePatientChange = async (e) => {
    const id = e.target.value;
    setForm(f => ({ ...f, patientId: id }));
    if (id) {
      const r = await api.get(`/parameters/${id}`);
      setVitals(r.data);
    } else setVitals([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/parameters', form);
    setMsg('Vitals recorded successfully');
    const r = await api.get(`/parameters/${form.patientId}`);
    setVitals(r.data);
    setForm(f => ({ ...f, weight: '', height: '', temperature: '' }));
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div>
      <h4 className="mb-4">Record Vitals</h4>
      {msg && <div className="alert alert-success">{msg}</div>}
      <div className="row">
        <div className="col-md-5">
          <div className="card p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Select Patient</label>
                <select className="form-select" value={form.patientId} onChange={handlePatientChange} required>
                  <option value="">-- Select Patient --</option>
                  {patients.map(p => (
                    <option key={p._id} value={p._id}>{p.patientNumber} — {p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Weight (kg)</label>
                <input type="number" step="0.1" className="form-control" value={form.weight}
                  onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Height (cm)</label>
                <input type="number" step="0.1" className="form-control" value={form.height}
                  onChange={e => setForm(f => ({ ...f, height: e.target.value }))} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Temperature (°C)</label>
                <input type="number" step="0.1" className="form-control" value={form.temperature}
                  onChange={e => setForm(f => ({ ...f, temperature: e.target.value }))} required />
              </div>
              <button className="btn btn-primary w-100">Record Vitals</button>
            </form>
          </div>
        </div>
        <div className="col-md-7">
          {vitals.length > 0 && (
            <div className="card p-3">
              <h6 className="mb-3">Vitals History</h6>
              <table className="table table-sm table-bordered">
                <thead className="table-light">
                  <tr><th>Date</th><th>Weight</th><th>Height</th><th>Temp</th></tr>
                </thead>
                <tbody>
                  {vitals.map(v => (
                    <tr key={v._id}>
                      <td>{new Date(v.recordedAt).toLocaleDateString()}</td>
                      <td>{v.weight} kg</td>
                      <td>{v.height} cm</td>
                      <td>{v.temperature} °C</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
