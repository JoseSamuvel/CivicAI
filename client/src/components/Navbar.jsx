import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ 
      padding: '1rem 2rem', 
      background: 'var(--bg-card)', 
      display: 'flex', 
      gap: '2rem', 
      alignItems: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    }}>
      <Link to="/" style={{ 
        fontWeight: '900', 
        fontSize: '1.5rem', 
        color: 'var(--accent-orange)',
        textDecoration: 'none',
        letterSpacing: '1px'
      }}>
        CivicAI
      </Link>
      
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/submit" style={{ color: isActive('/submit') ? 'var(--accent-teal)' : '#A0AABF', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s' }}>Report Issue</Link>
            <Link to="/track" style={{ color: isActive('/track') ? 'var(--accent-teal)' : '#A0AABF', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s' }}>Tracking Hub</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: isActive('/admin') ? 'var(--accent-teal)' : '#A0AABF', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s' }}>Admin Panel</Link>
            )}
            <div style={{ paddingLeft: '1.5rem', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Hi, {user.name.split(' ')[0]}</span>
              <button onClick={logout} className="btn" style={{ background: 'transparent', border: '1px solid var(--accent-orange)', color: 'var(--accent-orange)', padding: '6px 12px', fontSize: '0.85rem' }}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#E8EBF4', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>Register Hub</Link>
          </>
        )}
      </div>
    </nav>
  );
}
