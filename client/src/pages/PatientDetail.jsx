import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { patientsAPI, parametersAPI, consultationsAPI, appointmentsAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PatientDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [patient, setPatient]         = useState(null);
  const [vitals, setVitals]           = useState([]);
  const [consults, setConsults]       = useState([]);
  const [appts, setAppts]             = useState([]);
  const [doctors, setDoctors]         = useState([]);
  const [vForm, setVForm]             = useState({ weight:'', height:'', temperature:'' });
  const [cForm, setCForm]             = useState({ symptoms:'', diagnosis:'', prescription:'' });
  const [aForm, setAForm]             = useState({ doctorId:'', appointmentDate:'', appointmentTime:'', reason:'' });
  const [activeTab, setActiveTab]     = useState('vitals');

  const load = async () => {
    const [p, v, c, a] = await Promise.all([
      patientsAPI.getOne(id),
      parametersAPI.getAll(id),
      consultationsAPI.getAll(id),
      appointmentsAPI.getAll(),
    ]);
    setPatient(p.data);
    setVitals(v.data);
    setConsults(c.data);
    setAppts(a.data.filter(x => x.patientId?._id === id || x.patientId === id));
    if (['Administrator','Doctor'].includes(user.role)) {
      const u = await usersAPI.getAll();
      setDoctors(u.data.filter(x => x.role === 'Doctor'));
    }
  };

  useEffect(() => { load(); }, [id]);

  const saveVital = async (e) => {
    e.preventDefault();
    await parametersAPI.add({ ...vForm, patientId: id });
    setVForm({ weight:'', height:'', temperature:'' });
    load();
  };

  const saveConsult = async (e) => {
    e.preventDefault();
    await consultationsAPI.add({ ...cForm, patientId: id });
    setCForm({ symptoms:'', diagnosis:'', prescription:'' });
    load();
  };

  const saveAppt = async (e) => {
    e.preventDefault();
    await appointmentsAPI.add({ ...aForm, patientId: id });
    setAForm({ doctorId:'', appointmentDate:'', appointmentTime:'', reason:'' });
    load();
  };

  if (!patient) return <div className="text-center p-5">Loading...</div>;

  return (
    <div>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5 className="mb-1">{patient.firstName} {patient.lastName}
                <span className="badge bg-primary ms-2">{patient.patientNumber}</span>
              </h5>
              <div className="text-muted small">
                {patient.gender} · DOB: {new Date(patient.dob).toLocaleDateString()} · {patient.phone}
              </div>
              <div className="text-muted small">{patient.sector}, {patient.district}, {patient.province}</div>
            </div>
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs mb-3">
        {['vitals','consultations','appointments'].map(t => (
          <li key={t} className="nav-item">
            <button className={`nav-link ${activeTab===t?'active':''}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* Vitals Tab */}
      {activeTab === 'vitals' && (
        <div>
          {['Administrator','Nurse'].includes(user.role) && (
            <div className="card mb-3 shadow-sm">
              <div className="card-body">
                <h6>Record Vitals</h6>
                <form onSubmit={saveVital} className="row g-2">
                  <div className="col-md-4"><input className="form-control form-control-sm" type="number" step="0.1" placeholder="Weight (kg)" value={vForm.weight} onChange={e=>setVForm({...vForm,weight:e.target.value})} /></div>
                  <div className="col-md-4"><input className="form-control form-control-sm" type="number" step="0.1" placeholder="Height (cm)" value={vForm.height} onChange={e=>setVForm({...vForm,height:e.target.value})} /></div>
                  <div className="col-md-4"><input className="form-control form-control-sm" type="number" step="0.1" placeholder="Temperature (°C)" value={vForm.temperature} onChange={e=>setVForm({...vForm,temperature:e.target.value})} /></div>
                  <div className="col-12"><button className="btn btn-primary btn-sm">Save Vitals</button></div>
                </form>
              </div>
            </div>
          )}
          <table className="table table-sm table-hover">
            <thead className="table-primary"><tr><th>Date</th><th>Weight</th><th>Height</th><th>Temp</th><th>By</th></tr></thead>
            <tbody>
              {vitals.map(v => (
                <tr key={v._id}>
                  <td>{new Date(v.createdAt).toLocaleDateString()}</td>
                  <td>{v.weight} kg</td><td>{v.height} cm</td><td>{v.temperature} °C</td>
                  <td>{v.recordedBy?.fullName}</td>
                </tr>
              ))}
              {!vitals.length && <tr><td colSpan={5} className="text-center text-muted">No vitals recorded</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Consultations Tab */}
      {activeTab === 'consultations' && (
        <div>
          {['Administrator','Doctor'].includes(user.role) && (
            <div className="card mb-3 shadow-sm">
              <div className="card-body">
                <h6>New Consultation</h6>
                <form onSubmit={saveConsult} className="row g-2">
                  <div className="col-12"><textarea className="form-control form-control-sm" rows={2} placeholder="Symptoms" value={cForm.symptoms} onChange={e=>setCForm({...cForm,symptoms:e.target.value})} /></div>
                  <div className="col-12"><textarea className="form-control form-control-sm" rows={2} placeholder="Diagnosis" value={cForm.diagnosis} onChange={e=>setCForm({...cForm,diagnosis:e.target.value})} /></div>
                  <div className="col-12"><textarea className="form-control form-control-sm" rows={2} placeholder="Prescription" value={cForm.prescription} onChange={e=>setCForm({...cForm,prescription:e.target.value})} /></div>
                  <div className="col-12"><button className="btn btn-primary btn-sm">Save</button></div>
                </form>
              </div>
            </div>
          )}
          <table className="table table-sm table-hover">
            <thead className="table-primary"><tr><th>Date</th><th>Doctor</th><th>Symptoms</th><th>Diagnosis</th><th>Prescription</th></tr></thead>
            <tbody>
              {consults.map(c => (
                <tr key={c._id}>
                  <td>{new Date(c.consultationDate).toLocaleDateString()}</td>
                  <td>{c.doctorId?.fullName}</td>
                  <td>{c.symptoms}</td><td>{c.diagnosis}</td><td>{c.prescription}</td>
                </tr>
              ))}
              {!consults.length && <tr><td colSpan={5} className="text-center text-muted">No consultations</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div>
          {['Administrator','Doctor'].includes(user.role) && (
            <div className="card mb-3 shadow-sm">
              <div className="card-body">
                <h6>Schedule Appointment</h6>
                <form onSubmit={saveAppt} className="row g-2">
                  <div className="col-md-4">
                    <select className="form-select form-select-sm" value={aForm.doctorId} onChange={e=>setAForm({...aForm,doctorId:e.target.value})} required>
                      <option value="">Select Doctor</option>
                      {doctors.map(d => <option key={d._id} value={d._id}>{d.fullName}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4"><input type="date" className="form-control form-control-sm" value={aForm.appointmentDate} onChange={e=>setAForm({...aForm,appointmentDate:e.target.value})} required /></div>
                  <div className="col-md-4"><input type="time" className="form-control form-control-sm" value={aForm.appointmentTime} onChange={e=>setAForm({...aForm,appointmentTime:e.target.value})} required /></div>
                  <div className="col-12"><input className="form-control form-control-sm" placeholder="Reason" value={aForm.reason} onChange={e=>setAForm({...aForm,reason:e.target.value})} /></div>
                  <div className="col-12"><button className="btn btn-primary btn-sm">Schedule</button></div>
                </form>
              </div>
            </div>
          )}
          <table className="table table-sm table-hover">
            <thead className="table-primary"><tr><th>Date</th><th>Time</th><th>Doctor</th><th>Reason</th><th>Status</th></tr></thead>
            <tbody>
              {appts.map(a => (
                <tr key={a._id}>
                  <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                  <td>{a.appointmentTime}</td>
                  <td>{a.doctorId?.fullName}</td>
                  <td>{a.reason}</td>
                  <td><span className={`badge bg-${a.status==='Completed'?'success':a.status==='Cancelled'?'danger':'warning'}`}>{a.status}</span></td>
                </tr>
              ))}
              {!appts.length && <tr><td colSpan={5} className="text-center text-muted">No appointments</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
