import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Track() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get('/complaints/my');
        setComplaints(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FFC107'; // Yellow
      case 'in_progress': return '#2196F3'; // Blue
      case 'resolved': return 'var(--accent-teal)'; // Green
      default: return '#fff';
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-secondary)' }}>Loading tracking hub...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto' }}>
      <h2 style={{ marginBottom: '30px', color: 'var(--text-primary)' }}>My Filed Reports</h2>
      
      {complaints.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '1.1rem' }}>You haven't filed any complaints yet.</p>
          <Link to="/submit" className="btn btn-primary" style={{ textDecoration: 'none' }}>Report an Issue Now</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {complaints.map(complaint => (
            <div key={complaint._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', color: 'var(--accent-teal)' }}>{complaint.issueType}</h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
                  ID: {complaint.complaintId} | {new Date(complaint.createdAt).toLocaleDateString()}
                </div>
                <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{complaint.location.address}</div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
                <span className="badge" style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  color: getStatusColor(complaint.status), 
                  border: `1px solid ${getStatusColor(complaint.status)}`,
                  padding: '6px 16px',
                  fontSize: '0.85rem',
                  letterSpacing: '0.5px'
                }}>
                  {complaint.status.replace('_', ' ').toUpperCase()}
                </span>
                <Link to={`/result/${complaint._id}`} style={{ color: 'var(--accent-orange)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 'bold' }}>
                  View Full Report →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
