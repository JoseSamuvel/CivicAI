import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Admin() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/complaints/all');
      setComplaints(data);
    } catch (error) {
      toast.error('Failed to load global complaints');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/complaints/${id}/status`, { status: newStatus });
      toast.success('Status updated successfully');
      setComplaints(complaints.map(c => c._id === id ? { ...c, status: newStatus } : c));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-secondary)' }}>Booting Command Center...</div>;

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'pending').length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto' }}>
      <h2 style={{ marginBottom: '30px', color: 'var(--accent-orange)' }}>Authority Command Center</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: 'var(--text-secondary)' }}>Total Reports</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '10px' }}>{total}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: 'var(--text-secondary)' }}>Pending Action</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FFC107', marginTop: '10px' }}>{pending}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: 'var(--text-secondary)' }}>Resolutions</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-teal)', marginTop: '10px' }}>{resolved}</div>
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto', padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>ID Reference</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Issue Type</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Location</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Citizen</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Priority</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Status Controls</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(complaint => (
              <tr key={complaint._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'var(--accent-teal)' }}>{complaint.complaintId}</td>
                <td style={{ padding: '15px 20px' }}>{complaint.issueType}</td>
                <td style={{ padding: '15px 20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{complaint.location.address}</td>
                <td style={{ padding: '15px 20px' }}>
                  {complaint.userId?.name} <br/>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{complaint.userId?.email}</span>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <span className="badge" style={{ background: complaint.priorityLevel === 'High' ? '#FF6B35' : 'transparent', border: '1px solid #FF6B35', color: complaint.priorityLevel === 'High' ? '#fff' : '#FF6B35' }}>
                    {complaint.priorityLevel}
                  </span>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <select 
                    value={complaint.status} 
                    onChange={(e) => updateStatus(complaint._id, e.target.value)}
                    style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      color: 'var(--text-primary)', 
                      border: '1px solid rgba(255,255,255,0.2)', 
                      padding: '8px 12px', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="pending" style={{ color: '#000' }}>Pending</option>
                    <option value="in_progress" style={{ color: '#000' }}>In Progress</option>
                    <option value="resolved" style={{ color: '#000' }}>Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {complaints.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No complaints found in the network.</div>
        )}
      </div>
    </div>
  );
}
