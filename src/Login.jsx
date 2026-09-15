import React, { useState } from 'react';

export default function Login({ onLogin, intendedTab }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    if (email === 'admin@civic.com' && password === 'admin123') {
      onLogin?.({ email, name: 'Admin', role: 'admin' });
    } else {
      onLogin?.({ email, name: email.split('@')[0], role: 'user' });
    }
  };

  return (
    <div className="login-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          font-family: 'Inter', sans-serif;
          position: relative;
        }

        .login-card {
          background: var(--card, #0F1A2E);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 1;
          transform: translateY(0);
          transition: transform 0.4s ease, border-color 0.4s ease;
        }

        .login-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--accent, #FF6B35), var(--accent2, #00C9A7));
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          box-shadow: 0 10px 20px rgba(0, 201, 167, 0.15);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .login-header h1 {
          color: var(--text, #E8EBF4);
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          letter-spacing: -0.025em;
        }

        .login-header p {
          color: var(--muted, #6B7794);
          font-size: 0.95rem;
          font-weight: 400;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text, #E8EBF4);
          margin-bottom: 0.5rem;
        }

        .input-wrapper {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 2.75rem;
          border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
          border-radius: 12px;
          font-size: 1rem;
          color: var(--text, #E8EBF4);
          background: var(--bg2, #0D1525);
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent2, #00C9A7);
          box-shadow: 0 0 0 4px rgba(0, 201, 167, 0.1);
        }

        .form-input::placeholder {
          color: var(--muted, #6B7794);
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted, #6B7794);
          width: 18px;
          height: 18px;
          transition: color 0.2s ease;
        }

        .form-input:focus + .input-icon, 
        .form-input:not(:placeholder-shown) + .input-icon {
          color: var(--accent2, #00C9A7);
        }

        .login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          font-size: 0.875rem;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text, #E8EBF4);
          font-weight: 500;
          cursor: pointer;
        }

        .remember-me input[type="checkbox"] {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1px solid var(--border, rgba(255,255,255,0.2));
          background: var(--bg3, #111C2E);
          accent-color: var(--accent2, #00C9A7);
          cursor: pointer;
        }

        .forgot-link {
          color: var(--accent2, #00C9A7);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .forgot-link:hover {
          color: #00e0ba;
          text-decoration: underline;
        }

        .submit-btn {
          width: 100%;
          padding: 0.95rem;
          background: linear-gradient(to right, var(--accent, #FF6B35), #ff885e);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25);
          position: relative;
          overflow: hidden;
          font-family: inherit;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, var(--accent2, #00C9A7), #00e0ba);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

        .submit-btn span {
          position: relative;
          z-index: 2;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 201, 167, 0.3);
        }

        .submit-btn:hover::before {
          opacity: 1;
        }

        .submit-btn:active {
          transform: translateY(1px);
        }

        .signup-prompt {
          text-align: center;
          margin-top: 2rem;
          font-size: 0.9rem;
          color: var(--muted, #6B7794);
        }

        .signup-link {
          color: var(--accent2, #00C9A7);
          font-weight: 600;
          text-decoration: none;
          margin-left: 0.35rem;
          transition: color 0.2s;
        }

        .signup-link:hover {
          color: #00e0ba;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 2rem 1.5rem;
            border-radius: 16px;
          }
        }
      `}</style>

      <div className="login-card">
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
        </div>
        
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to report and track civic issues</p>
        </div>

        {intendedTab && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 500, textAlign: 'center' }}>
            Please log in to access {intendedTab === 'admin' ? 'the Admin Dashboard' : (intendedTab === 'reports' ? 'My Reports' : 'this feature')}.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <input 
                type="email" 
                id="email"
                className="form-input" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input 
                type="password" 
                id="password"
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#" className="forgot-link">Forgot Password?</a>
          </div>

          <button type="submit" className="submit-btn">
            <span>Sign In</span>
          </button>
        </form>

        <div className="signup-prompt">
          Don't have an account? 
          <a href="#" className="signup-link">Sign up</a>
        </div>
      </div>
    </div>
  );
}
