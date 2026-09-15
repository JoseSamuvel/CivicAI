import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ textAlign: 'center', margin: '60px auto', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Welcome to <span style={{ color: 'var(--accent-orange)' }}>CivicAI</span>
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3.5rem', lineHeight: '1.6' }}>
        The next-generation municipal grievance platform backed by Artificial Intelligence. 
        Report seamlessly, route accurately, and resolve swiftly.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
        <div className="card" style={{ padding: '40px 20px' }}>
          <h2 style={{ fontSize: '3rem', color: 'var(--accent-teal)', margin: '0 0 10px 0' }}>8,432</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontWeight: '600' }}>TOTAL ISSUES RESOLVED</p>
        </div>
        <div className="card" style={{ padding: '40px 20px' }}>
          <h2 style={{ fontSize: '3rem', color: 'var(--accent-orange)', margin: '0 0 10px 0' }}>94%</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontWeight: '600' }}>AI ROUTING ACCURACY</p>
        </div>
      </div>

      {user ? (
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          <Link to="/submit" className="btn btn-primary" style={{ padding: '15px 30px', fontSize: '1.2rem', textDecoration: 'none', boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)' }}>
            Report an Issue
          </Link>
          <Link to="/track" className="btn btn-secondary" style={{ padding: '15px 30px', fontSize: '1.2rem', textDecoration: 'none', background: 'transparent', border: '2px solid var(--accent-teal)', color: 'var(--accent-teal)' }}>
            Track My Reports
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: '2rem', padding: '30px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
          <p style={{ marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Securely authenticate to begin interfacing directly with local authorities.</p>
          <Link to="/login" className="btn btn-primary" style={{ padding: '12px 28px', textDecoration: 'none', fontSize: '1.1rem' }}>Login to Dashboard</Link>
        </div>
      )}
    </div>
  );
}
