import { useEffect, useState } from 'react';
import { reportsAPI } from '../services/api';

export default function Reports() {
  const [patients, setPatients]         = useState(null);
  const [consultations, setConsultations] = useState(null);
  const [appointments, setAppointments] = useState(null);
  const [users, setUsers]               = useState(null);

  useEffect(() => {
    reportsAPI.patients().then(r => setPatients(r.data)).catch(() => {});
    reportsAPI.consultations().then(r => setConsultations(r.data)).catch(() => {});
    reportsAPI.appointments().then(r => setAppointments(r.data)).catch(() => {});
    reportsAPI.users().then(r => setUsers(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h4 className="mb-4">Reports</h4>
      <div className="row g-4">

        {/* Patients */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white">Patient Report</div>
            <div className="card-body">
              <p><strong>Total Patients:</strong> {patients?.total}</p>
              <h6>By Gender</h6>
              <table className="table table-sm"><tbody>
                {patients?.byGender.map(g => <tr key={g._id}><td>{g._id}</td><td>{g.count}</td></tr>)}
              </tbody></table>
              <h6>By Province</h6>
              <table className="table table-sm"><tbody>
                {patients?.byProvince.map(p => <tr key={p._id}><td>{p._id}</td><td>{p.count}</td></tr>)}
              </tbody></table>
            </div>
          </div>
        </div>

        {/* Consultations */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-success text-white">Consultation Report</div>
            <div className="card-body">
              <p><strong>Total Consultations:</strong> {consultations?.total}</p>
              <h6>Monthly</h6>
              <table className="table table-sm"><thead><tr><th>Year</th><th>Month</th><th>Count</th></tr></thead>
                <tbody>
                  {consultations?.monthly.map((m, i) => (
                    <tr key={i}><td>{m._id.year}</td><td>{m._id.month}</td><td>{m.count}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-warning">Appointment Report</div>
            <div className="card-body">
              <p><strong>Total Appointments:</strong> {appointments?.total}</p>
              <h6>By Status</h6>
              <table className="table table-sm"><tbody>
                {appointments?.byStatus.map(s => <tr key={s._id}><td>{s._id}</td><td>{s.count}</td></tr>)}
              </tbody></table>
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-danger text-white">User Report</div>
            <div className="card-body">
              <p><strong>Total Users:</strong> {users?.total}</p>
              <h6>By Role</h6>
              <table className="table table-sm"><tbody>
                {users?.byRole.map(r => <tr key={r._id}><td>{r._id}</td><td>{r.count}</td></tr>)}
              </tbody></table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
