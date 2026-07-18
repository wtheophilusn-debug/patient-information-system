import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Consultations() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ patientId: '', symptoms: '', diagnosis: '', prescription: '' });
  const [consultations, setConsultations] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/patients').then(r => setPatients(r.data));
  }, []);

  const handlePatientChange = async (e) => {
    const id = e.target.value;
    setForm(f => ({ ...f, patientId: id }));
    if (id) {
      const r = await api.get(`/consultations/${id}`);
      setConsultations(r.data);
    } else setConsultations([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/consultations', form);
    setMsg('Consultation recorded successfully');
    const r = await api.get(`/consultations/${form.patientId}`);
    setConsultations(r.data);
    setForm(f => ({ ...f, symptoms: '', diagnosis: '', prescription: '' }));
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div>
      <h4 className="mb-4">Consultations</h4>
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
                <label className="form-label">Symptoms</label>
                <textarea className="form-control" rows={2} value={form.symptoms}
                  onChange={e => setForm(f => ({ ...f, symptoms: e.target.value }))} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Diagnosis</label>
                <textarea className="form-control" rows={2} value={form.diagnosis}
                  onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Prescription</label>
                <textarea className="form-control" rows={2} value={form.prescription}
                  onChange={e => setForm(f => ({ ...f, prescription: e.target.value }))} required />
              </div>
              <button className="btn btn-primary w-100">Save Consultation</button>
            </form>
          </div>
        </div>
        <div className="col-md-7">
          {consultations.length > 0 && (
            <div className="card p-3">
              <h6 className="mb-3">Consultation History</h6>
              <table className="table table-sm table-bordered">
                <thead className="table-light">
                  <tr><th>Date</th><th>Symptoms</th><th>Diagnosis</th><th>Prescription</th></tr>
                </thead>
                <tbody>
                  {consultations.map(c => (
                    <tr key={c._id}>
                      <td>{new Date(c.consultationDate).toLocaleDateString()}</td>
                      <td>{c.symptoms}</td>
                      <td>{c.diagnosis}</td>
                      <td>{c.prescription}</td>
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
