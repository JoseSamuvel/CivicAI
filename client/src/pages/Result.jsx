import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function Result() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const { data } = await api.get(`/complaints/${id}`);
        setComplaint(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-secondary)' }}>Loading complaint profile...</div>;
  if (!complaint) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Complaint not found.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ color: 'var(--accent-teal)', margin: '0 0 10px 0' }}>Complaint #{complaint.complaintId}</h2>
            <div style={{ color: 'var(--text-secondary)' }}>Reference ID: <strong>{complaint.referenceNumber}</strong></div>
          </div>
          <span className="badge" style={{ background: complaint.priorityLevel === 'High' ? 'var(--accent-orange)' : 'var(--bg-dark)', border: '1px solid currentColor', fontSize: '0.9rem', padding: '6px 16px' }}>
            {complaint.priorityLevel} Priority
          </span>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', marginBottom: '30px', borderLeft: '4px solid var(--accent-orange)' }}>
          <strong style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)' }}>ROUTED TO AUTHORITY:</strong> 
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{complaint.authorityName}</span> <br/>
          <span style={{ color: 'var(--accent-teal)' }}>{complaint.authorityEmail}</span>
        </div>

        <h3 style={{ marginBottom: '15px', color: 'var(--text-secondary)' }}>Auto-Generated Formal Letter</h3>
        <div style={{ background: '#050914', padding: '25px', borderRadius: '8px', whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem' }}>
          {complaint.aiGeneratedComplaint}
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => window.print()} className="btn btn-secondary" style={{ display: 'flex', gap: '8px' }}>
            <span>🖨️</span> Save PDF / Print
          </button>
          <Link to="/submit" className="btn btn-primary" style={{ textDecoration: 'none', flex: 1, textAlign: 'center' }}>Report Another Issue</Link>
        </div>
      </div>
    </div>
  );
}
