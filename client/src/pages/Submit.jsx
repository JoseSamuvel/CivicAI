import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const ISSUES = [
  { id: 'Pothole', emoji: '🕳️', label: 'Pothole' },
  { id: 'Garbage', emoji: '🗑️', label: 'Garbage' },
  { id: 'Streetlight', emoji: '💡', label: 'Streetlight' },
  { id: 'WaterLeak', emoji: '💧', label: 'Water Leak' },
  { id: 'Drainage', emoji: '🌊', label: 'Blocked Drain' },
  { id: 'Traffic', emoji: '🚦', label: 'Traffic Signal' },
  { id: 'FallenTree', emoji: '🌳', label: 'Fallen Tree' },
  { id: 'Animal', emoji: '🐕', label: 'Stray Animal' },
  { id: 'Encroachment', emoji: '🚧', label: 'Encroachment' },
  { id: 'AirPollution', emoji: '🌫️', label: 'Air Pollution' },
  { id: 'Noise', emoji: '🔊', label: 'Noise Disturbance' },
  { id: 'PublicToilet', emoji: '🚽', label: 'Public Toilet' },
  { id: 'Other', emoji: '❓', label: 'Other' },
];

export default function Submit() {
  const [step, setStep] = useState(1);
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null, address: '', city: 'Unknown' });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const detectLocation = () => {
    setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'GPS Detetected Location',
            city: 'Detected City'
          });
          setGpsLoading(false);
          toast.success('Location detected!');
        },
        (error) => {
          setGpsLoading(false);
          toast.error('Unable to retrieve location.');
        }
      );
    } else {
      setGpsLoading(false);
      toast.error('Geolocation is not supported.');
    }
  };

  const submitComplaint = async () => {
    if (!description || !location.lat) {
      return toast.error('Please provide a description and detect your GPS location.');
    }
    setLoading(true);
    setStep(3);

    const formData = new FormData();
    formData.append('issueType', issueType);
    formData.append('description', description);
    formData.append('location', JSON.stringify(location));
    if (image) {
      formData.append('image', image);
    }

    try {
      const { data } = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Complaint Successfully Logged!');
      navigate('/result/' + data._id);
    } catch (error) {
      setStep(2);
      setLoading(false);
      toast.error('Failed to submit: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto' }}>
      <div className="card">
        <h2 style={{ marginBottom: '20px', color: 'var(--accent-teal)' }}>Report a New Issue - Step {step} of 3</h2>
        
        {step === 1 && (
          <div>
            <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>Select the category that best describes your issue:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
              {ISSUES.map(issue => (
                <div 
                  key={issue.id}
                  onClick={() => { setIssueType(issue.id); setStep(2); }}
                  style={{ 
                    padding: '20px', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '8px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-teal)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{issue.emoji}</div>
                  <div style={{ fontWeight: '500' }}>{issue.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: '15px' }}>Details for: {issueType}</h3>
            
            <textarea 
              className="input-field" 
              rows="4" 
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
              <button onClick={detectLocation} className="btn" style={{ background: 'var(--bg-dark)', border: '1px solid var(--accent-orange)', color: 'var(--text-primary)' }}>
                {gpsLoading ? 'Detecting...' : '📍 Detect GPS Location'}
              </button>
              {location.lat && <span style={{ color: 'var(--accent-teal)', fontSize: '0.9rem', fontWeight: 'bold' }}>✓ Location captured</span>}
            </div>

            <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Upload Photographic Evidence (Optional)</label>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ color: 'var(--text-primary)' }} />
            </div>
            
            {imagePreview && (
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', border: '2px solid var(--accent-orange)' }} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => setStep(1)} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>Back</button>
              <button onClick={submitComplaint} className="btn btn-primary" style={{ flex: 1 }}>Submit to AI for Processing</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-orange)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <h3 style={{ marginTop: '20px', color: 'var(--text-primary)' }}>AI is analyzing and routing your complaint...</h3>
            <p style={{ color: 'var(--text-secondary)' }}>This takes a few seconds.</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>
    </div>
  );
}
