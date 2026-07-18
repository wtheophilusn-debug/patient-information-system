import { useEffect, useState } from 'react';
import { usersAPI } from '../services/api';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const ROLES = ['Administrator','Receptionist','Nurse','Doctor','Patient'];
const blank = { fullName:'', username:'', email:'', password:'', role:'Receptionist' };

export default function Users() {
  const [users, setUsers]     = useState([]);
  const [form, setForm]       = useState(blank);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError]     = useState('');

  const load = () => usersAPI.getAll().then(r => setUsers(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editing) { await usersAPI.update(editing, form); }
      else         { await usersAPI.create(form); }
      setForm(blank); setEditing(null); setShowForm(false); load();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error saving user');
    }
  };

  const handleEdit = (u) => {
    setForm({ fullName: u.fullName, username: u.username, email: u.email, password: '', role: u.role });
    setEditing(u._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    await usersAPI.remove(id); load();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">User Management</h4>
        <button className="btn btn-primary btn-sm" onClick={() => { setForm(blank); setEditing(null); setShowForm(!showForm); }}>
          <FaPlus className="me-1" /> Add User
        </button>
      </div>

      {showForm && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h6>{editing ? 'Edit User' : 'New User'}</h6>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleSubmit} className="row g-2">
              <div className="col-md-6"><input className="form-control form-control-sm" placeholder="Full Name" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} required /></div>
              <div className="col-md-6"><input className="form-control form-control-sm" placeholder="Username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required /></div>
              <div className="col-md-6"><input type="email" className="form-control form-control-sm" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
              <div className="col-md-3"><input type="password" className="form-control form-control-sm" placeholder={editing?'New password (optional)':'Password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required={!editing} /></div>
              <div className="col-md-3">
                <select className="form-select form-select-sm" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="col-12 d-flex gap-2">
                <button className="btn btn-primary btn-sm">{editing?'Update':'Create'}</button>
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
              <tr><th>#</th><th>Full Name</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id}>
                  <td>{i+1}</td>
                  <td>{u.fullName}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td><span className="badge bg-primary">{u.role}</span></td>
                  <td className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(u)}><FaEdit /></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u._id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
              {!users.length && <tr><td colSpan={6} className="text-center text-muted">No users found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
