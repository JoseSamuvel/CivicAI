import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/register', form);
      login(response.data.user, response.data.token);
      toast.success('Node Generation successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--accent-teal)' }}>Register Network Node</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Full Name" 
            className="input-field" 
            value={form.name} 
            onChange={(e) => setForm({...form, name: e.target.value})} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            className="input-field" 
            value={form.email} 
            onChange={(e) => setForm({...form, email: e.target.value})} 
            required 
          />
          <input 
            type="password" 
            placeholder="Security Password" 
            className="input-field" 
            value={form.password} 
            onChange={(e) => setForm({...form, password: e.target.value})} 
            required 
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Generating...' : 'Activate Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
          Already connected? <Link to="/login" style={{ color: 'var(--accent-orange)', textDecoration: 'none' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}
