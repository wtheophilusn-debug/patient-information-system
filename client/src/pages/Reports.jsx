import { useEffect, useState } from 'react';
import { reportsAPI } from '../services/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, WidthType, BorderStyle } from 'docx';

const MONTHS = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Reports() {
  const [patients,      setPatients]      = useState(null);
  const [consultations, setConsultations] = useState(null);
  const [appointments,  setAppointments]  = useState(null);
  const [users,         setUsers]         = useState(null);

  useEffect(() => {
    reportsAPI.patients().then(r => setPatients(r.data)).catch(() => {});
    reportsAPI.consultations().then(r => setConsultations(r.data)).catch(() => {});
    reportsAPI.appointments().then(r => setAppointments(r.data)).catch(() => {});
    reportsAPI.users().then(r => setUsers(r.data)).catch(() => {});
  }, []);

  // ── Excel Export ──────────────────────────────────────────
  const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Patients sheet
    const patientData = [
      ['Patient Report'],
      ['Total Patients', patients?.total],
      [],
      ['By Gender'],
      ['Gender', 'Count'],
      ...(patients?.byGender.map(g => [g._id, g.count]) || []),
      [],
      ['By Province'],
      ['Province', 'Count'],
      ...(patients?.byProvince.map(p => [p._id, p.count]) || []),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(patientData), 'Patients');

    // Consultations sheet
    const consultData = [
      ['Consultation Report'],
      ['Total Consultations', consultations?.total],
      [],
      ['Monthly Consultations'],
      ['Year', 'Month', 'Count'],
      ...(consultations?.monthly.map(m => [m._id.year, MONTHS[m._id.month], m.count]) || []),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(consultData), 'Consultations');

    // Appointments sheet
    const apptData = [
      ['Appointment Report'],
      ['Total Appointments', appointments?.total],
      [],
      ['By Status'],
      ['Status', 'Count'],
      ...(appointments?.byStatus.map(s => [s._id, s.count]) || []),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(apptData), 'Appointments');

    // Users sheet
    const userData = [
      ['User Report'],
      ['Total Users', users?.total],
      [],
      ['By Role'],
      ['Role', 'Count'],
      ...(users?.byRole.map(r => [r._id, r.count]) || []),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(userData), 'Users');

    XLSX.writeFile(wb, `PIS_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  // ── Word Export ───────────────────────────────────────────
  const exportWord = async () => {
    const makeTable = (headers, rows) => new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: headers.map(h => new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
          })),
        }),
        ...rows.map(row => new TableRow({
          children: row.map(cell => new TableCell({
            children: [new Paragraph(String(cell ?? ''))],
          })),
        })),
      ],
    });

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: 'Patient Information System — Reports', heading: HeadingLevel.TITLE }),
          new Paragraph({ text: `Generated: ${new Date().toLocaleString()}`, spacing: { after: 400 } }),

          new Paragraph({ text: '1. Patient Report', heading: HeadingLevel.HEADING_1 }),
          new Paragraph(`Total Patients: ${patients?.total}`),
          new Paragraph({ text: 'By Gender', heading: HeadingLevel.HEADING_2 }),
          makeTable(['Gender', 'Count'], patients?.byGender.map(g => [g._id, g.count]) || []),
          new Paragraph({ text: 'By Province', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }),
          makeTable(['Province', 'Count'], patients?.byProvince.map(p => [p._id, p.count]) || []),

          new Paragraph({ text: '2. Consultation Report', heading: HeadingLevel.HEADING_1, spacing: { before: 400 } }),
          new Paragraph(`Total Consultations: ${consultations?.total}`),
          new Paragraph({ text: 'Monthly', heading: HeadingLevel.HEADING_2 }),
          makeTable(['Year', 'Month', 'Count'], consultations?.monthly.map(m => [m._id.year, MONTHS[m._id.month], m.count]) || []),

          new Paragraph({ text: '3. Appointment Report', heading: HeadingLevel.HEADING_1, spacing: { before: 400 } }),
          new Paragraph(`Total Appointments: ${appointments?.total}`),
          new Paragraph({ text: 'By Status', heading: HeadingLevel.HEADING_2 }),
          makeTable(['Status', 'Count'], appointments?.byStatus.map(s => [s._id, s.count]) || []),

          new Paragraph({ text: '4. User Report', heading: HeadingLevel.HEADING_1, spacing: { before: 400 } }),
          new Paragraph(`Total Users: ${users?.total}`),
          new Paragraph({ text: 'By Role', heading: HeadingLevel.HEADING_2 }),
          makeTable(['Role', 'Count'], users?.byRole.map(r => [r._id, r.count]) || []),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `PIS_Report_${new Date().toLocaleDateString()}.docx`);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Reports</h4>
        <div className="d-flex gap-2">
          <button className="btn btn-success btn-sm" onClick={exportExcel}>
            📊 Export Excel
          </button>
          <button className="btn btn-primary btn-sm" onClick={exportWord}>
            📄 Export Word
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Patients */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white fw-bold">Patient Report</div>
            <div className="card-body">
              <p><strong>Total Patients:</strong> {patients?.total}</p>
              <h6>By Gender</h6>
              <table className="table table-sm table-bordered">
                <thead className="table-light"><tr><th>Gender</th><th>Count</th></tr></thead>
                <tbody>{patients?.byGender.map(g => <tr key={g._id}><td>{g._id}</td><td>{g.count}</td></tr>)}</tbody>
              </table>
              <h6 className="mt-3">By Province</h6>
              <table className="table table-sm table-bordered">
                <thead className="table-light"><tr><th>Province</th><th>Count</th></tr></thead>
                <tbody>{patients?.byProvince.map(p => <tr key={p._id}><td>{p._id}</td><td>{p.count}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Consultations */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-success text-white fw-bold">Consultation Report</div>
            <div className="card-body">
              <p><strong>Total Consultations:</strong> {consultations?.total}</p>
              <h6>Monthly</h6>
              <table className="table table-sm table-bordered">
                <thead className="table-light"><tr><th>Year</th><th>Month</th><th>Count</th></tr></thead>
                <tbody>
                  {consultations?.monthly.map((m, i) => (
                    <tr key={i}><td>{m._id.year}</td><td>{MONTHS[m._id.month]}</td><td>{m.count}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-warning fw-bold">Appointment Report</div>
            <div className="card-body">
              <p><strong>Total Appointments:</strong> {appointments?.total}</p>
              <h6>By Status</h6>
              <table className="table table-sm table-bordered">
                <thead className="table-light"><tr><th>Status</th><th>Count</th></tr></thead>
                <tbody>{appointments?.byStatus.map(s => <tr key={s._id}><td>{s._id}</td><td>{s.count}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-danger text-white fw-bold">User Report</div>
            <div className="card-body">
              <p><strong>Total Users:</strong> {users?.total}</p>
              <h6>By Role</h6>
              <table className="table table-sm table-bordered">
                <thead className="table-light"><tr><th>Role</th><th>Count</th></tr></thead>
                <tbody>{users?.byRole.map(r => <tr key={r._id}><td>{r._id}</td><td>{r.count}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
